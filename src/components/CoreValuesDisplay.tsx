import { useState, type FormEvent } from 'react';
import type { CoreValue } from '../lib/types';
import { normalizeOptionText } from '../lib/utils';

type Props = {
  values: CoreValue[];
  editable?: boolean;
  disabled?: boolean;
  variant?: 'panel' | 'strip';
  presets?: readonly string[];
  onAdd?: (text: string) => void;
  onEdit?: (id: string, text: string) => void;
  onDelete?: (id: string) => void;
};

export function CoreValuesDisplay({
  values,
  editable = false,
  disabled = false,
  variant = 'panel',
  presets = [],
  onAdd,
  onEdit,
  onDelete,
}: Props) {
  const [draft, setDraft] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const existingValues = new Set(values.map((value) => normalizeOptionText(value.text)));

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!onAdd || disabled || !draft.trim()) return;
    onAdd(draft);
    setDraft('');
  };

  const startEdit = (value: CoreValue) => {
    setEditingId(value.id);
    setEditText(value.text);
    setDeletingId(null);
  };

  const confirmEdit = () => {
    if (editingId && editText.trim() && onEdit) {
      onEdit(editingId, editText);
    }
    setEditingId(null);
    setEditText('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const startDelete = (id: string) => {
    setDeletingId(id);
    setEditingId(null);
  };

  const confirmDelete = () => {
    if (deletingId && onDelete) {
      onDelete(deletingId);
    }
    setDeletingId(null);
  };

  const isStrip = variant === 'strip' && !editable;
  const showPresets = editable && presets.length > 0 && !!onAdd;

  return (
    <section className={`panel ${isStrip ? 'core-values-strip' : 'stack-lg animate-pulse-glow'}`}>
      {isStrip ? (
        <div className="core-values-strip-header">
          <p className="eyebrow">Core Values</p>
          <p className="core-values-strip-copy">Your values shape how you show up.</p>
        </div>
      ) : (
        <div className="section-header">
          <div>
            <p className="eyebrow">What Matters Most</p>
            <h2>Your Values</h2>
          </div>
          <p className="section-copy">
            These are the things that matter most to you. They'll gently guide everything else.
          </p>
        </div>
      )}

      {values.length > 0 ? (
        <div className="pill-row stagger-in">
          {values.map((value, index) => (
            <article 
              className="pill-card" 
              key={value.id}
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              <div className="pill-card-edge" aria-hidden="true" />
              {editingId === value.id ? (
                <div className="inline-edit-form">
                  <input
                    autoFocus
                    className="text-input"
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') confirmEdit(); if (e.key === 'Escape') cancelEdit(); }}
                    value={editText}
                  />
                  <div className="inline-actions">
                    <button className="button small" onClick={confirmEdit} type="button">Save</button>
                    <button className="button ghost small" onClick={cancelEdit} type="button">Cancel</button>
                  </div>
                </div>
              ) : deletingId === value.id ? (
                <div className="inline-confirm">
                  <p className="danger-text">Delete &quot;{value.text}&quot;?</p>
                  <div className="inline-actions">
                    <button className="button danger small" onClick={confirmDelete} type="button">Yes, delete</button>
                    <button className="button ghost small" onClick={() => setDeletingId(null)} type="button">Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="pill-card-header">
                    <span className="pill-card-dot" aria-hidden="true" />
                    <p className="pill-card-text">{value.text}</p>
                  </div>
                  {editable ? (
                    <div className="inline-actions">
                      <button className="button ghost small" onClick={() => startEdit(value)} type="button">Edit</button>
                      <button className="button ghost small danger-text" onClick={() => startDelete(value.id)} type="button">Delete</button>
                    </div>
                  ) : null}
                </>
              )}
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state animate-fade-in">
          <p>What matters most to you? Add a value to get started.</p>
        </div>
      )}

      {showPresets ? (
        <div className="preset-block">
          <p className="eyebrow">Templates</p>
          <div className="pill-row">
            {presets.map((preset) => {
              const isAdded = existingValues.has(normalizeOptionText(preset));
              return (
                <button
                  className="button secondary small"
                  disabled={disabled || isAdded}
                  key={preset}
                  onClick={() => {
                    if (!onAdd || disabled || isAdded) return;
                    onAdd(preset);
                  }}
                  title={isAdded ? 'Already added' : 'Add this value'}
                  type="button"
                >
                  {isAdded ? preset : `+ ${preset}`}
                </button>
              );
            })}
          </div>
          <p className="step-hint-subtle">Pick from these or add your own below.</p>
        </div>
      ) : null}

      {editable ? (
        <form className="form-row" onSubmit={handleSubmit}>
          <input
            className="text-input"
            disabled={disabled}
            onChange={(event) => setDraft(event.target.value)}
            maxLength={100}
            placeholder="Or type your own value here"
            value={draft}
          />
          <button className="button" disabled={disabled || !draft.trim()} type="submit">
            Add Value
          </button>
        </form>
      ) : null}
    </section>
  );
}
