import { useCycleTimer } from '../hooks/useCycleTimer';

type Props = {
  endDate?: string;
};

export function CountdownTimer({ endDate }: Props) {
  const { days, hours, minutes } = useCycleTimer(endDate);

  if (!endDate) {
    return null;
  }

  return (
    <section className="panel stack-md">
      <div className="section-header">
        <div>
          <p className="eyebrow">Cycle Timer</p>
          <h3>Time remaining</h3>
        </div>
      </div>

      <div className="countdown-grid">
        <article className="countdown-unit">
          <strong>{days}</strong>
          <span>Days</span>
        </article>
        <article className="countdown-unit">
          <strong>{hours}</strong>
          <span>Hours</span>
        </article>
        <article className="countdown-unit">
          <strong>{minutes}</strong>
          <span>Minutes</span>
        </article>
      </div>
    </section>
  );
}
