import type { FooterSettings } from '../types'
import { SINGLE_DOC_ID } from '../types'
import { getSingleDoc, subscribeSingleDoc, setSingleDoc } from './firestoreUtils'

const COL = 'footerSettings'

export const footerService = {
  get: () => getSingleDoc<FooterSettings>(COL, SINGLE_DOC_ID),
  subscribe: (cb: (data: FooterSettings | null) => void) =>
    subscribeSingleDoc<FooterSettings>(COL, SINGLE_DOC_ID, cb),
  update: (data: Partial<FooterSettings>) =>
    setSingleDoc(COL, SINGLE_DOC_ID, data as FooterSettings),
}
