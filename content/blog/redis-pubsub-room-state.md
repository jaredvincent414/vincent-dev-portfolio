---
title: Holding p95 room state under 10ms with Redis Pub/Sub
date: 2026-05-14
category: deep-dive
summary: Broadcasting room state to 500+ concurrent sessions without the fan-out collapsing under its own write volume.
tags: rust, redis, latency, event-driven
draft: false
---

The first version of room-state sync was a polling loop. Every client asked the
server what the room looked like, twice a second, and the server asked Postgres.
It worked at ten sessions and fell over at two hundred.

## Why polling failed

The cost model is the problem. With $n$ clients polling at interval $t$, the
database sees:

$$
\text{queries per second} = \frac{n}{t}
$$

At $n = 500$ and $t = 0.5\text{s}$ that is 1,000 queries a second to answer a
question whose answer usually has not changed. Worse, the work is proportional
to the number of *listeners* rather than the number of *changes* — exactly
backwards for a room that sits idle most of the time.

## Inverting it

Redis Pub/Sub flips the cost onto writes. A state change publishes once; every
subscriber gets it. Idle rooms cost nothing.

```rust
async fn publish_state(conn: &mut MultiplexedConnection, room: RoomId, state: &RoomState) -> Result<()> {
    let payload = serde_json::to_vec(state)?;
    conn.publish(format!("room:{room}"), payload).await?;
    Ok(())
}
```

The subscriber side holds one connection per process, not one per client, and
fans out over in-process channels:

```rust
let mut stream = pubsub.on_message();
while let Some(msg) = stream.next().await {
    let room: RoomId = parse_channel(msg.get_channel_name())?;
    let state: RoomState = serde_json::from_slice(&msg.get_payload_bytes())?;
    if let Some(subscribers) = rooms.get(&room) {
        subscribers.retain(|tx| tx.send(state.clone()).is_ok());
    }
}
```

That `retain` matters more than it looks. A closed receiver makes `send` fail,
and using the failure to drop the sender is what stops the subscriber map
growing without bound as clients disconnect.

## What actually moved the number

Switching to Pub/Sub got p95 to roughly 40ms. The remaining three quarters came
from two changes that had nothing to do with Redis:

- **Serialising once per publish rather than once per subscriber.** The naive
  fan-out re-encoded the same state for every listener.
- **Dropping the JSON round-trip on the hot path** in favour of a diff, which
  also cut payloads from about 12KB to under 2KB.

| Stage | p95 |
| --- | --- |
| Polling, 500 sessions | 380ms |
| Pub/Sub, naive fan-out | 41ms |
| Pub/Sub, single encode + diff | 9.4ms |

## The part I got wrong

For a week the diff was computed against a `HashMap` and applied in iteration
order. Rust randomises that order per process, so two servers replaying the same
event log could arrive at different states — rarely, and never on my machine.

The fix was ordering the diff deterministically. The lesson was that the bug
class, not the instance, is what needs a test: a replay-diff check in CI now
recomputes state twice and fails on divergence, which would have caught it on
day one.
