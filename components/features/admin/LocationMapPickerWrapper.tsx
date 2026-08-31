"use client";

import React from "react";
import dynamic from "next/dynamic";

const DynamicLocationMapPicker = dynamic(
  () => import("./LocationMapPicker").then((mod) => mod.LocationMapPicker),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[460px] sm:h-[540px] lg:h-[580px] rounded-2xl flex items-center justify-center border border-[#E1E1E1] bg-[#F3F3F3]">
        <span className="text-xs font-bold text-[#07626A]">
          Загрузка карты выбора локации...
        </span>
      </div>
    ),
  }
);

interface LocationMapPickerWrapperProps {
  coordinates: [number, number];
  onSelectCoordinates: (coords: [number, number]) => void;
  locationName?: string;
}

export const LocationMapPickerWrapper = React.memo(
  (props: LocationMapPickerWrapperProps) => {
    return <DynamicLocationMapPicker {...props} />;
  }
);
LocationMapPickerWrapper.displayName = "LocationMapPickerWrapper";
