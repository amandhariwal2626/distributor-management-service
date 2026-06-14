"use client"

import { useState } from "react"
import { CheckCircle2, XCircle, ArrowLeftRight, User, Calendar, Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { PageHeader } from "@/components/shared/page-header"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ErrorState } from "@/components/shared/error-state"
import { EmptyState } from "@/components/shared/empty-state"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useApprovals, useApprovalAction } from "../hooks/use-approvals"
import type { ApprovalStatus } from "../api/approvals"

const statusStyles: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800",
  approved: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800",
  rejected: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800",
  sent_back: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800",
}

const entityIcons: Record<string, typeof ArrowLeftRight> = {
  product: ArrowLeftRight,
  price: ArrowLeftRight,
}

function ApprovalCard({
  approval,
  onAction,
}: {
  approval: {
    id: string
    entityType: string
    entityName?: string
    submittedBy: string
    submittedAt: string
    changeSummary?: string
    status: ApprovalStatus
  }
  onAction: (action: "approve" | "reject" | "send_back", id: string) => void
}) {
  const Icon = entityIcons[approval.entityType] ?? ArrowLeftRight
  const isPending = approval.status === "pending"

  return (
    <Card className={isPending ? "border-primary/30" : ""}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
              <Icon className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-medium">{approval.entityName ?? "Untitled"}</h4>
                <Badge variant="outline" className="text-[10px] uppercase">{approval.entityType}</Badge>
              </div>
              {approval.changeSummary ? <p className="mt-1 text-sm text-muted-foreground">{approval.changeSummary}</p> : null}
              <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span>{approval.submittedBy}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{new Date(approval.submittedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
          <Badge variant="outline" className={statusStyles[approval.status] ?? ""}>
            {approval.status.replace("_", " ")}
          </Badge>
        </div>

        {isPending && (
          <>
            <Separator className="my-4" />
            <div className="flex items-center justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => onAction("reject", approval.id)}>
                <XCircle className="mr-2 h-4 w-4 text-destructive" />
                Reject
              </Button>
              <Button variant="outline" size="sm" onClick={() => onAction("send_back", approval.id)}>
                <ArrowLeftRight className="mr-2 h-4 w-4" />
                Send Back
              </Button>
              <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => onAction("approve", approval.id)}>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Approve
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

export function ApprovalInboxPage() {
  const [tab, setTab] = useState("all")
  const statusParam = tab === "all" ? undefined : (tab as ApprovalStatus)
  const { data: approvals, isLoading, error, refetch } = useApprovals(statusParam)
  const actionMut = useApprovalAction()
  const [modal, setModal] = useState<{ action: "reject" | "send_back"; id: string } | null>(null)
  const [reason, setReason] = useState("")

  const handleAction = (action: "approve" | "reject" | "send_back", id: string) => {
    if (action === "approve") {
      actionMut.mutate({ id, action })
      return
    }
    setModal({ action: action as "reject" | "send_back", id })
    setReason("")
  }

  const submitWithReason = () => {
    if (!modal || !reason.trim()) return
    actionMut.mutate({ id: modal.id, action: modal.action, reason: reason.trim() })
    setModal(null)
    setReason("")
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Approval Inbox"
        description="Review and manage pending approvals"
        actions={
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="sent_back">Sent Back</TabsTrigger>
            </TabsList>
          </Tabs>
        }
      />

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <ErrorState title="Failed to load approvals" message={error.message} onRetry={() => refetch()} />
      ) : !approvals || approvals.length === 0 ? (
        <EmptyState title="No approvals found" description={tab === "all" ? "There are no approval requests yet." : `No ${tab.replace("_", " ")} approvals.`} />
      ) : (
        <div className="space-y-4">
          {approvals.map((a) => (
            <ApprovalCard key={a.id} approval={a} onAction={handleAction} />
          ))}
        </div>
      )}

      <Dialog open={!!modal} onOpenChange={(o) => { if (!o) setModal(null) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{modal?.action === "reject" ? "Reject" : "Send Back"} Approval</DialogTitle>
            <DialogDescription>
              {modal?.action === "reject" ? "Provide a reason for rejection." : "Provide feedback for sending back."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="reason">Reason</Label>
            <Textarea id="reason" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Enter reason..." rows={3} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModal(null)}>Cancel</Button>
            <Button variant={modal?.action === "reject" ? "destructive" : "default"} onClick={submitWithReason} disabled={!reason.trim() || actionMut.isPending}>
              {actionMut.isPending ? "Submitting..." : modal?.action === "reject" ? "Reject" : "Send Back"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
