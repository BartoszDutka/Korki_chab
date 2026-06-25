import type { FAQItem } from '../types'
import {
  getCollection,
  subscribeCollection,
  addCollectionItem,
  updateCollectionItem,
  deleteCollectionItem,
} from './firestoreUtils'

const COL = 'faqItems'

export const faqService = {
  getAll: () => getCollection<FAQItem>(COL),
  subscribe: (cb: (items: FAQItem[]) => void) => subscribeCollection<FAQItem>(COL, cb),
  add: (item: Omit<FAQItem, 'id'>) => addCollectionItem(COL, item),
  update: (id: string, data: Partial<FAQItem>) => updateCollectionItem(COL, id, data),
  delete: (id: string) => deleteCollectionItem(COL, id),
}
