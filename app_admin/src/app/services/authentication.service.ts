import { Inject, Injectable } from '@angular/core';
import { BROWSER_STORAGE } from '../storage';
import { User } from '../models/user';
import { AuthResponse } from '../models/auth-response';
import { TripDataService } from '../services/trip-data.service';
import { Observable } from 'rxjs';
import { tap, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  constructor(
    @Inject(BROWSER_STORAGE) private storage: Storage,
    private tripDataService: TripDataService
  ) { }

 // Variable to handle Authentication Responses
authResp: AuthResponse = new AuthResponse();
 

  public getToken(): string {
    return this.storage.getItem('travlr-token') || '';
  }

  public saveToken(token: string): void {
    this.storage.setItem('travlr-token', token);
  }

  public login(user: User, password: string): Observable<AuthResponse> {
    return this.tripDataService.login(user, password).pipe(
      tap((authResp: AuthResponse) => {
        if (authResp) {
          this.saveToken(authResp.token);
        }
      }),
      catchError((error) => {
        console.log('Error: ' + error);
        return throwError(error);
      })
    );
  }

  public register(user: User, password: string): Observable<AuthResponse> {
    return this.tripDataService.register(user, password).pipe(
      tap((authResp: AuthResponse) => {
        if (authResp) {
          this.saveToken(authResp.token);
        }
      }),
      catchError((error) => {
        console.log('Error: ' + error);
        return throwError(error);
      })
    );
  }

  public logout(): void {
    this.storage.removeItem('travlr-token');
  }

  public isLoggedIn(): boolean {
    const token: string = this.getToken();
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp > (Date.now() / 1000);
    } else {
      return false;
    }
  }

  public getCurrentUser(): User {
    if (this.isLoggedIn()) {
      const token: string = this.getToken();
      const { email, name } = JSON.parse(atob(token.split('.')[1]));
      return { email, name } as User;
    }
    return {} as User;
  }
}
