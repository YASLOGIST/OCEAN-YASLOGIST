import { useEffect } from "react";
import { startScrollLoop } from "./lib/scroll";
import { ThemeProvider } from "./lib/theme";
import { LangProvider } from "./lib/i18n";
import Background from "./components/Background";
import Hud from "./components/Hud";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Stats from "./components/Stats";
import Solutions from "./components/Solutions";
import Simulator from "./components/Simulator";
import Pillars from "./components/Pillars";
import Closing from "./components/Closing";
import CrossModalHandoff from "./components/CrossModalHandoff";
import Footer from "./components/Footer";

export default function App() {
  /* startScrollLoop returns its own disposer — cancels the rAF, the watchdog,
     the ResizeObserver and every listener, so a StrictMode remount or an HMR
     module swap cannot leave a second engine running. */
  useEffect(() => startScrollLoop(), []);

  return (
    <ThemeProvider>
      <LangProvider>
        <div className="relative min-h-screen overflow-x-clip font-sans text-ice antialiased">
          <Background />
          <Navbar />
          <Hud />
          <main className="relative z-10">
            <Hero />
            <Stats />
            <Solutions />
            <Simulator />
            <Pillars />
          </main>
          <CrossModalHandoff />
          <Closing />
          <Footer />
        </div>
      </LangProvider>
    </ThemeProvider>
  );
}
