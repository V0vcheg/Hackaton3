export interface PlainPasswordEntry {
  site:  string
  login: string
  pwd:   string
}

export interface EncryptedPasswordEntry {
  id?:        string
  iv:         string
  cipherData: string
  createdAt?: string
  updatedAt?: string
}
