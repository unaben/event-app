import EditEventForm from "@/components/EditEventForm/EditEventForm";

export default async function EditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div>
      <h2>Edit Event</h2>
      <EditEventForm id={Number(id)} />
    </div>
  );
}
