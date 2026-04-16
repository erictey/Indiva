import { useState } from 'react';
import { FloatingBubble } from '../components/FloatingBubble';
import { MissionCard } from '../components/MissionCard';
import { ReflectionPrompts } from '../components/ReflectionPrompts';
import { StepWizard, type StepConfig } from '../components/StepWizard';
import { useAppContext } from '../context/AppContext';

const REFLECTION_PROMPTS = [
  'What did I actually do this week?',
  'What felt difficult?',
  'What improved?',
  'Where did I avoid discomfort?',
  'Did I act in line with my Core Values?',
  'What would I do differently next week?',
];

export function ReflectionScreen() {
  const { activeCycle, activeCycleItems, submitReflection } = useAppContext();
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  const steps: StepConfig[] = [
    { key: 'greeting' },
    { key: 'review' },
    { key: 'prompts' },
    { key: 'write', canAdvance: text.trim().length > 0 },
  ];

  const handleSubmit = () => {
    if (!text.trim()) {
      setError('Write a reflection before starting the next cycle.');
      return;
    }
    submitReflection(text);
    setText('');
    setError('');
  };

  const renderStep = (index: number) => {
    switch (index) {
      case 0:
        return (
          <div className="step-greeting">
            <h2 className="greeting-title">Week Complete</h2>
            <p className="greeting-sub">
              Cycle ended on{' '}
              {activeCycle ? new Date(activeCycle.endDate).toLocaleDateString() : 'unknown date'}.
              Close the week before you start the next one.
            </p>
          </div>
        );

      case 1:
        return (
          <div className="step-section stack-lg">
            <div className="step-greeting" style={{ padding: '8px 0' }}>
              <h2 className="greeting-title" style={{ fontSize: '1.6rem' }}>
                Your missions this week
              </h2>
            </div>
            <div className="mission-grid">
              <FloatingBubble delay={0} intensity={0.5}>
                <MissionCard
                  text={activeCycleItems.build?.text ?? 'No build mission.'}
                  title="Build"
                />
              </FloatingBubble>
              <FloatingBubble delay={1} intensity={0.5}>
                <MissionCard
                  text={activeCycleItems.shape?.text ?? 'No shape mission.'}
                  title="Shape"
                />
              </FloatingBubble>
              <FloatingBubble delay={2} intensity={0.5}>
                <MissionCard
                  text={activeCycleItems.workWith?.text ?? 'No work with mission.'}
                  title="Work With"
                />
              </FloatingBubble>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="step-section">
            <ReflectionPrompts prompts={REFLECTION_PROMPTS} />
          </div>
        );

      case 3:
        return (
          <div className="step-section">
            <section className="panel stack-md">
              <div className="section-header">
                <div>
                  <p className="eyebrow">Your Notes</p>
                  <h3>Write the reflection</h3>
                </div>
                <p className="section-copy">
                  A few concrete paragraphs. Honesty matters more than polish.
                </p>
              </div>
              <textarea
                className="text-area"
                onChange={(e) => { setText(e.target.value); setError(''); }}
                placeholder="What happened this week? What moved, stalled, or surprised you?"
                rows={9}
                value={text}
              />
              {error && <p className="field-error">{error}</p>}
            </section>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <section className="screen">
      <StepWizard
        completeLabel="Submit Reflection"
        onComplete={handleSubmit}
        renderStep={renderStep}
        steps={steps}
      />
    </section>
  );
}
