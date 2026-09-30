import { createContext, useContext, useState, useEffect } from 'react';
import {
  auth,
  firebaseEnabled,
} from '../firebase';
import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth';

const AuthContext = createContext();

const SESSION_KEY = 'art-center-auth-user';

const demoAccounts = {
  'student@demo.com': {
    name: 'Student User',
    password: 'student123',
    role: 'STUDENT',
  },
  'admin@demo.com': {
    name: 'Admin User',
    password: 'admin123',
    role: 'ADMIN',
  },
};

const readStoredUser = () => {
  const storedUser = localStorage.getItem(SESSION_KEY);
  if (!storedUser) return null;

  try {
    return JSON.parse(storedUser);
  } catch {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
};

const persistUser = (userData) => {
  if (userData) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(userData));
    localStorage.setItem('user', JSON.stringify(userData));
    return;
  }

  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem('user');
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(readStoredUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (firebaseEnabled && auth) {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          const firebaseUserData = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
            role: 'STUDENT',
          };
          setUser(firebaseUserData);
          persistUser(firebaseUserData);
        } else {
          setUser(null);
          persistUser(null);
        }

        setLoading(false);
      });

      return () => unsubscribe();
    }

    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!firebaseEnabled && demoAccounts[normalizedEmail]) {
      const account = demoAccounts[normalizedEmail];

      if (account.password !== password) {
        throw new Error('Invalid password for demo account.');
      }

      const demoUser = {
        uid: `demo-${normalizedEmail}`,
        email: normalizedEmail,
        name: account.name,
        role: account.role,
      };

      setUser(demoUser);
      persistUser(demoUser);
      return demoUser;
    }

    if (!firebaseEnabled) {
      throw new Error('Firebase is not configured yet. Use the demo credentials from the login form.');
    }

    const credential = await signInWithEmailAndPassword(auth, normalizedEmail, password);
    const firebaseUserData = {
      uid: credential.user.uid,
      email: credential.user.email,
      name: credential.user.displayName || credential.user.email?.split('@')[0] || 'User',
      role: 'STUDENT',
    };

    setUser(firebaseUserData);
    persistUser(firebaseUserData);
    return firebaseUserData;
  };

  const logout = async () => {
    if (firebaseEnabled && auth) {
      await firebaseSignOut(auth);
    }

    setUser(null);
    persistUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);