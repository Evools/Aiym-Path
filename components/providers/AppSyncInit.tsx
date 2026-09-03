"use client";

import { useEffect } from "react";
import { AdminStorageService } from "@/lib/services/admin-storage.service";

export const AppSyncInit = () => {
  useEffect(() => {
    AdminStorageService.initSync();
  }, []);

  return null;
};
