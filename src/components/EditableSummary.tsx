'use client';

import { useState, useRef } from 'react';

interface EditableSummaryProps {
  initialValue: string;
  onSave: (newSummary: string) => Promise<void>;
}

export const EditableSummary = ({ initialValue, onSave }: EditableSummaryProps) => {
  const [value, setValue] = useState(initialValue);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleSave = async () => {
    const newText = ref.current?.innerText || '';
    setSaving(true);
    try {
      await onSave(newText);
      setValue(newText);
    } finally {
      setSaving(false);
      setEditing(false);
    }
  };

  return (
    <div className="space-y-2">
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        className={`border rounded p-3 focus:outline-none ${
          editing ? 'bg-white shadow-inner ring ring-blue-300' : 'bg-gray-50'
        }`}
        onInput={() => setEditing(true)}
        onBlur={handleSave}
      >
        {value}
      </div>
      {saving && <p className="text-sm text-gray-500">Saving...</p>}
    </div>
  );
};
