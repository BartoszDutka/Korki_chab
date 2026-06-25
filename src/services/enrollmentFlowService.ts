import type {
  Enrollment,
  Message,
  MessageType,
  SelectedCourse,
  ParticipantData,
  ContactData,
  Agreements,
} from '../types'
import { enrollmentsService } from './enrollmentsService'
import { messagesService } from './messagesService'
import { emailSettingsService, DEFAULT_EMAIL_SETTINGS } from './emailSettingsService'
import { sendEnrollmentEmails, sendMessageNotification } from './emailService'

const now = () => new Date().toISOString()

async function getEmailSettingsSafe() {
  try {
    const settings = await emailSettingsService.get()
    return settings ?? DEFAULT_EMAIL_SETTINGS
  } catch {
    return DEFAULT_EMAIL_SETTINGS
  }
}

function cleanParticipantData(data: ParticipantData): ParticipantData {
  const cleaned: ParticipantData = {
    firstName: data.firstName.trim(),
    lastName: data.lastName.trim(),
    studentClass: data.studentClass.trim(),
  }
  if (data.birthDate?.trim()) {
    cleaned.birthDate = data.birthDate.trim()
  }
  return cleaned
}

function cleanContactData(data: ContactData): ContactData {
  const cleaned: ContactData = {
    parentFirstName: data.parentFirstName.trim(),
    parentLastName: data.parentLastName.trim(),
    phone: data.phone.trim(),
    email: data.email.trim(),
  }
  if (data.message?.trim()) {
    cleaned.message = data.message.trim()
  }
  return cleaned
}

export interface SubmitEnrollmentInput {
  userId: string | null
  isGuest: boolean
  userEmail: string
  userName: string
  selectedCourses: SelectedCourse[]
  participantData: ParticipantData
  contactData: ContactData
  agreements: Agreements
  messageType: MessageType
}

export async function submitEnrollment(input: SubmitEnrollmentInput): Promise<Enrollment> {
  const timestamp = now()
  const participantData = cleanParticipantData(input.participantData)
  const contactData = cleanContactData(input.contactData)

  const enrollmentData: Omit<Enrollment, 'id'> = {
    userId: input.userId,
    isGuest: input.isGuest,
    userEmail: input.userEmail.trim(),
    userName: input.userName.trim(),
    selectedCourses: input.selectedCourses,
    participantData,
    contactData,
    agreements: input.agreements,
    status: 'sent',
    createdAt: timestamp,
    updatedAt: timestamp,
  }

  const enrollmentId = await enrollmentsService.add(enrollmentData)
  const enrollment: Enrollment = { id: enrollmentId, ...enrollmentData }

  const messageData: Omit<Message, 'id'> = {
    type: input.messageType,
    userId: input.userId,
    userEmail: input.userEmail.trim(),
    userName: input.userName.trim(),
    phone: contactData.phone,
    subject:
      input.messageType === 'cartEnrollment'
        ? 'Zgłoszenie z koszyka zapisów'
        : 'Zgłoszenie na zajęcia (bez konta)',
    content: contactData.message ?? '',
    selectedCourses: input.selectedCourses,
    participantData,
    contactData,
    agreements: input.agreements,
    status: 'new',
    relatedEnrollmentId: enrollmentId,
    createdAt: timestamp,
    updatedAt: timestamp,
  }

  await messagesService.add(messageData)

  const emailSettings = await getEmailSettingsSafe()
  try {
    await sendEnrollmentEmails(enrollment, emailSettings)
  } catch {
    /* e-mail jest stub — zgłoszenie już zapisane w Firestore */
  }

  return enrollment
}

export async function submitContactMessage(
  data: Omit<Message, 'id' | 'createdAt' | 'updatedAt' | 'status'>,
): Promise<void> {
  const timestamp = now()
  const message: Omit<Message, 'id'> = {
    ...data,
    status: 'new',
    createdAt: timestamp,
    updatedAt: timestamp,
  }
  await messagesService.add(message)
  try {
    const emailSettings = await getEmailSettingsSafe()
    await sendMessageNotification({ id: '', ...message }, emailSettings)
  } catch {
    /* stub e-mail */
  }
}
