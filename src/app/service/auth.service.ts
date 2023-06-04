import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpResponse,
} from '@angular/common/http';
import { catchError, concatMap, map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  //inject HttpClient
  constructor(private http: HttpClient) {}

  apiurl = 'http://localhost:8080/api/v1/';

  getDemo() {
    return this.http.get(this.apiurl + 'demo-controller', {
      responseType: 'text',
    });
  }

  RegisterUser(inputdata: any) {
    return this.http.post(this.apiurl + 'auth/register', inputdata);
  }

  login(inputdata: any) {
    return this.http
      .post(this.apiurl + 'auth/authenticate', inputdata, {
        observe: 'response',
      })
      .pipe(
        map((response: HttpResponse<any>) => {
          const body = response.body;

          const bearerToken = body['access_token'];
          const refreshToken = body['refresh_token'];
          localStorage.setItem('token', bearerToken);
          localStorage.setItem('refreshToken', refreshToken);

          return body;
        })
      );
  }

  refreshToken(inputdata: any) {
    let headers = new HttpHeaders({
      Authorization: `Bearer ${inputdata}`,
      skip: 'true',
    });

    console.log('Need to refresh Token', headers.getAll('Authorization'));
    return this.http.post(
      this.apiurl + 'auth/refresh-token',
      {},
      {
        headers: headers,
      }
    );
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getRefreshToken() {
    return localStorage.getItem('refreshToken');
  }

  GetUserbyCode(id: any) {
    return this.http.get(this.apiurl + '/' + id);
  }
  Getall() {
    return this.http.get(this.apiurl);
  }
  updateuser(id: any, inputdata: any) {
    return this.http.put(this.apiurl + '/' + id, inputdata);
  }
  getuserrole() {
    return this.http.get('http://localhost:3000/role');
  }
  isloggedin() {
    return sessionStorage.getItem('username') != null;
  }
  getrole() {
    return sessionStorage.getItem('role') != null
      ? sessionStorage.getItem('role')?.toString()
      : '';
  }
  GetAllCustomer() {
    return this.http.get('http://localhost:3000/customer');
  }
  //this.apiurl + 'auth/authenticate'
  Getaccessbyrole(role: any, menu: any) {
    return this.http.get(
      'http://localhost:3000/roleaccess?role=' + role + '&menu=' + menu
    );
  }
}
