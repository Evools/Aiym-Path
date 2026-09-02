"use client";

import React from "react";
import dynamic from "next/dynamic";
import { RouteItem, RouteFilterRegion } from "@/types/route.types";
import { AdminLocationItem } from "@/lib/services/admin-storage.service";

const DynamicLeafletMap = dynamic(
  () =>
    import("./InteractiveLeafletMap").then((mod) => mod.InteractiveLeafletMap),
  {
    ssr: false,
    loading: () => (
      <div
        className="w-full h-[580px] sm:h-[660px] lg:h-[720px] rounded-2xl sm:rounded-3xl flex items-center justify-center border border-[#E1E1E1]"
        style={{ backgroundColor: "rgba(7, 98, 106, 0.05)" }}
      >
        <span className="text-sm font-medium text-[#07626A]">
          Загрузка карты...
        </span>
      </div>
    ),
  }
);

interface InteractiveMapWrapperProps {
  routes: RouteItem[];
  locations?: AdminLocationItem[];
  selectedRegion: RouteFilterRegion;
  selectedRouteId: string | null;
  onSelectRoute: (id: string) => void;
}

export const InteractiveMapWrapper: React.FC<InteractiveMapWrapperProps> = (
  props
) => {
  return (
    <div className="relative w-full rounded-2xl sm:rounded-3xl border border-[#E1E1E1] overflow-hidden bg-white">
      <DynamicLeafletMap {...props} />
    </div>
  );
};
