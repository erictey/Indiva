import type { MotivationalMessage as MotivationalMessageType } from '../lib/types';

type Props = {
  message: MotivationalMessageType;
};

export function MotivationalMessage({ message }: Props) {
  return (
    <section className="panel message-card">
      <div className="section-header">
        <div>
          <p className="eyebrow">Message</p>
          <h3>Today&apos;s tone</h3>
        </div>
        <span className="badge neutral">{message.type}</span>
      </div>
      <p>{message.text}</p>
    </section>
  );
}
