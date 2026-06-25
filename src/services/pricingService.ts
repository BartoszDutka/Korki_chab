import type { PricingItem } from '../types'
import {
  getCollection,
  subscribeCollection,
  addCollectionItem,
  updateCollectionItem,
  deleteCollectionItem,
} from './firestoreUtils'

const COL = 'pricingItems'

export const pricingService = {
  getAll: () => getCollection<PricingItem>(COL),
  subscribe: (cb: (items: PricingItem[]) => void) => subscribeCollection<PricingItem>(COL, cb),
  add: (item: Omit<PricingItem, 'id'>) => addCollectionItem(COL, item),
  update: (id: string, data: Partial<PricingItem>) => updateCollectionItem(COL, id, data),
  delete: (id: string) => deleteCollectionItem(COL, id),
}
