import { useState } from 'react';
import { DataManagement } from '../components/DataManagement';
import { MissionCard } from '../components/MissionCard';
import { useAppContext } from '../context/AppContext';
import { downloadTextFile, makeExportFilename } from '../lib/storage';

export function HistoryScreen() {
  const { history, deleteHistoryRecord, exportData, clearAllData } = useAppContext();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleExport = () => {
    downloadTextFile(makeExportFilename(new Date()), exportData());
  };

  const handleDeleteRecord = (id: string) => {
    setDeletingId(id);
  };

  const confirmDeleteRecord = () => {
    if (deletingId) {
      deleteHistoryRecord(deletingId);
      setDeletingId(null);
    }
  };

  return (
    <section className="screen stack-xl">
      <header className="panel hero-panel animate-fade-in">
        <p className="eyebrow">History</p>
        <h2>Archived cycles and reflections</h2>
        <p className="screen-copy">
          Past cycles stay readable even if you later edit or remove missions, because history
          stores text snapshots.
        </p>
      </header>

      <section className="stack-lg">
        {history.length > 0 ? (
          history.map((entry) => (
            <article className="panel history-card" key={entry.id}>
              <div className="section-header">
                <div>
                  <p className="eyebrow">Cycle</p>
                  <h3>
                    {new Date(entry.startDate).toLocaleDateString()} to{' '}
                    {new Date(entry.endDate).toLocaleDateString()}
                  </h3>
                </div>
                {deletingId === entry.id ? (
                  <div className="inline-actions">
                    <button className="button danger small" onClick={confirmDeleteRecord} type="button">
                      Confirm
                    </button>
                    <button className="button ghost small" onClick={() => setDeletingId(null)} type="button">
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    className="button ghost small danger-text"
                    onClick={() => handleDeleteRecord(entry.id)}
                    type="button"
                  >
                    Delete
                  </button>
                )}
              </div>
              <div className="mission-grid">
                <MissionCard text={entry.buildText} title="Build" />
                <MissionCard text={entry.shapeText} title="Shape" />
                <MissionCard text={entry.workWithText} title="Work With" />
              </div>
              <section className="reflection-note">
                <p className="eyebrow">Reflection</p>
                <p>{entry.reflection.text}</p>
                <p className="date-copy">
                  Submitted {new Date(entry.reflection.submittedAt).toLocaleString()}
                </p>
              </section>
            </article>
          ))
        ) : (
          <div className="panel empty-state">
            <p>No completed cycles yet. Reflections appear here after first week closes.</p>
          </div>
        )}
      </section>

      <DataManagement historyCount={history.length} onClear={clearAllData} onExport={handleExport} />
    </section>
  );
}
