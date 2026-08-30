import { Metadata } from "next";
import { ToursHeroBanner } from "@/components/features/tours/ToursHeroBanner";
import { ToursGuideListSection } from "@/components/features/tours/ToursGuideListSection";

export const metadata: Metadata = {
  title: "Экскурсии и Гиды | Aiym Path",
  description: "Проверенные гиды, турагентства и экскурсионные программы по Кыргызстану для женщин.",
};

export default function ToursPage() {
  return (
    <div className="w-full bg-white min-h-screen">
      <ToursHeroBanner />
      <ToursGuideListSection />
    </div>
  );
}

