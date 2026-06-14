"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { approvalsApi, type ApprovalStatus } from "../api/approvals"

export function useApprovals(status?: ApprovalStatus) {
  return useQuery({
    queryKey: ["approvals", status],
    queryFn: () => approvalsApi.list(status),
  })
}

export function useApprovalAction() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      action,
      reason,
    }: {
      id: string
      action: "approve" | "reject" | "send_back"
      reason?: string
    }) => {
      if (action === "approve") return approvalsApi.approve(id, reason)
      if (action === "reject") return approvalsApi.reject(id, reason!)
      return approvalsApi.sendBack(id, reason!)
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["approvals"] })
      const label =
        variables.action === "send_back" ? "sent back" : `${variables.action}d`
      toast.success(`Approval ${label} successfully`)
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to perform action")
    },
  })
}
