import { useEffect, useRef, type ReactNode } from 'react';

type Props = {
  children: ReactNode;
  delay?: number;
  intensity?: number;
};

export function FloatingBubble({ children, delay = 0, intensity = 1 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let t = delay;
    const baseY = 8 * intensity;
    const baseX = 5 * intensity;
    const baseRotate = 1.8 * intensity;

    const animate = () => {
      t += 0.008;
      const y = Math.sin(t * 1.1) * baseY;
      const x = Math.cos(t * 0.7) * baseX;
      const rotate = Math.sin(t * 0.9) * baseRotate;

      el.style.transform = `translate(${x}px, ${y}px) rotate(${rotate}deg)`;
      frameRef.current = requestAnimationFrame(animate);
    };

    // Entrance animation
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px) scale(0.92)';

    const enterTimeout = setTimeout(() => {
      el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0) scale(1)';

      const floatTimeout = setTimeout(() => {
        el.style.transition = '';
        frameRef.current = requestAnimationFrame(animate);
      }, 650);

      return () => clearTimeout(floatTimeout);
    }, delay * 150);

    return () => {
      clearTimeout(enterTimeout);
      cancelAnimationFrame(frameRef.current);
    };
  }, [delay, intensity]);

  return (
    <div className="floating-bubble" ref={ref}>
      {children}
    </div>
  );
}
