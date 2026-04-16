import { useCallback, useEffect, useState, type ReactNode } from 'react';

export type StepConfig = {
  key: string;
  canAdvance?: boolean;
};

type Props = {
  steps: StepConfig[];
  renderStep: (index: number) => ReactNode;
  onComplete?: () => void;
  completeLabel?: string;
  showProgress?: boolean;
};

export function StepWizard({
  steps,
  renderStep,
  onComplete,
  completeLabel = 'Continue',
  showProgress = true,
}: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayedIndex, setDisplayedIndex] = useState(0);
  const [phase, setPhase] = useState<'enter' | 'idle' | 'exit'>('enter');

  const currentStep = steps[currentIndex];
  const canAdvance = currentStep?.canAdvance !== false;
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === steps.length - 1;

  useEffect(() => {
    setPhase('enter');
    const t = setTimeout(() => setPhase('idle'), 450);
    return () => clearTimeout(t);
  }, [displayedIndex]);

  const navigate = useCallback((nextIndex: number) => {
    setPhase('exit');
    setTimeout(() => {
      setCurrentIndex(nextIndex);
      setDisplayedIndex(nextIndex);
    }, 280);
  }, []);

  const next = () => {
    if (!canAdvance) return;
    if (isLast) { onComplete?.(); return; }
    navigate(currentIndex + 1);
  };

  const back = () => {
    if (!isFirst) navigate(currentIndex - 1);
  };

  const phaseClass =
    phase === 'exit' ? 'step-exit' :
    phase === 'enter' ? 'step-enter' : '';

  return (
    <div className="step-wizard">
      {showProgress && steps.length > 1 && (
        <div className="step-progress">
          {steps.map((s, i) => (
            <div
              className={[
                'step-dot',
                i === currentIndex ? 'step-dot-active' : '',
                i < currentIndex ? 'step-dot-done' : '',
              ].filter(Boolean).join(' ')}
              key={s.key}
            />
          ))}
        </div>
      )}

      <div className={`step-content ${phaseClass}`}>
        {renderStep(displayedIndex)}
      </div>

      <div className="step-nav">
        {!isFirst && (
          <button className="button secondary" onClick={back} type="button">
            Back
          </button>
        )}
        <div className="step-nav-spacer" />
        <button
          className={`button ${isLast && onComplete ? 'confirm-pulse' : ''}`}
          disabled={!canAdvance}
          onClick={next}
          type="button"
        >
          {isLast ? completeLabel : 'Continue'}
        </button>
      </div>
    </div>
  );
}
