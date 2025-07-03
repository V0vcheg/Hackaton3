'use client';
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { generatePassword } from '@/lib/generatePassword';

type Props = {
  open: boolean;
  initial?: { site: string; login: string; pwd: string };
  onSubmit: (v: { site: string; login: string; pwd: string }) => Promise<void>;
  onClose: () => void;
};

export default function PasswordEntryDialog({
  open,
  initial,
  onSubmit,
  onClose,
}: Props) {
  const [site,  setSite]  = React.useState(initial?.site  ?? '');
  const [login, setLogin] = React.useState(initial?.login ?? '');
  const [pwd,   setPwd]   = React.useState(initial?.pwd ?? generatePassword());

  const regenPwd = () => setPwd(generatePassword());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ site, login, pwd });
    onClose();
  };

  React.useEffect(() => {
    setSite (initial?.site  ?? '');
    setLogin(initial?.login ?? '');
    setPwd  (initial?.pwd   ?? generatePassword());
  }, [initial]);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="sm:max-w-md border-0 shadow-lg bg-[#F8F7FB] dark:bg-[#1A1A22] border-[#E5E5EA] dark:border-[#333333]"
      >
        <DialogHeader>
          <DialogTitle>
            {initial ? 'Modifier' : 'Ajouter'} un mot de passe
          </DialogTitle>
        </DialogHeader>

        <form id="pwd-form" className="grid gap-4 py-2" onSubmit={handleSubmit}>
          <label className="grid gap-1">
            <span className="text-sm text-muted-foreground">Site</span>
            <Input
              value={site}
              onChange={(e) => setSite(e.target.value)}
              required
            />
          </label>

          <label className="grid gap-1">
            <span className="text-sm text-muted-foreground">Login</span>
            <Input
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              required
            />
          </label>

          <label className="grid gap-1">
            <span className="text-sm text-muted-foreground">Mot de passe</span>
            <div className="flex gap-2">
              <Input
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
                required
                className="flex-1"
              />
              <Button
                type="button"
                variant="ghost"
                onClick={regenPwd}
                title="Générer un nouveau mot de passe"
              >
                ↻
              </Button>
            </div>
          </label>
        </form>

        <DialogFooter>
          <Button variant="secondary" type="button" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" form="pwd-form">
            {initial ? 'Enregistrer' : 'Ajouter'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
