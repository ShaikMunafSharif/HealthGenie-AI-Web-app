import CryptoJS from 'crypto-js';

// Use a static key for this demo. In a real app, this should be an environment variable.
const SECRET_KEY = 'healthgenie_super_secret_demo_key_2026';

export const secureStorage = {
  getItem: (name) => {
    try {
      const encryptedValue = localStorage.getItem(name);
      if (!encryptedValue) return null;
      
      const decryptedBytes = CryptoJS.AES.decrypt(encryptedValue, SECRET_KEY);
      const decryptedString = decryptedBytes.toString(CryptoJS.enc.Utf8);
      
      return JSON.parse(decryptedString);
    } catch (error) {
      console.warn(`Failed to decrypt localStorage key "${name}". Returning null.`);
      return null;
    }
  },
  setItem: (name, value) => {
    try {
      const stringValue = JSON.stringify(value);
      const encryptedValue = CryptoJS.AES.encrypt(stringValue, SECRET_KEY).toString();
      localStorage.setItem(name, encryptedValue);
    } catch (error) {
      console.error(`Failed to encrypt localStorage key "${name}".`);
    }
  },
  removeItem: (name) => {
    localStorage.removeItem(name);
  }
};
