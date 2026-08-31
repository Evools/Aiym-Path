"use client";

import React from "react";
import dynamic from "next/dynamic";

const DynamicRouteMapEditor = dynamic(
  () => import("./RouteMapEditor").then((mod) => mod.RouteMapEditor),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[400px] sm:h-[460px] rounded-2xl flex items-center justify-center border border-[#E1E1E1] bg-[#F3F3F3]">
        <span className="text-xs font-bold text-[#07626A]">
          Загрузка редактора карты...
        </span>
      </div>
    ),
  }
);

interface RouteMapEditorWrapperProps {
  coordinates: [number, number][];
  onChangeCoordinates: (coords: [number, number][]) => void;
  center?: [number, number];
}

export const RouteMapEditorWrapper: React.FC<RouteMapEditorWrapperProps> = (
  props
) => {
  return <DynamicRouteMapEditor {...props} />;
};
