
import Contact from "./sections/Contact";
import TechStack from "./sections/TechStack";
import Experience from "./sections/Experience";
import Hero from "./sections/Hero";
import Navbar from "./components/NavBar";
import BackgroundWeb from "./components/BackgroundWeb";

const App = () => (
  <>
    <BackgroundWeb />
    <Navbar />
    <Hero />
    <Experience />
    <TechStack />
    <Contact />
  </>
);

export default App;
