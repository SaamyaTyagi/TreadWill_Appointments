import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StorageServiceService } from '../storage/storage-service.service';

@Injectable({
  providedIn: 'root'
})
export class UserDetailsService {
  private readonly USERS_KEY = 'cached_users';
  private readonly USERS_TIMESTAMP_KEY = 'user_data_timestamp';
  private readonly DATA_EXPIRY_TIME = 10 * 60 * 1000; // 2 minutes in milliseconds
  
  private usersSubject = new BehaviorSubject<any[]>([]);
  users$ = this.usersSubject.asObservable();

  constructor(private storageService: StorageServiceService) {
    this.loadUsersFromStorage();
    
    // Set initial timestamp if none exists
    if (!this.storageService.getItem(this.USERS_TIMESTAMP_KEY)) {
      this.updateTimestamp();
    }
  }

  /**
   * Updates the timestamp to track when data was last modified
   */
  private updateTimestamp(): void {
    this.storageService.setItem(this.USERS_TIMESTAMP_KEY, Date.now().toString());
  }

  /**
   * Loads users from storage if not expired
   */
  private loadUsersFromStorage(): void {
    try {
      const timestampStr = this.storageService.getItem(this.USERS_TIMESTAMP_KEY);
      const currentTime = Date.now();
      
      // Check if data has expired (older than 2 minutes)
      if (timestampStr && (currentTime - parseInt(timestampStr, 10) > this.DATA_EXPIRY_TIME)) {
        console.log('User data has expired. Clearing storage.');
        this.clearUsers();
        return;
      }
      
      const storedUsers = this.storageService.getItem(this.USERS_KEY);
      if (storedUsers) {
        const parsedUsers = JSON.parse(storedUsers);
        if (Array.isArray(parsedUsers)) {
          this.usersSubject.next(parsedUsers);
          console.log('Loaded users from storage:', parsedUsers.length);
        } else {
          console.warn('Stored users is not an array');
          this.usersSubject.next([]);
        }
      } else {
        console.log('No users found in storage');
        this.usersSubject.next([]);
      }
    } catch (error) {
      console.error('Error loading users from storage:', error);
      this.usersSubject.next([]);
    }
  }

  /**
   * Adds a user and updates the timestamp
   */
  addUser(user: any) {
    const currentUsers = this.usersSubject.value;
    const updatedUsers = [...currentUsers, user];
    this.usersSubject.next(updatedUsers);
    this.saveUsersToStorage(updatedUsers);
    this.updateTimestamp(); // Update the timestamp when data changes
  }

  /**
   * Saves users to storage
   */
  private saveUsersToStorage(users: any[]): void {
    try {
      this.storageService.setItem(this.USERS_KEY, JSON.stringify(users));
      console.log('Saved users to storage, count:', users.length);
    } catch (error) {
      console.error('Error saving users to storage:', error);
    }
  }

  /**
   * Returns the current users
   */
  getUsers() {
    return this.usersSubject.value;
  }

  /**
   * Clears all stored users
   */
  clearUsers(): void {
    this.usersSubject.next([]);
    this.storageService.removeItem(this.USERS_KEY);
    this.storageService.removeItem(this.USERS_TIMESTAMP_KEY);
    console.log('Cleared all users from storage');
  }
  
  /**
   * Refreshes the data expiration timestamp
   * Call this when you want to extend the data lifetime
   */
  refreshExpiration(): void {
    this.updateTimestamp();
    console.log('User data expiration refreshed for another 2 minutes');
  }
  
  /**
   * Checks if the data has expired
   * @returns true if expired, false otherwise
   */
  isDataExpired(): boolean {
    const timestampStr = this.storageService.getItem(this.USERS_TIMESTAMP_KEY);
    if (!timestampStr) return true;
    
    const timestamp = parseInt(timestampStr, 10);
    return (Date.now() - timestamp) > this.DATA_EXPIRY_TIME;
  }

}
