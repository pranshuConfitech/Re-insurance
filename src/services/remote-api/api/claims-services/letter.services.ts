import type { Observable } from "rxjs/";
import { map } from "rxjs/operators";

import { http } from "../../http.client";

export class LetterService {
  readonly COMMAND_CONTEXT = `/master-data-service/v1/letters`;
  readonly QUERY_CONTEXT = `/master-data-service/v1/letters`;

  saveLetter(payload: any): Observable<Map<string, any>> {
    return http
      .post<Map<string, any>>(`${this.COMMAND_CONTEXT}`, payload)
      .pipe(map((response) => response.data));
  }

  getLetters(
    pageRequest: any
  ): Observable<any> {
    return http
      .get<any>(`${this.QUERY_CONTEXT}`, { params: pageRequest })
      .pipe(map((response) => response.data));
  }

  getLetterDetails(id: string): Observable<any> {
    return http
      .get<any>(`${this.QUERY_CONTEXT}/${id}`)
      .pipe(map((response) => response.data));
  }

  editLetter(
    payload: any,
    id: string
  ): Observable<Map<string, any>> {
    return http
      .put<Map<string, any>>(`${this.COMMAND_CONTEXT}/${id}`, payload)
      .pipe(map((response) => response.data));
  }
}
