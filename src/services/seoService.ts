import type { SeoSettings } from '../types'
import { SINGLE_DOC_ID } from '../types'
import { getSingleDoc, subscribeSingleDoc, setSingleDoc } from './firestoreUtils'

const COL = 'seoSettings'

export const seoService = {
  get: () => getSingleDoc<SeoSettings>(COL, SINGLE_DOC_ID),
  subscribe: (cb: (data: SeoSettings | null) => void) =>
    subscribeSingleDoc<SeoSettings>(COL, SINGLE_DOC_ID, cb),
  update: (data: Partial<SeoSettings>) =>
    setSingleDoc(COL, SINGLE_DOC_ID, data as SeoSettings),
}
