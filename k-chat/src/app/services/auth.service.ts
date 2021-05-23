import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { OptionObject } from '../models/system/headers';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { UserLoginData, UserRegisterData } from '../models/data/auth';
import { GetResponse } from '../models/data/api';
import { LoginUserResponse, LogoutUserResponse, RegisterUserResponse } from '../models/backend-responses/auth';

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
  private isLoggedIn: boolean = false;

  constructor(private httpClient: HttpClient, private cookieService: CookieService) {}

  loginUser(data: UserLoginData): Observable<LoginUserResponse> {
    return this.httpClient.post<LoginUserResponse>(this.url + 'api/auth/login', data, this.options).pipe((res: Observable<LoginUserResponse>) => {
      this.cookieService.set('token', res['token']);
      this.isLoggedIn = true;
      return res;
    });
  }

  registerUser(data: UserRegisterData): Observable<RegisterUserResponse> {
    return this.httpClient
      .post<RegisterUserResponse>(this.url + 'api/auth/register', data, this.options)
      .pipe((res: Observable<RegisterUserResponse>) => {
        this.cookieService.set('token', res['token']);
        this.isLoggedIn = true;
        return res;
      });
  }

  getIsLoggedIn(): boolean {
    return this.isLoggedIn;
  }

  logoutUser(): Observable<LogoutUserResponse> {
    return this.httpClient.get<GetResponse>(this.url + 'api/auth/logout').pipe((res: Observable<LogoutUserResponse>) => {
      this.cookieService.delete('token', '/');
      this.isLoggedIn = false;
      return res;
    });
  }
}

/*

   getIsLoggedIn(): boolean {
    return this.isLoggedIn;
  }


  registerUser(data: UserRegisterData): Observable<RegisterUserResponse> {
    return this.httpClient.post<RegisterUserResponse>(this.url + 'api/auth/register', data, this.options);
  }


  loginUser(data: UserLoginData): Observable<LoginUserResponse> {
    return this.httpClient.post<LoginUserResponse>(this.url + 'api/auth/login', data, this.options);
  }


  setLogIn(bool: boolean): void {
    this.isLoggedIn = bool;
  }


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

 
  logoutUser(): void {
    this.cookieService.delete('token', '/');
    this.isLoggedIn = false;
    this.userData = <UserData>{};
    this.authOptions = <OptionObject>{};
  }

  getUserDataByToken(): Observable<API> {
    const token = this.cookieService.get('token');
    this.setTokenInAuthOptions(token);
    return this.httpClient.get<API>(this.url + 'api/auth/me', this.authOptions);
  }

  getAuthOptions(): OptionObject {
    return this.authOptions;
  }

  getAuthOptionsWithoutContentType(): OptionObject {
    return this.authOptionsWithoutContentType;
  }

  checkCookieAndSetHeaders(): void {
    const token = this.cookieService.get('token');
    if (token && token !== '') {
      this.setTokenInAuthOptions(token);
    }
  }

  checkCookie(): boolean {
    const token = this.cookieService.get('token');
    return token !== '';
  }
*/
