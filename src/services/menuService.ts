import type { MenuItem } from '../types'
import {
  getCollection,
  subscribeCollection,
  addCollectionItem,
  updateCollectionItem,
  deleteCollectionItem,
} from './firestoreUtils'

const COL = 'menuItems'

export const menuService = {
  getAll: () => getCollection<MenuItem>(COL),
  subscribe: (cb: (items: MenuItem[]) => void) => subscribeCollection<MenuItem>(COL, cb),
  add: (item: Omit<MenuItem, 'id'>) => addCollectionItem(COL, item),
  update: (id: string, data: Partial<MenuItem>) => updateCollectionItem(COL, id, data),
  delete: (id: string) => deleteCollectionItem(COL, id),
}
