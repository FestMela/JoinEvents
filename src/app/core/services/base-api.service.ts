import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BaseApiService {
  protected http = inject(HttpClient);
  protected baseUrl = environment.apiUrl;

  protected get<T>(url: string, params?: any, suppressErrors = true): Observable<T> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }

    const headers = this.getHeaders(suppressErrors);
    return this.http.get<T>(`${this.baseUrl}${url}`, { params: httpParams, headers });
  }

  protected post<T>(url: string, body: any, suppressErrors = true): Observable<T> {
    const headers = this.getHeaders(suppressErrors);
    return this.http.post<T>(`${this.baseUrl}${url}`, body, { headers });
  }

  protected put<T>(url: string, body: any, suppressErrors = true): Observable<T> {
    const headers = this.getHeaders(suppressErrors);
    return this.http.put<T>(`${this.baseUrl}${url}`, body, { headers });
  }

  protected patch<T>(url: string, body: any, suppressErrors = true): Observable<T> {
    const headers = this.getHeaders(suppressErrors);
    return this.http.patch<T>(`${this.baseUrl}${url}`, body, { headers });
  }

  protected delete<T>(url: string, suppressErrors = true): Observable<T> {
    const headers = this.getHeaders(suppressErrors);
    return this.http.delete<T>(`${this.baseUrl}${url}`, { headers });
  }

  private getHeaders(suppressErrors: boolean): HttpHeaders {
    let headers = new HttpHeaders();
    if (suppressErrors) {
      headers = headers.set('X-Suppress-Errors', 'true');
    }
    return headers;
  }
}
