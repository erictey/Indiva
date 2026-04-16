import { useEffect, useRef, useState, type ReactNode } from 'react';

type Props = {
  children: ReactNode;
  transitionKey: string;
};

export function ScreenTransition({ children, transitionKey }: Props) {
  const [displayed, setDisplayed] = useState(children);
  const [phase, setPhase] = useState<'enter' | 'exit' | 'idle'>('enter');
  const prevKey = useRef(transitionKey);

  useEffect(() => {
    if (transitionKey === prevKey.current) {
      setDisplayed(children);
      return;
    }

    prevKey.current = transitionKey;
    setPhase('exit');

    const exitTimer = setTimeout(() => {
      setDisplayed(children);
      setPhase('enter');

      const enterTimer = setTimeout(() => {
        setPhase('idle');
      }, 400);

      return () => clearTimeout(enterTimer);
    }, 250);

    return () => clearTimeout(exitTimer);
  }, [transitionKey, children]);

  const className = [
    'screen-transition',
    phase === 'exit' ? 'screen-exit' : '',
    phase === 'enter' ? 'screen-enter' : '',
  ].filter(Boolean).join(' ');

  return <div className={className}>{displayed}</div>;
}
