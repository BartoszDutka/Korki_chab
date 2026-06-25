import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { getFirebaseStorage } from '../lib/firebase'

export const storageService = {
  uploadImage: async (path: string, file: File): Promise<string> => {
    const storageRef = ref(getFirebaseStorage(), path)
    await uploadBytes(storageRef, file)
    return getDownloadURL(storageRef)
  },
}
