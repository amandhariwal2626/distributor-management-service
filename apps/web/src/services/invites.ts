import type { AxiosResponse } from "axios";
import { apiClient } from "@/lib/api";

export const invitesService = {
  resend: async (userId: string): Promise<AxiosResponse> => apiClient.post("/invites/resend", { userId }),
  accept: async (token: string, password: string): Promise<AxiosResponse> =>
    apiClient.post("/invites/accept", { token, password }),
};
