import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { LoggedCredentialsDto } from '../models/logged-credentials.model';
import { LoginDto} from '../models/login.model';
import { RegisterDto } from '../models/register.model';
import { UserInfoDto } from '../models/user-info.model';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
  
})
export class AuthenticationService {
  private readonly baseUrl = 'http://localhost:5089/Authentication';
  private jwtHelper = new JwtHelperService();
  private logoutTimeout: any;
  constructor(private http: HttpClient, private router: Router){}

  registerUser(user: RegisterDto): Observable<boolean> {
    return this.http.post<boolean>(this.baseUrl, user).pipe(
      map(result => result),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 409) {
          return throwError(() => new Error(error.error)); 
        }
        return throwError(() => new Error('Registration failed'));
      })
    );
  }
  
  private scheduleAutoLogout(): void {
    const token = this.getToken();
    if (!token || this.jwtHelper.isTokenExpired(token)) {
      this.logout();
    return;
    }

    const expDate = this.jwtHelper.getTokenExpirationDate(token);
    if (expDate) {
      const timeLeft = expDate.getTime() - new Date().getTime();

      this.logoutTimeout = setTimeout(() => {
        this.logout();
        this.router.navigate(['/login']);
      }, timeLeft);
    }
  }

  loginUser(loginDto: LoginDto): Observable<LoggedCredentialsDto> {
    return this.http.post<LoggedCredentialsDto>(`${this.baseUrl}/LoginUser`, loginDto).pipe(
      map((response) => {
        localStorage.setItem('token', response.jwtToken);
        localStorage.setItem('email', response.email);
        this.scheduleAutoLogout(); 
        return response;
      }),
      catchError(this.handleError)
    );
  }

  goIfLoggedIn(path: string): void {
    if (this.isLogged()) {
      this.router.navigateByUrl(path);
    } else {
      this.router.navigateByUrl('/login');
    }
  }
  recoverPassword(email: string): Observable<boolean> {
    return this.http.post<boolean>(`${this.baseUrl}/RecoverPassword?email=${encodeURIComponent(email)}`, {}).pipe(
      catchError(this.handleError)
    );
  }

  resetPassword(token: string, password: string): Observable<boolean> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<boolean>(
      `${this.baseUrl}/resetpassword?token=${encodeURIComponent(token)}`,
      JSON.stringify(password),
      { headers }
    ).pipe(
      catchError(this.handleError)
    );
  }

  getUserInfo(): Observable<UserInfoDto> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<UserInfoDto>(`${this.baseUrl}/GetUserInfo`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    clearTimeout(this.logoutTimeout);
  }

  isLogged(): boolean {
    return !!localStorage.getItem('token');
  }

  getEmail(): string {
    return localStorage.getItem('email') ?? '';
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  private handleError(error: HttpErrorResponse) {
    const message = error.error?.message || 'Something went wrong';
    return throwError(() => new Error(message));
  }
  
}

