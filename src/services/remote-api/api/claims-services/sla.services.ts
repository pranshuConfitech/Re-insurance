import type { Observable } from "rxjs/";
import { map } from "rxjs/operators";

import { http } from "../../http.client";
import type { Page } from "../../models/page";

export class SLAService {
  readonly COMMAND_CONTEXT = `/claim-command-service/v1/slaconfiguration`;
  readonly QUERY_CONTEXT = `/claim-query-service/v1/slaconfiguration`;
  
  getAllSLAs(
    pageRequest: any
  ): Observable<any> {
  // ): Observable<Page<PreAuth>> {
    return http
      .get<Page<any>>(`${this.QUERY_CONTEXT}`, { params: pageRequest })
      .pipe(map((response) => response.data));
  }

  saveSlaCongiguration(payload: any): Observable<Map<string, any>> {
    return http
      .post<Map<string, any>>(`${this.COMMAND_CONTEXT}`, payload)
      .pipe(map((response) => response.data));
  }

  getSLAById(id: string): Observable<any> {
    return http
      .get<any>(`${this.QUERY_CONTEXT}/${id}`)
      .pipe(map((response) => response.data));
  }
  
  saveSLAById(payload:any, id: string): Observable<any> {
    return http
      .patch<any>(`${this.COMMAND_CONTEXT}/${id}`, payload)
      .pipe(map((response) => response.data));
  }

}
