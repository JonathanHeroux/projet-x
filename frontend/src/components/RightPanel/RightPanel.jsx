import { useEffect, useRef, useState } from "react";
import SearchBar from "./SearchBar";
import SubscribePrem from "./SubscribePrem";
import TodaysNews from "./TodaysNews";
import WhatsHappening from "./WhatsHappening";
import WhoToFollow from "./WhoToFollow";
import Footer from "./Footer";
export default function RightPanel() {
  // Reference the panel DOM element to measure its height
  const panelRef = useRef(null);
  // Store the dynamic sticky position of the panel
  const [stickyTop, setStickyTop] = useState(12);
  // Algo made with IA for rightpanel scroll down and stop dynamically with screen variation.
  useEffect(() => {
    // Calculate the sticky position based on the panel and viewport heights
    function updateStickyPosition() {
      if (!panelRef.current) return;

      const panelHeight = panelRef.current.offsetHeight;

      const topGap = 12;
      const bottomGap = 20;

      const newTop = Math.min(
        topGap,
        window.innerHeight - panelHeight - bottomGap,
      );

      setStickyTop(newTop);
    }

    // Calculate the initial position
    updateStickyPosition();

    // Recalculate when the viewport size changes
    window.addEventListener("resize", updateStickyPosition);

    // Detect changes in the panel's dimensions
    const observer = new ResizeObserver(updateStickyPosition);

    if (panelRef.current) {
      observer.observe(panelRef.current);
    }

    // Clean up listeners and observers when the component unmounts
    return () => {
      window.removeEventListener("resize", updateStickyPosition);
      observer.disconnect();
    };
  }, []);
  return (
    <aside
      ref={panelRef}
      className="sticky shrink-0 w-90 ml-7 self-start"
      style={{ top: `${stickyTop}px` }}
    >
      {/* Right sidebar content */}
      <div className="flex flex-col">
        <SearchBar />
        <SubscribePrem />
        <TodaysNews />
        <WhatsHappening />
        <WhoToFollow />
        <Footer />
      </div>
    </aside>
  );
}
