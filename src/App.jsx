import { lazy, Suspense } from "react";

import Hero from "./sections/Hero";
import Navbar from "./components/NavBar";
import GalaxyLayer from "./components/GalaxyLayer";
import { useRoute } from "./lib/useRoute";

const Experience = lazy(() => import("./sections/Experience"));
const Projects = lazy(() => import("./sections/Projects"));
const Blogs = lazy(() => import("./sections/Blogs"));
const TechStack = lazy(() => import("./sections/TechStack"));
const Contact = lazy(() => import("./sections/Contact"));
const Footer = lazy(() => import("./sections/Footer"));
const PostPage = lazy(() => import("./sections/PostPage"));

const SectionLoader = () => (
  <div className="w-full px-5 md:px-20 py-24 flex flex-col gap-6 animate-pulse">
    <div className="mx-auto w-40 h-5 rounded-full bg-black-200" />
    <div className="mx-auto w-72 h-8 rounded-lg bg-black-200" />
    <div className="mt-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-w-5xl mx-auto w-full">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-48 rounded-xl bg-black-200" />
      ))}
    </div>
  </div>
);

// The full scrolling portfolio — everything except an individual post page.
const HomePage = () => (
  <>
    <Hero />
    <Suspense fallback={<SectionLoader />}>
      <Experience />
    </Suspense>
    <Suspense fallback={<SectionLoader />}>
      <Projects />
    </Suspense>
    <Suspense fallback={<SectionLoader />}>
      <Blogs />
    </Suspense>
    <Suspense fallback={<SectionLoader />}>
      <TechStack />
    </Suspense>
    {/* Galaxy zone — starfield + nebula behind the closing sections */}
    <div className="relative">
      <GalaxyLayer />

      {/* Nebula colour blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
        <div className="absolute top-[10%] left-[15%] w-[500px] h-[500px] rounded-full opacity-[0.07]"
             style={{ background: "radial-gradient(circle, #004d98, transparent 70%)", filter: "blur(80px)" }} />
        <div className="absolute top-[40%] right-[10%] w-[400px] h-[400px] rounded-full opacity-[0.06]"
             style={{ background: "radial-gradient(circle, #a50044, transparent 70%)", filter: "blur(90px)" }} />
        <div className="absolute bottom-[20%] left-[40%] w-[350px] h-[350px] rounded-full opacity-[0.05]"
             style={{ background: "radial-gradient(circle, #edbb00, transparent 70%)", filter: "blur(70px)" }} />
        <div className="absolute top-[65%] left-[5%] w-[300px] h-[300px] rounded-full opacity-[0.05]"
             style={{ background: "radial-gradient(circle, #2b6cb8, transparent 70%)", filter: "blur(80px)" }} />
      </div>

      {/* Fade-in from page above */}
      <div className="absolute top-0 left-0 right-0 h-32 pointer-events-none"
           style={{ background: "linear-gradient(to bottom, #0e1628, transparent)", zIndex: 2 }} />

      <div className="relative" style={{ zIndex: 3 }}>
        <Suspense fallback={<SectionLoader />}>
          <Contact />
        </Suspense>
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      </div>
    </div>
  </>
);

const App = () => {
  const route = useRoute();
  const isPost = route.name === "post";

  return (
    <>
      <Navbar />
      {isPost ? (
        <Suspense fallback={<SectionLoader />}>
          <PostPage slug={route.slug} />
        </Suspense>
      ) : (
        <HomePage />
      )}
    </>
  );
};

export default App;
