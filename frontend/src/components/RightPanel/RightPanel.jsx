import SearchBar from "./SearchBar";
import SubscribePrem from "./SubscribePrem";
import TodaysNews from "./TodaysNews";
import WhatsHappening from "./WhatsHappening";
import WhoToFollow from "./WhoToFollow";
import Footer from "./Footer";
export default function RightPanel() {
  return (
    <aside className="w-90 ml-7 mt-3">
      <div className="flex flex-col h-full">
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
