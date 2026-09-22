import { StoreDetailScreen } from "@/components/store-detail/StoreDetailScreen";

export default async function StoreDetailPage({
  params,
}: PageProps<"/stores/[storeId]">) {
  const { storeId } = await params;

  return <StoreDetailScreen storeId={storeId} />;
}
