import { PriceHistoryPage } from "@/modules/prices/components/price-history-page"

export default async function PriceHistoryRoutePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <PriceHistoryPage id={id} />
}
