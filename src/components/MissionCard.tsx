type Props = {
  title: string;
  text: string;
  caption?: string;
};

export function MissionCard({ title, text, caption }: Props) {
  return (
    <section className="mission-card">
      <p className="eyebrow">{title}</p>
      <p className="mission-text">{text}</p>
      {caption ? <p className="card-caption">{caption}</p> : null}
    </section>
  );
}
