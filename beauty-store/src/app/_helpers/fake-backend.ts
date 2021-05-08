import {Injectable} from '@angular/core';
import {HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS} from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import {delay, mergeMap, materialize, dematerialize} from 'rxjs/operators';

import {User} from '@app/_models';

let users: User[] = [{id: 1, username: 'test', password: 'test', firstName: 'Ivan', lastName: 'Ivanov'}];
let lastId = 1;

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const {url, method, headers, body} = request;

    return of(null)
      .pipe(mergeMap(handleRoute))
      .pipe(materialize())
      .pipe(delay(500))
      .pipe(dematerialize());

    function handleRoute() {
      switch (true) {
        case url.endsWith('/users/authenticate') && method === 'POST':
          return authenticate();
        case url.endsWith('/users') && method === 'GET':
          return getUsers();
        case url.endsWith('/users/add') && method === 'POST':
          return createUser();
        case url.endsWith('/users/edit') && method === 'POST':
          return editUser();
        case url.endsWith('/users/delete') && method === 'POST':
          return deleteUser();
        default:
          return next.handle(request);
      }
    }


    function authenticate() {
      const {username, password} = body;
      const user = users.find(x => x.username === username && x.password === password);
      if (!user) {
        return error('Username or password is incorrect');
      }
      return ok({
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        token: 'fake-jwt-token'
      });
    }

    function getUsers() {
      if (!isLoggedIn()) {
        return unauthorized();
      }
      return ok(users);
    }

    function createUser() {
      if (!isLoggedIn()) {
        return unauthorized();
      }
      const {username, password, firstName, lastName} = body;
      const user = users.find(x => x.username === username);
      if (user) {
        return error('Already exists!');
      }
      lastId += 1;
      users.push({id: lastId, username: username, password: password, firstName: firstName, lastName: lastName});
      return ok(users);
    }

    function editUser() {
      if (!isLoggedIn()) {
        return unauthorized();
      }
      const {id, username, password, firstName, lastName} = body;
      const user = users.indexOf(users.filter(x => x.id === id)[0]);
      if (user === -1) {
        return error('No user!');
      }
      users[user] = {id: id, username: username, password: password, firstName: firstName, lastName: lastName};
      return ok(users);
    }

    function deleteUser() {
      if (!isLoggedIn()) {
        return unauthorized();
      }
      const {id} = body;
      users = users.filter(x => {
        return x.id !== id;
      });
      return ok(users);
    }


    function ok(body?) {
      return of(new HttpResponse({status: 200, body}));
    }

    function error(message) {
      return throwError({error: {message}});
    }

    function unauthorized() {
      return throwError({status: 401, error: {message: 'Unauthorised'}});
    }

    function isLoggedIn() {
      return headers.get('Authorization') === 'Bearer fake-jwt-token';
    }

  }
}

export let fakeBackendProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: FakeBackendInterceptor,
  multi: true
};
