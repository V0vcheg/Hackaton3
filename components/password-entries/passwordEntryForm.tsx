'use client';
import { useState } from 'react';

type Props = {
  onSubmit: (v: { site: string; login: string; pwd: string }) => Promise<void>;
  initial?: { site: string; login: string; pwd: string };
  onCancel?: () => void;
};

export default function PasswordEntryForm({
  onSubmit,
  initial,
  onCancel,
}: Props) {
  const [site, setSite] = useState(initial?.site ?? '');
  const [login, setLogin] = useState(initial?.login ?? '');
  const [pwd, setPwd] = useState(initial?.pwd ?? '');

  return (
    <form
      className="flex flex-col gap-2 border p-4 rounded"
      onSubmit={async (e) => {
        e.preventDefault();
        await onSubmit({ site, login, pwd });
        setSite('');
        setLogin('');
        setPwd('');
      }}
    >
      <input
        placeholder="Site"
        value={site}
        onChange={(e) => setSite(e.target.value)}
        required
        className="border p-1 rounded"
      />
      <input
        placeholder="Login"
        value={login}
        onChange={(e) => setLogin(e.target.value)}
        required
        className="border p-1 rounded"
      />
      <input
        placeholder="Mot de passe"
        value={pwd}
        onChange={(e) => setPwd(e.target.value)}
        required
        className="border p-1 rounded"
      />
      <div className="flex gap-2">
        <button className="bg-green-600 text-white px-3 py-1 rounded">
          {initial ? 'Enregistrer' : 'Ajouter'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="border px-3 py-1 rounded"
          >
            Annuler
          </button>
        )}
      </div>
    </form>
  );
}
