type Props = {
  historyCount: number;
  onExport: () => void;
  onClear: () => void;
};

export function DataManagement({ historyCount, onExport, onClear }: Props) {
  return (
    <section className="panel stack-md">
      <div className="section-header">
        <div>
          <p className="eyebrow">Data Management</p>
          <h2>Local Storage Controls</h2>
        </div>
        <p className="section-copy">
          {historyCount} archived cycle{historyCount === 1 ? '' : 's'} currently stored in this
          browser.
        </p>
      </div>
      <div className="action-row">
        <button className="button secondary" onClick={onExport} type="button">
          Export All Data
        </button>
        <button className="button danger" onClick={onClear} type="button">
          Clear All Data
        </button>
      </div>
    </section>
  );
}
