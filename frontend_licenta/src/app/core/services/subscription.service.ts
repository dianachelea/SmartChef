import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  private baseUrl = 'http://localhost:5089/Subscription';

  constructor(private http: HttpClient) {}

  toggleSubscribe(userId: string): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}/ToggleSubscribe/${userId}`, null);
  }
  getSubscriberCount(userId: string): Observable<number> {
    return this.http.get<number>(`http://localhost:5089/Subscription/GetSubscriberCount/${userId}`);
  }
}