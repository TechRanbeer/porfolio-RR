// Firebase configuration and initialization
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy, Timestamp } from 'firebase/firestore';

// Firebase config - these are public and safe to expose
const firebaseConfig = {
  apiKey: "AIzaSyBqJJ5K5K5K5K5K5K5K5K5K5K5K5K5K5K5",
  authDomain: "ranbeer-portfolio.firebaseapp.com",
  projectId: "ranbeer-portfolio",
  storageBucket: "ranbeer-portfolio.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456789012345678"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Types
export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: Timestamp;
}

// Contact form functions
export const submitContactMessage = async (messageData: Omit<ContactMessage, 'id' | 'read' | 'createdAt'>) => {
  try {
    const docRef = await addDoc(collection(db, 'contact_messages'), {
      ...messageData,
      read: false,
      createdAt: Timestamp.now()
    });
    console.log('Message saved with ID:', docRef.id);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error saving message:', error);
    throw error;
  }
};

// Admin functions
export const getAllMessages = async (): Promise<ContactMessage[]> => {
  try {
    const q = query(collection(db, 'contact_messages'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as ContactMessage));
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};

export const markMessageAsRead = async (messageId: string, read: boolean) => {
  try {
    const messageRef = doc(db, 'contact_messages', messageId);
    await updateDoc(messageRef, { read });
    return { success: true };
  } catch (error) {
    console.error('Error updating message:', error);
    throw error;
  }
};

export const deleteMessage = async (messageId: string) => {
  try {
    await deleteDoc(doc(db, 'contact_messages', messageId));
    return { success: true };
  } catch (error) {
    console.error('Error deleting message:', error);
    throw error;
  }
};