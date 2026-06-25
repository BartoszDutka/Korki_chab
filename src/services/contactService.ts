import type { ContactSettings } from '../types'
import { SINGLE_DOC_ID } from '../types'
import { getSingleDoc, subscribeSingleDoc, setSingleDoc } from './firestoreUtils'

const COL = 'contactSettings'

export const contactService = {
  get: () => getSingleDoc<ContactSettings>(COL, SINGLE_DOC_ID),
  subscribe: (cb: (data: ContactSettings | null) => void) =>
    subscribeSingleDoc<ContactSettings>(COL, SINGLE_DOC_ID, cb),
  update: (data: Partial<ContactSettings>) =>
    setSingleDoc(COL, SINGLE_DOC_ID, data as ContactSettings),
}
