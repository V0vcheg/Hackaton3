'use client';

import * as React from 'react';
import {toast} from 'sonner';
import {Plus} from 'lucide-react';
import {Card, CardContent, CardHeader} from '@/components/ui/card'

import PassphraseGate from '@/components/password-entries/passphraseGate';
import PasswordEntryTable from '@/components/password-entries/passwordEntryTable';
import PasswordEntryDialog from '@/components/password-entries/passwordEntryDialog';
import {PlainPasswordEntry} from '@/types/password.types'

import {
    listPasswordEntries,
    createPasswordEntry,
    updatePasswordEntry,
    deletePasswordEntry,
    PasswordEntry,
} from '@/lib/api/passwordEntries';
import {decryptEntry} from '@/lib/crypto';
import {Button} from '@/components/ui/button';
import jwt from "jsonwebtoken";

export const dynamic = 'force-dynamic';
const USER_ID = '1'; //! temporaire a changé avec le jwt

export default function PasswordEntriesPage() {
    return (
        <PassphraseGate>
            {(keyAES, report) => <EntriesUI keyAES={keyAES} report={report}/>}
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
    const {payload} = jwt.decode(localStorage.getItem('token')!, {complete: true}) as {
        payload: { userId: string }
    } | null;
    const userId: string = payload?.userId || USER_ID; // Use the userId from the JWT or fallback to USER_ID
    console.log(payload)
    React.useEffect(() => {
        (async () => {
            try {
                const rows = await listPasswordEntries(userId);
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
            const created = await createPasswordEntry(draft, keyAES, userId);
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
        <Card
            className="border-0 shadow-lg bg-[#F8F7FB] dark:bg-[#1A1A22] border-[#E5E5EA] dark:border-[#333333]"
            style={{height: 'calc(100vh - 8rem)'}}
        >
            <CardHeader>
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-bold">Mes mots de passe</h1>
                    <Button onClick={handleAdd}>
                        <Plus className="w-4 h-4 mr-2"/>
                        Ajouter
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
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
            </CardContent>
        </Card>
    );
}
