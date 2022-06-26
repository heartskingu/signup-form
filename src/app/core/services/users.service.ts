import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IdObject } from './interfaces/id-object.interface';
import { User } from './interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private url = 'https://demo-api.vercel.app/users';

  constructor(private httpClient: HttpClient) {}
  
  createUser(user: User): Observable<IdObject> {
    return this.httpClient.post<IdObject>(this.url, JSON.stringify(user));
  }
}
