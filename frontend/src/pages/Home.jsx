import HomeHeader from "../components/Home/HomeHeader";
import RootLayout from "../layouts/RootLayout";
import HomePost from "../components/Home/HomePost";
import Feed from "../components/Feed/Feed";
export default function Home() {
  return (
    <section>
      <HomeHeader />
      <HomePost />
      <Feed />
    </section>
  );
}
