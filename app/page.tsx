import { HeroSection } from "@/components/features/home/HeroSection";
import { AboutMissionSection } from "@/components/features/home/AboutMissionSection";
import { GuidesPreviewSection } from "@/components/features/home/GuidesPreviewSection";
import { FemaleFriendlyConceptSection } from "@/components/features/home/FemaleFriendlyConceptSection";
import { LocationsSection } from "@/components/features/home/LocationsSection";
import { CommunityCtaSection } from "@/components/features/home/CommunityCtaSection";

export default function HomePage() {
  return (
    <div className="flex flex-col w-full">
      <HeroSection />
      <AboutMissionSection />
      <GuidesPreviewSection />
      <FemaleFriendlyConceptSection />
      <LocationsSection />
      <CommunityCtaSection />
    </div>
  );
}
