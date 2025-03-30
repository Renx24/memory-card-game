export default function MemoryCard({
  image,
  title,
}: {
  image: string;
  title: string;
}) {
  return (
    <div className="memory-card">
      <img src={image} alt={title} />
      <p>{title}</p>
    </div>
  );
}
