// The blog's category list, kept in its own module so both the site and the
// `npm run post` scaffolder read the same source. Declaring the order here
// (rather than deriving it from the posts) keeps the category nav stable as
// posts come and go — otherwise publishing could silently reorder the index.
export const CATEGORY_ORDER = [
  "Systems",
  "Engineering",
  "Machine Learning",
  "Notes",
];

// Where a post lands when it declares no category of its own.
export const UNCATEGORISED = "Notes";
