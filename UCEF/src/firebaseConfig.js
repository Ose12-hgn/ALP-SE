import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    projectId: "ucef-ecf2d"
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)