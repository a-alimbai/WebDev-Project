import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {environment} from '@environments/environment';
import {User} from '@app/models';

@Injectable({providedIn: 'root'})
export class UserService {
  constructor(private http: HttpClient) {
  }

  getAll() {
    return this.http.get<User[]>(`${environment.apiUrl}/users`);
  }

  createUser(username, password, firstName, lastName) {
    return this.http.post<User[]>(`${environment.apiUrl}/users/add`, {username, password, firstName, lastName});
  }
  editUser(id, username, password, firstName, lastName) {
    return this.http.post<User[]>(`${environment.apiUrl}/users/edit`, {id, username, password, firstName, lastName});
  }
  deleteUser(id) {
    return this.http.post<User[]>(`${environment.apiUrl}/users/delete`, {id});
  }
}
