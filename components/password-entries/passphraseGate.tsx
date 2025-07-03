'use client';
import React from 'react';
import CryptoJS from 'crypto-js';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { deriveKey } from '@/lib/crypto';
import { listPasswordEntries } from '@/lib/api/passwordEntries';

type Props = {
  children: (
    keyAES: CryptoJS.lib.WordArray,
    report: (ok: boolean) => void,
  ) => React.ReactNode;
};

const USER_ID = '1'; // ⚠️ temporaire

export default function PassphraseGate({ children }: Props) {
  const [pass, setPass] = React.useState('');
  const [validated, setValidated] = React.useState(false);
  const [key, setKey] = React.useState<CryptoJS.lib.WordArray | null>(null);
  const [firstTime, setFirstTime] = React.useState<boolean | null>(null);
  const reported = React.useRef(false);

  React.useEffect(() => {
    (async () => {
      try {
        const rows = await listPasswordEntries(USER_ID);
        setFirstTime(rows.length === 0);
      } catch (err) {
        console.error('Impossible de vérifier la première utilisation', err);
        setFirstTime(false);
      }
    })();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    reported.current = false;

    const words = pass.trim().split(/\s+/);

    if (firstTime) {
      if (words.length < 8) {
        toast.error('La passphrase doit contenir au moins 8 mots.');
        return;
      }
      if (words.some((w) => w.length < 4)) {
        toast.error('Chaque mot doit contenir au moins 4 caractères.');
        return;
      }
      if (new Set(words).size !== words.length) {
        toast.error('Les mots de la passphrase doivent être uniques.');
        return;
      }
    }

    try {
      const k = deriveKey(pass.trim());
      setKey(k);
      setValidated(true);
    } catch (err) {
      console.error(err);
      toast.error('Erreur inattendue.');
    }
  };

  const handleReport = (ok: boolean) => {
    if (reported.current) return;
    reported.current = true;

    if (!ok) {
      toast.error('Passphrase incorrecte, réessayez.');
      setValidated(false);
      setKey(null);
      setPass('');
    }
  };

  if (!validated || !key) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F7FB] dark:bg-[#1A1A22] px-4">
        <form
          onSubmit={handleSubmit}
          className="border-0 shadow-lg rounded-xl p-6 w-full max-w-md bg-[#F8F7FB] dark:bg-[#1A1A22] border-[#E5E5EA] dark:border-[#333333]"
        >
          <h2 className="text-xl font-semibold mb-4 text-center">
            Déverrouillage
          </h2>

          <Input
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            placeholder="Passphrase"
            autoFocus
            className="mb-4"
          />

          {firstTime && (
            <ul className="text-sm text-gray-600 mb-4 list-disc list-inside space-y-1">
              <li>8&nbsp;mots minimum</li>
              <li>4&nbsp;caractères minimum par mot</li>
              <li>Aucun mot en double</li>
            </ul>
          )}

          <Button type="submit" className="w-full">
            Déverrouiller
          </Button>
        </form>
      </div>
    );
  }

  return <>{children(key, handleReport)}</>;
}
