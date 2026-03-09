import { lazy, Suspense } from "react";

import Hero from "./sections/Hero";
import Navbar from "./components/NavBar";
import BackgroundWeb from "./components/BackgroundWeb";

const Experience = lazy(() => import("./sections/Experience"));
const Organisations = lazy(() => import("./sections/Organisations"));
const TechStack = lazy(() => import("./sections/TechStack"));
const Contact = lazy(() => import("./sections/Contact"));
const Footer = lazy(() => import("./sections/Footer"));

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

const App = () => (
  <>
    <BackgroundWeb />
    <Navbar />
    <Hero />
    <Suspense fallback={<SectionLoader />}>
      <Experience />
    </Suspense>
    <Suspense fallback={<SectionLoader />}>
      <TechStack />
    </Suspense>
    <Suspense fallback={<SectionLoader />}>
      <Organisations />
    </Suspense>
    <Suspense fallback={<SectionLoader />}>
      <Contact />
    </Suspense>
    <Suspense fallback={null}>
      <Footer />
    </Suspense>
  </>
);

export default App;
