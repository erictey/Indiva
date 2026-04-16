import { CATEGORY_LABELS } from '../lib/types';

type Props = {
  title: string;
  text: string;
  caption?: string;
  category?: 'build' | 'shape' | 'workWith';
  index?: number;
};

const categoryIcons: Record<string, string> = {
  build: '\u2726',
  shape: '\u25CE',
  workWith: '\u2661',
};

export function MissionCard({ title, text, caption, category, index }: Props) {
  const icon = category ? categoryIcons[category] : null;
  const label = category ? CATEGORY_LABELS[category] : null;

  return (
    <section 
      className={`mission-card ${category ? `mission-card-${category}` : ''}`}
      style={{ 
        animationDelay: index !== undefined ? `${index * 0.1}s` : undefined 
      }}
    >
      <div className="mission-card-orb" aria-hidden="true" />
      <div className="mission-card-frame" aria-hidden="true" />
      <div className="mission-card-topline">
        <div className="mission-card-heading">
          <p className="eyebrow">{title}</p>
          {label ? <span className="mission-card-label">{label}</span> : null}
        </div>
        {icon && (
          <div className="mission-card-icon" title={label || ''}>
            {icon}
          </div>
        )}
      </div>
      <div className="mission-card-divider" aria-hidden="true" />
      <div className="mission-card-body">
        <p className="mission-text">{text}</p>
      </div>
      {caption ? <p className="card-caption">{caption}</p> : null}
    </section>
  );
}
