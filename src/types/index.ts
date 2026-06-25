export type PostStatus = 'draft' | 'published'

export interface HeroButton {
  label: string
  href: string
}

export interface SectionVisibility {
  hero: boolean
  subjects: boolean
  educationLevels: boolean
  pricing: boolean
  posts: boolean
  testimonials: boolean
  faq: boolean
  about: boolean
  contact: boolean
}

export interface AboutHighlights {
  title: string
  description: string
}

export interface SiteSettings {
  siteName: string
  heroTitle: string
  heroSubtitle: string
  heroDescription: string
  heroButtons: HeroButton[]
  contactPhone: string
  contactEmail: string
  sectionVisibility: SectionVisibility
  aboutTitle: string
  aboutContent: string
  aboutLocations: string[]
  aboutHighlights: AboutHighlights[]
  aboutVisible: boolean
  pricingFooterText: string
}

export interface MenuItem {
  id: string
  label: string
  href: string
  order: number
  visible: boolean
}

export interface Post {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  publishedAt: string
  author: string
  status: PostStatus
  imageUrl: string
  metaTitle: string
  metaDescription: string
  createdAt: string
  updatedAt: string
}

export interface Subject {
  id: string
  name: string
  description: string
  level: string
  order: number
  visible: boolean
}

export interface EducationLevel {
  id: string
  name: string
  description: string
  order: number
  visible: boolean
}

export interface PricingItem {
  id: string
  name: string
  duration: string
  price: string
  description: string
  order: number
  visible: boolean
}

export interface Testimonial {
  id: string
  name: string
  content: string
  rating: number
  context: string
  order: number
  visible: boolean
  createdAt: string
}

export interface FAQItem {
  id: string
  question: string
  answer: string
  category: string
  order: number
  visible: boolean
}

export interface ContactSettings {
  phone: string
  email: string
  address: string
  location: string
  googleMapsUrl: string
  contactText: string
  contactHours: string
  onlineInfo: string
  stationaryInfo: string
}

export interface FormFieldConfig {
  id: string
  name: string
  label: string
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select'
  placeholder: string
  required: boolean
  visible: boolean
  options?: string[]
}

export interface FormSettings {
  fields: FormFieldConfig[]
  rodoText: string
  successMessage: string
  targetEmail: string
}

export interface FooterLink {
  label: string
  href: string
}

export interface FooterSettings {
  footerTitle: string
  footerDescription: string
  links: FooterLink[]
  phone: string
  email: string
  location: string
  seoPhrases: string[]
  copyright: string
}

export interface SeoSettings {
  defaultMetaTitle: string
  defaultMetaDescription: string
  homeMetaTitle: string
  homeMetaDescription: string
  postsMetaTitle: string
  postsMetaDescription: string
  localSeoPhrases: string[]
}

export const SINGLE_DOC_ID = 'main'

// --- Courses & enrollments ---

export type CourseStatus = 'active' | 'hidden' | 'finished' | 'full'
export type EnrollmentStatus = 'sent' | 'in_contact' | 'confirmed' | 'rejected' | 'cancelled'
export type MessageType = 'contact' | 'enrollment' | 'reservation' | 'cartEnrollment'
export type MessageStatus = 'new' | 'read' | 'in_contact' | 'confirmed' | 'rejected' | 'completed' | 'archived'
export type UserRole = 'user' | 'admin'

export interface SelectedCourse {
  courseId: string
  title: string
  price: number
  currency: string
  dayOfWeek?: string
  startTime?: string
  endTime?: string
  startDate?: string
}

export interface ParticipantData {
  firstName: string
  lastName: string
  birthDate?: string
  studentClass: string
}

export interface ContactData {
  parentFirstName: string
  parentLastName: string
  phone: string
  email: string
  message?: string
}

export interface Agreements {
  termsAccepted: boolean
  rodoAccepted: boolean
}

export interface Course {
  id: string
  title: string
  slug: string
  shortDescription: string
  fullDescription: string
  subject: string
  level: string
  location: string
  dayOfWeek: string
  startTime: string
  endTime: string
  startDate: string
  endDate: string
  lessonsCount: number
  price: number
  currency: string
  seatsLimit: number
  seatsTaken: number
  seatsAvailable: number
  status: CourseStatus
  allowGuestEnrollment: boolean
  allowCartEnrollment: boolean
  termsUrl?: string
  colorTag?: string
  order: number
  visible: boolean
  createdAt: string
  updatedAt: string
}

export interface Enrollment {
  id: string
  userId: string | null
  isGuest: boolean
  userEmail: string
  userName: string
  selectedCourses: SelectedCourse[]
  participantData: ParticipantData
  contactData: ContactData
  agreements: Agreements
  status: EnrollmentStatus
  adminNote?: string
  createdAt: string
  updatedAt: string
}

export interface UserProfile {
  uid: string
  displayName: string
  email: string
  photoURL?: string
  phone?: string
  role: UserRole
  createdAt: string
  updatedAt: string
}

export interface CartItem {
  courseId: string
  title: string
  date: string
  time: string
  price: number
  currency: string
  addedAt: string
}

export interface Cart {
  userId: string
  items: CartItem[]
  updatedAt: string
}

export interface Message {
  id: string
  type: MessageType
  userId?: string | null
  userEmail: string
  userName: string
  phone?: string
  subject: string
  content: string
  selectedCourses?: SelectedCourse[]
  participantData?: ParticipantData
  contactData?: ContactData
  agreements?: Agreements
  status: MessageStatus
  adminNote?: string
  createdAt: string
  updatedAt: string
  readAt?: string
  relatedEnrollmentId?: string
}

export interface EmailSettings {
  adminEmail: string
  senderName: string
  adminNotificationEnabled: boolean
  userConfirmationEnabled: boolean
  adminEmailSubject: string
  userEmailSubject: string
  userConfirmationMessage: string
  emailFooter: string
  updatedAt: string
}

export const ADMIN_EMAILS = ['admin@centrumchabowka.pl']

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false
  return ADMIN_EMAILS.includes(email.trim().toLowerCase())
}

export const ENROLLMENT_STATUS_LABELS: Record<EnrollmentStatus, string> = {
  sent: 'Wysłane',
  in_contact: 'Przyjęte do kontaktu',
  confirmed: 'Potwierdzone',
  rejected: 'Odrzucone',
  cancelled: 'Anulowane',
}

export const MESSAGE_STATUS_LABELS: Record<MessageStatus, string> = {
  new: 'Nowe',
  read: 'Odczytane',
  in_contact: 'W trakcie kontaktu',
  confirmed: 'Potwierdzone',
  rejected: 'Odrzucone',
  completed: 'Zakończone',
  archived: 'Archiwalne',
}

export const COURSE_STATUS_LABELS: Record<CourseStatus, string> = {
  active: 'Aktywne',
  hidden: 'Ukryte',
  finished: 'Zakończone',
  full: 'Brak miejsc',
}
