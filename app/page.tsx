import { HeroSection } from "@/components/features/home/HeroSection";
import { HomeMapSection } from "@/components/features/home/HomeMapSection";
import { GuidesPreviewSection } from "@/components/features/home/GuidesPreviewSection";
import { FemaleFriendlyConceptSection } from "@/components/features/home/FemaleFriendlyConceptSection";
import { AboutMissionSection } from "@/components/features/home/AboutMissionSection";

export default function HomePage() {
  return (
    <div className="flex flex-col w-full">
      <HeroSection />
      <HomeMapSection />
      <GuidesPreviewSection />
      <FemaleFriendlyConceptSection />
      <AboutMissionSection />
    </div>
  );
}

