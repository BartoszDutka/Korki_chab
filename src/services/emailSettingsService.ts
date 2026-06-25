import type { EmailSettings } from '../types'
import { SINGLE_DOC_ID } from '../types'
import { getSingleDoc, subscribeSingleDoc, setSingleDoc } from './firestoreUtils'

const COL = 'emailSettings'

export const DEFAULT_EMAIL_SETTINGS: EmailSettings = {
  adminEmail: 'kontakt@centrumchabowka.pl',
  senderName: 'Korepetycje Chabówka',
  adminNotificationEnabled: true,
  userConfirmationEnabled: true,
  adminEmailSubject: 'Nowe zgłoszenie na zajęcia — Korepetycje Chabówka',
  userEmailSubject: 'Potwierdzenie zgłoszenia — Korepetycje Chabówka',
  userConfirmationMessage:
    'Dziękujemy za zgłoszenie. Skontaktujemy się w celu potwierdzenia miejsca na wybrane zajęcia.',
  emailFooter: 'Centrum Korepetycji Chabówka · Chabówka',
  updatedAt: new Date().toISOString(),
}

export const emailSettingsService = {
  get: () => getSingleDoc<EmailSettings>(COL, SINGLE_DOC_ID),
  subscribe: (cb: (data: EmailSettings | null) => void) =>
    subscribeSingleDoc<EmailSettings>(COL, SINGLE_DOC_ID, cb),
  update: (data: Partial<EmailSettings>) =>
    setSingleDoc(COL, SINGLE_DOC_ID, { ...data, updatedAt: new Date().toISOString() }),
}
