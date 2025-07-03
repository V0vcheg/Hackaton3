'use client';

import * as React from 'react';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';

import PassphraseGate from '@/components/password-entries/passphraseGate';
import PasswordEntryTable from '@/components/password-entries/passwordEntryTable';
import PasswordEntryDialog from '@/components/password-entries/passwordEntryDialog';
import { PlainPasswordEntry } from '@/types/password.types'

import {
  listPasswordEntries,
  createPasswordEntry,
  updatePasswordEntry,
  deletePasswordEntry,
  PasswordEntry,
} from '@/lib/api/passwordEntries';
import { decryptEntry } from '@/lib/crypto';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';
const USER_ID = '1'; //! temporaire a changé avec le jwt

export default function PasswordEntriesPage() {
  return (
    <PassphraseGate>
      {(keyAES, report) => <EntriesUI keyAES={keyAES} report={report} />}
    </PassphraseGate>
  );
}

function EntriesUI({
  keyAES,
  report,
}: {
  keyAES: CryptoJS.lib.WordArray;
  report: (ok: boolean) => void;
}) {
  const [entries, setEntries] =
    React.useState<PasswordEntry[]>([]);
  const [ready, setReady] = React.useState(false);

  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<PasswordEntry | null>(null);

  React.useEffect(() => {
    (async () => {
      try {
        const rows = await listPasswordEntries(USER_ID);
        if (rows.length) decryptEntry(rows[0], keyAES);
        setEntries(rows);
        setReady(true);
        report(true);
      } catch (err) {
        console.error(err);
        report(false);
      }
    })();
  }, [keyAES, report]);

  if (!ready) return null;

  const handleAdd = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const handleEdit = (entry: PasswordEntry) => {
    setEditing(entry);
    setDialogOpen(true);
  };

  async function submitDraft(draft: PlainPasswordEntry) {
    if (editing) {
      const updated = await updatePasswordEntry(editing.id, draft, keyAES);
      setEntries((e) =>
        e.map((row) => (row.id === updated.id ? updated : row)),
      );
      toast.success('Entrée modifiée');
    } else {
      const created = await createPasswordEntry(draft, keyAES, USER_ID);
      setEntries((e) => [...e, created]);
      toast.success('Entrée ajoutée');
    }
  }

  async function handleDelete(id: string) {
    await deletePasswordEntry(id);
    setEntries((e) => e.filter((row) => row.id !== id));
    toast.success('Supprimé');
  }

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Mes mots de passe</h1>
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Ajouter
        </Button>
      </div>

      <PasswordEntryTable
        entries={entries}
        keyAES={keyAES}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <PasswordEntryDialog
        open={dialogOpen}
        initial={
          editing ? decryptEntry(editing, keyAES) : undefined
        }
        onClose={() => setDialogOpen(false)}
        onSubmit={submitDraft}
      />
    </main>
  );
}
