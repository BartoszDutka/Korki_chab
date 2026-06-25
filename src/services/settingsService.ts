import type { SiteSettings } from '../types'
import { SINGLE_DOC_ID } from '../types'
import {
  getSingleDoc,
  subscribeSingleDoc,
  setSingleDoc,
} from './firestoreUtils'

const COL = 'siteSettings'

export const settingsService = {
  get: () => getSingleDoc<SiteSettings>(COL, SINGLE_DOC_ID),
  subscribe: (cb: (data: SiteSettings | null) => void) =>
    subscribeSingleDoc<SiteSettings>(COL, SINGLE_DOC_ID, cb),
  update: (data: Partial<SiteSettings>) =>
    setSingleDoc(COL, SINGLE_DOC_ID, data as SiteSettings),
}
