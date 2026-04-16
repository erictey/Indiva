import { useEffect, useState } from 'react';
import { CountdownTimer } from '../components/CountdownTimer';
import { CoreValuesDisplay } from '../components/CoreValuesDisplay';
import { FloatingBubble } from '../components/FloatingBubble';
import { MissionCard } from '../components/MissionCard';
import { MotivationalMessage } from '../components/MotivationalMessage';
import { useAppContext } from '../context/AppContext';

function formatDate(dateIso?: string) {
  return dateIso ? new Date(dateIso).toLocaleDateString() : 'Unknown';
}

export function DashboardScreen() {
  const { activeCycle, activeCycleItems, coreValues, cycleMessage } = useAppContext();
  const [showGreeting, setShowGreeting] = useState(true);

  useEffect(() => {
    if (showGreeting) {
      const timer = setTimeout(() => setShowGreeting(false), 2200);
      return () => clearTimeout(timer);
    }
  }, [showGreeting]);

  if (showGreeting) {
    return (
      <section className="screen">
        <div className="step-greeting dash-greeting">
          <h2 className="greeting-title greeting-fade-in">Welcome back</h2>
          <p className="greeting-sub greeting-fade-in-delay">Stay with the mission you chose.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="screen stack-xl step-enter">
      <CoreValuesDisplay values={coreValues} />

      <div className="mission-grid">
        <FloatingBubble delay={0} intensity={1.4}>
          <MissionCard
            caption="Develop directly."
            text={activeCycleItems.build?.text ?? 'No build mission found.'}
            title="Build"
          />
        </FloatingBubble>
        <FloatingBubble delay={1} intensity={1.1}>
          <MissionCard
            caption="Influence patiently."
            text={activeCycleItems.shape?.text ?? 'No shape mission found.'}
            title="Shape"
          />
        </FloatingBubble>
        <FloatingBubble delay={2} intensity={1.2}>
          <MissionCard
            caption="Respond well."
            text={activeCycleItems.workWith?.text ?? 'No work with mission found.'}
            title="Work With"
          />
        </FloatingBubble>
      </div>

      <div className="dashboard-grid">
        <CountdownTimer endDate={activeCycle?.endDate} />
        <MotivationalMessage message={cycleMessage} />
      </div>

      <p className="date-copy" style={{ textAlign: 'center' }}>
        {formatDate(activeCycle?.startDate)} to {formatDate(activeCycle?.endDate)}
      </p>
    </section>
  );
}
