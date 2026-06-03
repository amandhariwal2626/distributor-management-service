"use client";

import { useAuthStore } from "@/store/auth-store";

export const useAuth = (): ReturnType<typeof useAuthStore> => {
  const state = useAuthStore();
  return state;
};
