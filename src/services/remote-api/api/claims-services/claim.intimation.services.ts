import type { Observable } from "rxjs/";
import { map } from "rxjs/operators";

import { http } from "../../http.client";
import type { Page } from "../../models/page";

export class ClaimsIntimationService {
  readonly COMMAND_CONTEXT = `/claim-command-service/v1/claimintimations`;
  readonly QUERY_CONTEXT = `/claim-query-service/v1/claimintimations`;

  getClaimsIntimation(
    pageRequest: any
  ): Observable<Page<any>> {
    return http
      .get<Page<any>>(`${this.QUERY_CONTEXT}`, { params: pageRequest })
      .pipe(map((response) => response.data));
  }


  importIntimationData(
    pagerqsts: any
  ): Observable<Page<any>> {
    return http
      .get<Page<any>>(`${this.QUERY_CONTEXT}`, { params: pagerqsts })
      .pipe(map((response) => response.data));
  }


  saveIntimation(payload: any): Observable<Map<string, any>> {
    return http
      .post<Map<string, any>>(`${this.COMMAND_CONTEXT}`, payload)
      .pipe(map((response) => response.data));
  }

  getIntimationDetails(id: string): Observable<any> {
    return http
      .get<any>(`${this.QUERY_CONTEXT}/${id}`)
      .pipe(map((response) => response.data));
  }
  addDoc(id:string,payload:FormData): Observable<Map<string, any>>{
    const headers = { 'Content-Type': 'multipart/form-data' };
    
return http
    .put<Map<string, any>>(`${this.COMMAND_CONTEXT}/${id}/docs`, payload, { headers })
    .pipe(map((response) => response.data));
  }

  editIntimation(
    payload: any,
    id: string,
  ): Observable<Map<string, any>> {
    return http
      .patch<Map<string, any>>(`${this.COMMAND_CONTEXT}/${id}`, payload)
      .pipe(map((response) => response.data));
  }
}
