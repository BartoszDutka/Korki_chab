import type { FormSettings } from '../types'
import { SINGLE_DOC_ID } from '../types'
import { getSingleDoc, subscribeSingleDoc, setSingleDoc } from './firestoreUtils'

const COL = 'formSettings'

export const formSettingsService = {
  get: () => getSingleDoc<FormSettings>(COL, SINGLE_DOC_ID),
  subscribe: (cb: (data: FormSettings | null) => void) =>
    subscribeSingleDoc<FormSettings>(COL, SINGLE_DOC_ID, cb),
  update: (data: Partial<FormSettings>) =>
    setSingleDoc(COL, SINGLE_DOC_ID, data as FormSettings),
}
