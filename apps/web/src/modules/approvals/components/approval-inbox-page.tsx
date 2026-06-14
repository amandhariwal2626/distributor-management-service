"use client"

import { CheckCircle2, XCircle, ArrowLeftRight, User, Calendar } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { PageHeader } from "@/components/shared/page-header"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const approvals = [
  {
    id: 1,
    entityType: "PRODUCT",
    entityName: "Mango Juice 1L",
    submittedBy: "Rahul Sharma",
    date: "2026-06-05",
    changeSummary: "New product launch in Maharashtra region with introductory pricing",
    status: "PENDING" as const,
  },
  {
    id: 2,
    entityType: "PRICE",
    entityName: "Classic Cola 250ml",
    submittedBy: "Priya Mehta",
    date: "2026-06-04",
    changeSummary: "MRP revision from ₹20 to ₹22 due to input cost increase",
    status: "PENDING" as const,
  },
  {
    id: 3,
    entityType: "PRODUCT",
    entityName: "Wheat Biscuits 200g",
    submittedBy: "Amit Kumar",
    date: "2026-06-03",
    changeSummary: "Updated packaging dimensions and added new variant",
    status: "APPROVED" as const,
  },
  {
    id: 4,
    entityType: "PRICE",
    entityName: "Wheat Biscuits 200g",
    submittedBy: "Amit Kumar",
    date: "2026-06-02",
    changeSummary: "PTR revision from ₹28 to ₹30 for all regions",
    status: "SENT_BACK" as const,
  },
]

const statusStyles = {
  PENDING: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  APPROVED: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  REJECTED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  SENT_BACK: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
}

function ApprovalCard({ approval }: { approval: typeof approvals[0] }) {
  return (
    <Card className={approval.status === "PENDING" ? "border-primary/30" : ""}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
              {approval.entityType === "PRODUCT" ? (
                <ArrowLeftRight className="h-5 w-5 text-muted-foreground" />
              ) : (
                <ArrowLeftRight className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-medium">{approval.entityName}</h4>
                <Badge variant="outline" className="text-[10px]">
                  {approval.entityType}
                </Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{approval.changeSummary}</p>
              <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span>{approval.submittedBy}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{approval.date}</span>
                </div>
              </div>
            </div>
          </div>
          <Badge className={statusStyles[approval.status]}>
            {approval.status.replace("_", " ")}
          </Badge>
        </div>

        {approval.status === "PENDING" && (
          <>
            <Separator className="my-4" />
            <div className="flex items-center justify-end gap-2">
              <Button variant="outline" size="sm">
                <XCircle className="mr-2 h-4 w-4 text-destructive" />
                Reject
              </Button>
              <Button variant="outline" size="sm">
                <ArrowLeftRight className="mr-2 h-4 w-4" />
                Send Back
              </Button>
              <Button size="sm" className="bg-green-600 hover:bg-green-700">
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
  return (
    <div className="space-y-6">
      <PageHeader
        title="Approval Inbox"
        description="Review and manage pending approvals"
        actions={
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="sent_back">Sent Back</TabsTrigger>
            </TabsList>
          </Tabs>
        }
      />

      <div className="space-y-4">
        {approvals.map((approval) => (
          <ApprovalCard key={approval.id} approval={approval} />
        ))}
      </div>
    </div>
  )
}
