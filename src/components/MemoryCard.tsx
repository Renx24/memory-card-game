export default function MemoryCard({
  image,
  title,
  onClick,
}: {
  image: string;
  title: string;
  onClick: () => void;
}) {
  return (
    <div className="memory-card" onClick={onClick}>
      <img src={image} alt={title} />
      <p>{title}</p>
    </div>
  );
}
