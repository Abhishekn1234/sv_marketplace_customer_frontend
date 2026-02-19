import CommonFaq from "@/components/common/CommonFaq";


import AboutHero from "./components/AboutHero";
import AboutStats from "./components/AboutStats";
import AboutStory from "./components/AboutStory";
import AboutTeam from "./components/AboutTeam";
import AboutValues from "./components/AboutValues";

export default function AboutPage() {
  return (
    <div className="">
    

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pb-40">
        <AboutHero />
        <AboutStory />
        <AboutValues />
        <AboutStats />
        <AboutTeam />
      </main>

      <CommonFaq/>
    </div>
  );
}
