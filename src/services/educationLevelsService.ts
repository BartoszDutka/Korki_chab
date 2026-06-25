import type { EducationLevel } from '../types'
import {
  getCollection,
  subscribeCollection,
  addCollectionItem,
  updateCollectionItem,
  deleteCollectionItem,
} from './firestoreUtils'

const COL = 'educationLevels'

export const educationLevelsService = {
  getAll: () => getCollection<EducationLevel>(COL),
  subscribe: (cb: (items: EducationLevel[]) => void) =>
    subscribeCollection<EducationLevel>(COL, cb),
  add: (item: Omit<EducationLevel, 'id'>) => addCollectionItem(COL, item),
  update: (id: string, data: Partial<EducationLevel>) => updateCollectionItem(COL, id, data),
  delete: (id: string) => deleteCollectionItem(COL, id),
}
