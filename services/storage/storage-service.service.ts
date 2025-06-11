import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageServiceService {
  
  /**
   * Checks if localStorage is available
   */
  isLocalStorageAvailable(): boolean {
    try {
      const testKey = '__storage_test__';
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      return typeof window !== 'undefined' && !!localStorage;
    } catch (e) {
      console.error('LocalStorage not available:', e);
      return false;
    }
  }

  /**
   * Gets an item from localStorage
   */
  getItem(key: string): string | null {
    if (this.isLocalStorageAvailable()) {
      try {
        return localStorage.getItem(key);
      } catch (error) {
        console.error(`Error retrieving ${key} from storage:`, error);
        return null;
      }
    }
    return null;
  }

  /**
   * Stores an item in localStorage
   */
  setItem(key: string, value: string): void {
    if (this.isLocalStorageAvailable()) {
      try {
        localStorage.setItem(key, value);
      } catch (error) {
        console.error(`Error saving ${key} to storage:`, error);
      }
    }
  }

  /**
   * Removes an item from localStorage
   */
  removeItem(key: string): void {
    if (this.isLocalStorageAvailable()) {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.error(`Error removing ${key} from storage:`, error);
      }
    }
  }
  
  /**
   * Sets an item with expiration time
   * @param key - Storage key
   * @param value - Value to store
   * @param ttl - Time to live in milliseconds
   */
  setWithExpiry(key: string, value: string, ttl: number): void {
    if (this.isLocalStorageAvailable()) {
      try {
        const item = {
          value: value,
          expiry: Date.now() + ttl
        };
        localStorage.setItem(key, JSON.stringify(item));
      } catch (error) {
        console.error(`Error saving ${key} to storage with expiry:`, error);
      }
    }
  }
  
  /**
   * Gets an item and checks if it has expired
   * @param key - Storage key
   * @returns The value if not expired, null otherwise
   */
  getWithExpiry(key: string): string | null {
    if (this.isLocalStorageAvailable()) {
      try {
        const itemStr = localStorage.getItem(key);
        if (!itemStr) {
          return null;
        }
        
        const item = JSON.parse(itemStr);
        
        // Check if the item has expired
        if (Date.now() > item.expiry) {
          // If expired, remove the item from storage
          localStorage.removeItem(key);
          return null;
        }
        
        return item.value;
      } catch (error) {
        console.error(`Error retrieving ${key} from storage with expiry check:`, error);
        return null;
      }
    }
    return null;
  }
}
