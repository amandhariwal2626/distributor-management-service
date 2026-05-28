"use client";

import { useAuthStore } from "@/store/auth-store";

export const useAuth = () => {
  const state = useAuthStore();
  return state;
};
