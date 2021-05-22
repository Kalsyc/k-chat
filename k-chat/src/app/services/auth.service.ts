import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../environments/environment';
import { UserData } from '../models/user';
import { API } from '../models/api';
import { Observable } from 'rxjs';
import { UserLoginData, UserRegisterData } from '../models/auth';
import { LoginUserResponse } from '../models/backend-responses/login-user';
import { RegisterUserResponse } from '../models/backend-responses/register-user';

interface OptionObject {
  headers: HttpHeaders;
  authorization?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private url: string = environment.apiUrl;
  private options: OptionObject = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };
  private isLoggedIn: boolean = true;
  private authOptions: OptionObject = <OptionObject>{};
  private authOptionsWithoutContentType: OptionObject = <OptionObject>{};
  private userData: UserData = <UserData>{};

  constructor(private httpClient: HttpClient, private cookieService: CookieService) {}

  /**
   * Get isLoggedIn value
   * @returns Whether the user is logged in
   */
  getIsLoggedIn(): boolean {
    return this.isLoggedIn;
  }

  /**
   * Register User
   * @param data User Details
   * @event POST
   */
  registerUser(data: UserRegisterData): Observable<RegisterUserResponse> {
    return this.httpClient.post<RegisterUserResponse>(this.url + 'api/auth/register', data, this.options);
  }

  /**
   * Login User
   * @param data User Details
   * @event POST
   */
  loginUser(data: UserLoginData): Observable<LoginUserResponse> {
    return this.httpClient.post<LoginUserResponse>(this.url + 'api/auth/login', data, this.options);
  }

  /**
   * Set isLoggedIn value
   */
  setLogIn(bool: boolean): void {
    this.isLoggedIn = bool;
  }

  /**
   * Private method which sets token
   */
  private setTokenInAuthOptions(token: string): void {
    this.authOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + token,
      }),
    };
    this.authOptionsWithoutContentType = {
      headers: new HttpHeaders({
        authorization: 'Bearer ' + token,
      }),
    };
  }

  /**
   * Logout the current user
   */
  logoutUser(): void {
    this.cookieService.delete('token', '/');
    this.isLoggedIn = false;
    this.userData = <UserData>{};
    this.authOptions = <OptionObject>{};
  }

  /**
   * Get user details
   */
  getUserDataByToken(): Observable<API> {
    const token = this.cookieService.get('token');
    this.setTokenInAuthOptions(token);
    return this.httpClient.get<API>(this.url + 'api/auth/me', this.authOptions);
  }

  /**
   * Get auth options for http headers
   */
  getAuthOptions(): OptionObject {
    return this.authOptions;
  }

  /**
   * Get auth options without content type for http headers
   */
  getAuthOptionsWithoutContentType(): OptionObject {
    return this.authOptionsWithoutContentType;
  }

  /**
   * Check cookie and set headers if it exists
   */
  checkCookieAndSetHeaders(): void {
    const token = this.cookieService.get('token');
    if (token && token !== '') {
      this.setTokenInAuthOptions(token);
    }
  }

  /**
   * Check cookie if it exists
   */
  checkCookie(): boolean {
    const token = this.cookieService.get('token');
    return token !== '';
  }
}
