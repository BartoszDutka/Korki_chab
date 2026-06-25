import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { getFirebaseStorage } from '../lib/firebase'

export const storageService = {
  uploadImage: async (path: string, file: File): Promise<string> => {
    const storage = await getFirebaseStorage()
    const storageRef = ref(storage, path)
    await uploadBytes(storageRef, file)
    return getDownloadURL(storageRef)
  },
}
