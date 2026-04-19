import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  http = inject(HttpClient)
  constructor() { }

  public PostLogin(email: String, password: String) {
    const json = {
      "email": email,
      "password": password
    };

    return this.http.post<{ cookie: string }>(`api/Auth/login`, json, {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true
    });
  }

  
  public PostRegister(email: String, password: String, firstName: String, lastName: String) {
    const json = {
      "email": email,
      "password": password,
      "firstName": firstName,
      "lastName": lastName
    };

    return this.http.post<{ cookie: string }>(`api/Auth/registration`, json, {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true
    });
  }
}
