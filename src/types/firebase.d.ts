declare module 'firebase/app' {
  export function initializeApp(config: any): any;
  export function getApps(): any[];
  export function getApp(): any;
}

declare module 'firebase/auth' {
  export function getAuth(app?: any): any;
  export function onAuthStateChanged(auth: any, callback: (user: any) => void): () => void;
  export function signInWithPopup(auth: any, provider: any): Promise<any>;
  export function signOut(auth: any): Promise<void>;
  export const GoogleAuthProvider: any;
}

declare module 'firebase/database' {
  export function getDatabase(app?: any): any;
  export function ref(db: any, path?: string): any;
  export function set(ref: any, value: any): Promise<void>;
  export function get(ref: any): Promise<any>;
  export function onValue(ref: any, callback: (snapshot: any) => void): () => void;
}

declare module 'firebase/firestore' {
  export function getFirestore(app?: any): any;
  export function collection(db: any, path: string): any;
  export function doc(db: any, path: string, ...pathSegments: string[]): any;
  export function getDocs(query: any): Promise<any>;
  export function setDoc(docRef: any, data: any, options?: any): Promise<void>;
}
