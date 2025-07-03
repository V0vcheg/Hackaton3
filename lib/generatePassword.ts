// lib/utils/generatePassword.ts
const ALPHA_LOWER = 'abcdefghijkmnopqrstuvwxyz';
const ALPHA_UPPER = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
const DIGITS      = '23456789';
const SYMBOLS     = '!@#$%^&*()-_=+[]{}';

export function generatePassword(len = 16): string {
  const all = ALPHA_LOWER + ALPHA_UPPER + DIGITS + SYMBOLS;

  // On force au moins un caractère de chaque classe
  const pick = (str: string) => str[Math.floor(Math.random() * str.length)];

  const mandatory = [
    pick(ALPHA_LOWER),
    pick(ALPHA_UPPER),
    pick(DIGITS),
    pick(SYMBOLS),
  ];

  const rest = Array.from({ length: len - mandatory.length }, () => pick(all));

  return [...mandatory, ...rest]
    .sort(() => 0.5 - Math.random())
    .join('');
}
