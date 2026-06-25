import type { Subject } from '../types'
import {
  getCollection,
  subscribeCollection,
  addCollectionItem,
  updateCollectionItem,
  deleteCollectionItem,
} from './firestoreUtils'

const COL = 'subjects'

export const subjectsService = {
  getAll: () => getCollection<Subject>(COL),
  subscribe: (cb: (items: Subject[]) => void) => subscribeCollection<Subject>(COL, cb),
  add: (item: Omit<Subject, 'id'>) => addCollectionItem(COL, item),
  update: (id: string, data: Partial<Subject>) => updateCollectionItem(COL, id, data),
  delete: (id: string) => deleteCollectionItem(COL, id),
}
