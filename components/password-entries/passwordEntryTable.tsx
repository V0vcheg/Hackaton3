"use client";
import * as React from "react";
import { Copy, Edit2, Trash2 } from "lucide-react";
import { decryptEntry } from "@/lib/crypto";
import { PasswordEntry } from "@/lib/api/passwordEntries";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Props = {
  entries: PasswordEntry[];
  keyAES: CryptoJS.lib.WordArray;
  onEdit: (entry: PasswordEntry) => void;
  onDelete: (id: string) => Promise<void>;
};

export default function PasswordEntryTable({
  entries,
  keyAES,
  onEdit,
  onDelete,
}: Props) {
  async function copy(text: string) {
    await navigator.clipboard.writeText(text);
    toast.info("Copié dans le presse-papiers");
  }

  return (
    <table className="w-full border-collapse mt-4 text-center">
      <thead>
        <tr className="bg-gray-100">
          <th className="border p-2">Login</th>
          <th className="border p-2">Mot&nbsp;de&nbsp;passe</th>
          <th className="border p-2">Site</th>
          <th className="border p-2">Actions</th>
        </tr>
      </thead>

      <tbody>
        {entries.map((e) => {
          let plain;
          try {
            plain = decryptEntry(e, keyAES);
          } catch (err) {
            return (
              <tr key={e.id}>
                <td colSpan={4} className="text-red-600 py-2">
                  Erreur&nbsp;de&nbsp;déchiffrement
                </td>
              </tr>
            );
          }

          const isUrl = /^https?:\/\//i.test(plain.site);

          return (
            <tr key={e.id} className="border-t">
              <td className="relative p-2">
                <span
                  className="block mx-auto max-w-[18ch] truncate text-center select-text"
                  title={plain.login}
                >
                  {plain.login}
                </span>

                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => copy(plain.login)}
                  title="Copier le login"
                  className="absolute right-1 top-1/2 -translate-y-1/2"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </td>

              <td className="relative p-2">
                <span
                  className="block mx-auto max-w-[18ch] truncate text-center select-text"
                  title={plain.pwd}
                >
                  {plain.pwd}
                </span>

                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => copy(plain.pwd)}
                  title="Copier le mot de passe"
                  className="absolute right-1 top-1/2 -translate-y-1/2"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </td>

              <td className="p-2">
                {isUrl ? (
                  <a
                    href={plain.site}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block max-w-[24ch] truncate text-blue-600 underline"
                    title={plain.site}
                  >
                    {plain.site}
                  </a>
                ) : (
                  <span
                    className="inline-block max-w-[24ch] truncate"
                    title={plain.site}
                  >
                    {plain.site}
                  </span>
                )}
              </td>

              <td className="p-2">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => onEdit(e)}
                  className="mr-1"
                >
                  <Edit2 className="w-4 h-4" />
                </Button>

                <Button
                  size="icon"
                  variant="destructive"
                  onClick={() => onDelete(e.id)}
                  title="Supprimer"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
