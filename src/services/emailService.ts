import type { Enrollment, Message, EmailSettings } from '../types'
import { DEFAULT_EMAIL_SETTINGS } from './emailSettingsService'

/**
 * Email delivery stub — integrate with Firebase Cloud Functions + Resend/SendGrid.
 * Messages are always saved to Firestore; emails are logged until backend is configured.
 */

export interface EmailPayload {
  to: string
  subject: string
  body: string
}

function logEmail(payload: EmailPayload) {
  console.info('[email stub]', payload.to, payload.subject)
}

export function buildAdminEnrollmentEmail(
  enrollment: Enrollment,
  settings: EmailSettings = DEFAULT_EMAIL_SETTINGS,
): EmailPayload {
  const courses = enrollment.selectedCourses.map((c) => c.title).join(', ')
  const body = [
    `Typ: zapis na zajęcia`,
    `Od: ${enrollment.userName} (${enrollment.userEmail})`,
    `Telefon: ${enrollment.contactData.phone}`,
    `Uczestnik: ${enrollment.participantData.firstName} ${enrollment.participantData.lastName}`,
    `Klasa: ${enrollment.participantData.studentClass}`,
    `Zajęcia: ${courses}`,
    enrollment.contactData.message ? `Wiadomość: ${enrollment.contactData.message}` : '',
    `Data: ${new Date(enrollment.createdAt).toLocaleString('pl-PL')}`,
    settings.emailFooter,
  ]
    .filter(Boolean)
    .join('\n')

  return {
    to: settings.adminEmail,
    subject: settings.adminEmailSubject,
    body,
  }
}

export function buildUserConfirmationEmail(
  enrollment: Enrollment,
  settings: EmailSettings = DEFAULT_EMAIL_SETTINGS,
): EmailPayload {
  const courses = enrollment.selectedCourses.map((c) => `- ${c.title}`).join('\n')
  const body = [
    settings.userConfirmationMessage,
    '',
    'Wybrane zajęcia:',
    courses,
    '',
    `Kontakt: ${settings.adminEmail}`,
    settings.emailFooter,
  ].join('\n')

  return {
    to: enrollment.userEmail,
    subject: settings.userEmailSubject,
    body,
  }
}

export async function sendAdminNotification(
  enrollment: Enrollment,
  settings?: EmailSettings,
): Promise<void> {
  const s = settings ?? DEFAULT_EMAIL_SETTINGS
  if (!s.adminNotificationEnabled) return
  logEmail(buildAdminEnrollmentEmail(enrollment, s))
}

export async function sendUserConfirmation(
  enrollment: Enrollment,
  settings?: EmailSettings,
): Promise<void> {
  const s = settings ?? DEFAULT_EMAIL_SETTINGS
  if (!s.userConfirmationEnabled) return
  logEmail(buildUserConfirmationEmail(enrollment, s))
}

export async function sendEnrollmentEmails(
  enrollment: Enrollment,
  settings?: EmailSettings,
): Promise<void> {
  await sendAdminNotification(enrollment, settings)
  await sendUserConfirmation(enrollment, settings)
}

export async function sendMessageNotification(
  message: Message,
  settings?: EmailSettings,
): Promise<void> {
  const s = settings ?? DEFAULT_EMAIL_SETTINGS
  if (!s.adminNotificationEnabled) return
  logEmail({
    to: s.adminEmail,
    subject: message.subject,
    body: `${message.content}\n\nOd: ${message.userName} (${message.userEmail})`,
  })
}
