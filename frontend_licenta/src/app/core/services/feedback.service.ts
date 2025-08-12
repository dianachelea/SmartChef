import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { FeedbackDto } from '../models/feedback.model';
import { FeedbackFiltersDto } from '../../core/models/feedback.model';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  private readonly baseUrl = 'http://localhost:5089/Feedback';

  constructor(private http: HttpClient) {}

  submitFeedback(feedback: FeedbackDto): Observable<boolean> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<boolean>(`${this.baseUrl}/AddFeedback`, feedback, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    const message = error.error?.message || 'Feedback submission failed';
    return throwError(() => new Error(message));
  }

  getFeedback(filters: FeedbackFiltersDto = {}): Observable<FeedbackDto[]> {
    let params = new HttpParams();

    if (filters.byName) {
      filters.byName.forEach((name) => {
        params = params.append('byName', name);
      });
    }

    if (filters.byEmail) {
      filters.byEmail.forEach((email) => {
        params = params.append('byEmail', email);
      });
    }

    if (filters.byTitle) {
      filters.byTitle.forEach((title) => {
        params = params.append('byTitle', title);
      });
    }

    if (filters.byCategories) {
      filters.byCategories.forEach((category) => {
        params = params.append('byCategories', category.toString());
      });
    }

    if (filters.startDate) {
      params = params.append('startDate', filters.startDate.toISOString());
    }

    if (filters.endDate) {
      params = params.append('endDate', filters.endDate.toISOString());
    }

    if (filters.stars) {
      filters.stars.forEach((star) => {
        params = params.append('stars', star.toString());
      });
    }

    if (filters.isAnonymus !== null && filters.isAnonymus !== undefined) {
      params = params.append('isAnonymus', filters.isAnonymus.toString());
    }

    return this.http.get<FeedbackDto[]>(`${this.baseUrl}/GetFeedback`, { params });
  }
}
