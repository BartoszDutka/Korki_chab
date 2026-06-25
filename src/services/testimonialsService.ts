import type { Testimonial } from '../types'
import {
  getCollection,
  subscribeCollection,
  addCollectionItem,
  updateCollectionItem,
  deleteCollectionItem,
} from './firestoreUtils'

const COL = 'testimonials'

export const testimonialsService = {
  getAll: () => getCollection<Testimonial>(COL),
  subscribe: (cb: (items: Testimonial[]) => void) => subscribeCollection<Testimonial>(COL, cb),
  add: (item: Omit<Testimonial, 'id'>) => addCollectionItem(COL, item),
  update: (id: string, data: Partial<Testimonial>) => updateCollectionItem(COL, id, data),
  delete: (id: string) => deleteCollectionItem(COL, id),
}
