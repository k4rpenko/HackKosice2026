import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  http = inject(HttpClient)
  constructor() { }

  PostLogin(email: String, password: String) {
    const json = {
      "email": email,
      "password": password
    };

    return this.http.post<{ cookie: string }>(`api/Auth/login`, json, {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true
    });
  }

  
  PostRegister(email: String, password: String) {
    const json = {
      "email": email,
      "password": password
    };

    return this.http.post<{ cookie: string }>(`api/Auth/registration`, json, {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true
    });
  }
}
