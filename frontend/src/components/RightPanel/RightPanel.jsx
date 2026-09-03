import { useEffect, useRef, useState } from "react";
import SearchBar from "./SearchBar";
import SubscribePrem from "./SubscribePrem";
import TodaysNews from "./TodaysNews";
import WhatsHappening from "./WhatsHappening";
import WhoToFollow from "./WhoToFollow";
import Footer from "./Footer";
export default function RightPanel() {
  const panelRef = useRef(null);
  const [stickyTop, setStickyTop] = useState(12);
  // Algo made with IA for rightpanel scroll down and stop dynamically with screen variation.
  useEffect(() => {
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

    updateStickyPosition();

    window.addEventListener("resize", updateStickyPosition);

    const observer = new ResizeObserver(updateStickyPosition);

    if (panelRef.current) {
      observer.observe(panelRef.current);
    }

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
