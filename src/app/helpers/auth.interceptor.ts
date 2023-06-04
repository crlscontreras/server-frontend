import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpClient,
  HttpHeaders,
} from '@angular/common/http';
import {
  Observable,
  catchError,
  concatMap,
  of,
  switchMap,
  throwError,
} from 'rxjs';
import { AuthService } from '../service/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private service: AuthService) {}
  refresh = false;

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (request.headers.get('skip')) {
      //Call to /auth/refresh-token should not be intercepted
      return next.handle(request);
    }

    const token = this.service.getToken();
    console.log('Intercept');

    if (token) {
      const cloned = request.clone({
        headers: request.headers.set('Authorization', `Bearer ${token}`),
      });

      return next.handle(cloned).pipe(
        catchError((err: HttpErrorResponse) => {
          if (err.status === 403 && !this.refresh) {
            const refreshToken = this.service.getRefreshToken();
            this.refresh = true;

            return this.service.refreshToken(refreshToken).pipe(
              switchMap((res: any) => {
                localStorage.clear();

                console.log('Call to /auth/refresh-token executed correctly');

                const bearerToken = res['access_token'];
                const refreshToken = res['refresh_token'];
                localStorage.setItem('token', bearerToken);
                localStorage.setItem('refreshToken', refreshToken);

                const clonedWithNewToken = request.clone({
                  headers: request.headers.set(
                    'Authorization',
                    `Bearer ${bearerToken}`
                  ),
                });

                return next.handle(clonedWithNewToken);
              })
            );
          }

          return throwError(() => err);
        })
      );
    }

    return next.handle(request);
  }
}
