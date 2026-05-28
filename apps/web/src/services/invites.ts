import { apiClient } from "@/lib/api";

export const invitesService = {
  resend: async (userId: string) => apiClient.post("/invites/resend", { userId }),
  accept: async (token: string, password: string) =>
    apiClient.post("/invites/accept", { token, password }),
};
