import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { RegisterDto } from '../models/register.model';

export interface UserCredentials {
  id: string;
  username: string;
  email: string;
  country: string;
  subscribers: number;
}

@Injectable({
  providedIn: 'root'
})
  
export class UserServiceService {
  private readonly baseUrl = 'http://localhost:5089/Authentication/RegisterUser';

  constructor(private http: HttpClient) {}

  registerUser(user: RegisterDto): Observable<boolean> {
    return this.http.post<boolean>(this.baseUrl, user).pipe(
      map((result: boolean) => result),
      catchError((error: HttpErrorResponse) => {
        console.error('Registration failed:', error);
        return throwError(() => new Error(error.error?.message || 'Registration failed'));
      })
    );
  } 
  getAllUsers(): Observable<{ username: string, email: string }[]> {
    return this.http.get<{ username: string, email: string }[]>('http://localhost:5089/Authentication/GetAllUsers');
  }
  getPublicUsers(country?: string): Observable<UserCredentials[]> {
    let url ='http://localhost:5089/Authentication/GetPublicUsers';
    if (country) url += `?country=${encodeURIComponent(country)}`;
    return this.http.get<UserCredentials[]>(url);
  }
  getSubscribedUsers(): Observable<UserCredentials[]> {
    return this.http.get<UserCredentials[]>('http://localhost:5089/Subscription/GetSubscribedUsers');
  }
  getUserRecipes(userId: string): Observable<any[]> {
    const token = localStorage.getItem('token');
    return this.http.get<any[]>(`http://localhost:5089/Recipes/GetByUserId/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
  getUserById(userId: string): Observable<UserCredentials> {
    return this.http.get<UserCredentials>(`http://localhost:5089/Authentication/GetUserById/${userId}`);
  }
  getSubscribersCount(userId: string): Observable<number> {
    return this.http.get<number>(`http://localhost:5089/Subscription/GetSubscriberCount/${userId}`);
  }
  getUserByEmail(email: string): Observable<UserCredentials> {
    return this.http.get<UserCredentials>(`http://localhost:5089/Authentication/GetUserByEmail/${email}`);
  }
  
  
}