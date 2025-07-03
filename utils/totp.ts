import speakeasy from 'speakeasy'
import QRCode from 'qrcode'

export function generateSecret(email: string) {
  return speakeasy.generateSecret({
    name: `MonSite (${email})`,
  })
}

export function getQRCode(secret: string): Promise<string> {
  return QRCode.toDataURL(secret)
}

export function verifyToken(token: string, secret: string): boolean {
  return speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token,
    window: 1,
  })
}