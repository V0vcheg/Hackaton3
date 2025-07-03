import CryptoJS from "crypto-js";
import { PlainPasswordEntry, EncryptedPasswordEntry } from "@/types/password.types";

const CONST_SALT = CryptoJS.enc.Hex.parse(
  process.env.NEXT_PUBLIC_CONST_SALT as string
);

/**
 * Derives a cryptographic key from a given passphrase using PBKDF2.
 *
 * @param passphrase - The input string to derive the key from.
 * @returns The derived key as a CryptoJS WordArray.
 *
 * @remarks
 * Uses PBKDF2 with a constant salt (`CONST_SALT`), a key size of 256 bits,
 * and 100,000 iterations for enhanced security.
 */
export function deriveKey(passphrase: string) {
  return CryptoJS.PBKDF2(passphrase, CONST_SALT, {
    keySize: 256 / 32,
    iterations: 100_000,
  });
}

/**
 * Encrypts a plain password entry using AES encryption.
 *
 * @param plain - The plain password entry to encrypt.
 * @param key - The cryptographic key (as a CryptoJS WordArray) used for encryption.
 * @returns The encrypted password entry, containing the IV and cipher data.
 *
 * @remarks
 * - Generates a random 16-byte initialization vector (IV) for each encryption.
 * - Serializes the plain entry to JSON before encryption.
 * - The resulting cipher data is encoded in Base64, and the IV is encoded in hexadecimal.
 */
export function encryptEntry(
  plain: PlainPasswordEntry,
  key: CryptoJS.lib.WordArray
): EncryptedPasswordEntry {
  const iv = CryptoJS.lib.WordArray.random(16); // 16 octets
  const cipher = CryptoJS.AES.encrypt(JSON.stringify(plain), key, { iv });
console.log('🧪 IV généré :', iv.toString(CryptoJS.enc.Hex));
  return {
    iniVector: iv.toString(CryptoJS.enc.Hex),
    cipherData: cipher.ciphertext.toString(CryptoJS.enc.Base64),
  };
}

/**
 * Déchiffre un enregistrement de mot de passe chiffré à l'aide d'une clé cryptographique.
 *
 * @param enc - L'entrée de mot de passe chiffrée, contenant l'IV et les données chiffrées.
 * @param key - La clé cryptographique (CryptoJS WordArray) utilisée pour le déchiffrement.
 * @returns L'entrée de mot de passe en clair (PlainPasswordEntry).
 *
 * @remarks
 * - Utilise l'algorithme AES pour déchiffrer les données.
 * - L'IV est décodé depuis l'hexadécimal et les données chiffrées depuis le Base64.
 * - Le résultat est désérialisé depuis une chaîne JSON.
 */
export function decryptEntry(
  entry: { iniVector: string; cipherData: string },
  key: CryptoJS.lib.WordArray,
) {
  // ← IMPORTANT : on parse le IV depuis l’HEX stocké en BDD
  const iv = CryptoJS.enc.Hex.parse(entry.iniVector);

  const decrypted = CryptoJS.AES.decrypt(entry.cipherData, key, { iv });
  const plaintext = decrypted.toString(CryptoJS.enc.Utf8);

  if (!plaintext) {
    // CryptoJS renvoie une chaîne vide si la clé / l’IV sont faux
    throw new Error('Decryption failed – empty plaintext');
  }

  return JSON.parse(plaintext) as { site: string; login: string; pwd: string };
}