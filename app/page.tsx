import { HeroSection } from "@/components/features/home/HeroSection";
import { AboutMissionSection } from "@/components/features/home/AboutMissionSection";
import { HomeMapSection } from "@/components/features/home/HomeMapSection";
import { LocationsSection } from "@/components/features/home/LocationsSection";
import { GuidesPreviewSection } from "@/components/features/home/GuidesPreviewSection";
import { FemaleFriendlyConceptSection } from "@/components/features/home/FemaleFriendlyConceptSection";

export default function HomePage() {
  return (
    <div className="flex flex-col w-full">
      <HeroSection />
      <AboutMissionSection />
      <HomeMapSection />
      <LocationsSection />
      <GuidesPreviewSection />
      <FemaleFriendlyConceptSection />
    </div>
  );
}

