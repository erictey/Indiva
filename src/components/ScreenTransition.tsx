import { useEffect, useRef, useState, type ReactNode } from 'react';

type Props = {
  children: ReactNode;
  transitionKey: string;
};

const TRANSITION_ORDER: Record<string, number> = {
  'workflow-setup': 0,
  'workflow-ready_to_select': 1,
  'workflow-active_week': 2,
  'workflow-awaiting_reflection': 3,
  'workflow-completed_cycle': 4,
  history: 5,
  edit: 6,
  about: 7,
  settings: 8,
};

function getTransitionOrder(key: string) {
  return TRANSITION_ORDER[key] ?? 0;
}

export function ScreenTransition({ children, transitionKey }: Props) {
  const [displayed, setDisplayed] = useState(children);
  const [phase, setPhase] = useState<'enter' | 'exit' | 'idle'>('enter');
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const prevKey = useRef(transitionKey);
  const prevOrder = useRef(getTransitionOrder(transitionKey));
  const exitTimerRef = useRef<number | null>(null);
  const enterTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (transitionKey === prevKey.current) {
      setDisplayed(children);
      return;
    }

    const nextOrder = getTransitionOrder(transitionKey);
    setDirection(nextOrder >= prevOrder.current ? 'forward' : 'backward');
    prevOrder.current = nextOrder;
    prevKey.current = transitionKey;
    setPhase('exit');

    if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
    if (enterTimerRef.current) clearTimeout(enterTimerRef.current);

    exitTimerRef.current = window.setTimeout(() => {
      setDisplayed(children);
      setPhase('enter');

      enterTimerRef.current = window.setTimeout(() => {
        setPhase('idle');
      }, 500);
    }, 350);

    return () => {
      if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
      if (enterTimerRef.current) clearTimeout(enterTimerRef.current);
    };
  }, [transitionKey, children]);

  const className = [
    'screen-transition',
    phase === 'exit'
      ? direction === 'forward'
        ? 'step-exit'
        : 'step-exit-reverse'
      : '',
    phase === 'enter'
      ? direction === 'forward'
        ? 'step-enter'
        : 'step-enter-reverse'
      : '',
  ].filter(Boolean).join(' ');

  return <div className={className}>{displayed}</div>;
}
