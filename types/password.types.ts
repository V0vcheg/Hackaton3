export interface PlainPasswordEntry {
  site:  string
  login: string
  pwd:   string
}

export interface EncryptedPasswordEntry {
  id?:        string
  iniVector:         string
  cipherData: string
  createdAt?: string
  updatedAt?: string
}
