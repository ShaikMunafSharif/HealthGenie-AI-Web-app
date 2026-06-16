import CryptoJS from 'crypto-js';

const USERS_DB_KEY = 'healthgenie-users-db';
const SECRET_KEY = 'healthgenie_super_secret_demo_key_2026'; // Same as secureStorage for simplicity

// Helper to encrypt the users database
const encryptDB = (data) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
};

// Helper to decrypt the users database
const decryptDB = () => {
  const encrypted = localStorage.getItem(USERS_DB_KEY);
  if (!encrypted) return {};
  try {
    const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  } catch (e) {
    console.error("Failed to decrypt users database.");
    return {};
  }
};

export const mockBackend = {
  /**
   * Register a new user
   * @param {string} email 
   * @param {string} password 
   * @param {string} name 
   * @returns {Promise<{success: boolean, user?: object, error?: string}>}
   */
  registerUser: async (email, password, name) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const db = decryptDB();
        const normalizedEmail = email.toLowerCase().trim();
        
        if (db[normalizedEmail]) {
          resolve({ success: false, error: 'Email already registered' });
          return;
        }

        const passwordHash = CryptoJS.SHA256(password).toString();
        const newUser = {
          id: Date.now(),
          email: normalizedEmail,
          name: name.trim(),
          passwordHash: passwordHash, // Store hash, not plaintext password
          createdAt: new Date().toISOString()
        };

        db[normalizedEmail] = newUser;
        localStorage.setItem(USERS_DB_KEY, encryptDB(db));

        // Return user without passwordHash
        const { passwordHash: _, ...safeUser } = newUser;
        resolve({ success: true, user: safeUser });
      }, 800); // Simulate network delay
    });
  },

  /**
   * Authenticate a user
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise<{success: boolean, user?: object, error?: string}>}
   */
  loginUser: async (email, password) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const db = decryptDB();
        const normalizedEmail = email.toLowerCase().trim();
        const user = db[normalizedEmail];

        if (!user) {
          resolve({ success: false, error: 'Invalid email or password' });
          return;
        }

        const passwordHash = CryptoJS.SHA256(password).toString();
        if (user.passwordHash !== passwordHash) {
          resolve({ success: false, error: 'Invalid email or password' });
          return;
        }

        // Return user without passwordHash
        const { passwordHash: _, ...safeUser } = user;
        resolve({ success: true, user: safeUser });
      }, 800); // Simulate network delay
    });
  }
};
