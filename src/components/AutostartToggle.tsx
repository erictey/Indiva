import { useEffect, useState } from 'react';
import { isElectron, getAutostart, setAutostart } from '../lib/electron';

export function AutostartToggle() {
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isElectron) {
      setLoading(false);
      return;
    }
    getAutostart().then((val) => {
      setEnabled(val);
      setLoading(false);
    });
  }, []);

  if (!isElectron) return null;

  const toggle = async () => {
    const next = !enabled;
    setLoading(true);
    await setAutostart(next);
    setEnabled(next);
    setLoading(false);
  };

  return (
    <div className="autostart-toggle">
      <button
        className={`toggle-track ${enabled ? 'toggle-on' : ''}`}
        disabled={loading}
        onClick={toggle}
        type="button"
        aria-label="Toggle autostart"
      >
        <span className="toggle-thumb" />
      </button>
      <span className="toggle-label">
        Launch on startup {enabled ? 'ON' : 'OFF'}
      </span>
    </div>
  );
}
