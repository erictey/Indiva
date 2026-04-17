import { useState } from 'react';

type Props = {
  historyCount: number;
  onExport: () => void;
  onClear: () => void;
};

export function DataManagement({ historyCount, onExport, onClear }: Props) {
  const [confirmClear, setConfirmClear] = useState(false);

  return (
    <section className="panel stack-md">
      <div className="section-header">
        <div>
          <p className="eyebrow">Your Data</p>
          <h2>Storage</h2>
        </div>
        <p className="section-copy">
          {historyCount} completed {historyCount === 1 ? 'week' : 'weeks'} saved on this device.
        </p>
      </div>
      <div className="action-row">
        <button className="button secondary" onClick={onExport} type="button">
          Export All Data
        </button>
        {confirmClear ? (
          <>
            <button className="button danger" onClick={() => { onClear(); setConfirmClear(false); }} type="button">
              Yes, erase everything
            </button>
            <button className="button ghost" onClick={() => setConfirmClear(false)} type="button">
              Never mind
            </button>
          </>
        ) : (
          <button className="button danger" onClick={() => setConfirmClear(true)} type="button">
            Clear All Data
          </button>
        )}
      </div>
    </section>
  );
}
