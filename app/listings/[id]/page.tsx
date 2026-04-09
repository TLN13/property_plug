import PropertyDetails from "@/app/components/PropertyDetails";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PropertyDetailsPage({ params }: Props) {
  const { id } = await params;

  return <PropertyDetails id={id} />;
}
