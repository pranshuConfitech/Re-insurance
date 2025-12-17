import type { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { http } from '../http.client'

export class BaseService {
  protected get(url: string, config?: any): Observable<any> {
    return http.get(url, config).pipe(map(response => response.data))
  }

  protected post(url: string, data?: any, config?: any): Observable<any> {
    return http.post(url, data, config).pipe(map(response => response.data))
  }

  protected put(url: string, data?: any, config?: any): Observable<any> {
    return http.put(url, data, config).pipe(map(response => response.data))
  }

  protected patch(url: string, data?: any, config?: any): Observable<any> {
    return http.patch(url, data, config).pipe(map(response => response.data))
  }

  protected delete(url: string, config?: any): Observable<any> {
    return http.delete(url, config).pipe(map(response => response.data))
  }
} 