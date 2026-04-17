import { useEffect, useState } from 'react';
import { getAutostart, hasAutostartApi, setAutostart } from '../lib/electron';

export function AutostartToggle() {
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [supported, setSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supportedNow = hasAutostartApi();
    setSupported(supportedNow);

    if (!supportedNow) {
      setLoading(false);
      return;
    }

    getAutostart()
      .then((val) => {
        setEnabled(val);
      })
      .catch(() => {
        setError('Autostart is unavailable right now.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const toggle = async () => {
    if (!supported || loading) {
      return;
    }

    const next = !enabled;
    setLoading(true);
    setError(null);

    try {
      const result = await setAutostart(next);
      setEnabled(result);
    } catch {
      setError('Could not update startup preference.');
    } finally {
      setLoading(false);
    }
  };

  const label = !supported
    ? 'Launch on startup is unavailable in this build.'
    : error
      ? error
      : loading
        ? 'Checking startup preference...'
        : `Launch on startup ${enabled ? 'ON' : 'OFF'}`;

  return (
    <div className="autostart-toggle">
      <button
        className={`toggle-track ${enabled ? 'toggle-on' : ''}`}
        aria-checked={enabled}
        aria-label="Toggle autostart"
        disabled={loading || !supported}
        onClick={toggle}
        role="switch"
        type="button"
      >
        <span className="toggle-thumb" />
      </button>
      <span className="toggle-label">{label}</span>
    </div>
  );
}
