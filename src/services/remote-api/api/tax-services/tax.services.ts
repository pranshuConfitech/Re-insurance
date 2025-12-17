import type { Observable } from "rxjs/";
import { map } from "rxjs/operators";

import { http } from "../../http.client";
import type { Page } from "../../models/page";
import type { Tax } from "../../models/tax";
import { defaultPageRequest7 } from "../query-params/client.request.query.param";


export class TaxService {
  readonly COMMAND_CONTEXT = `/tax-command-service/v1/taxes`;
  readonly QUERY_CONTEXT = `/tax-query-service/v1/taxes`;

  getTaxes(
    pageRequest: any
  ): Observable<Page<Tax>> {
    return http
      .get<Page<Tax>>(`${this.QUERY_CONTEXT}`, { params: pageRequest })
      .pipe(map((response) => response.data));
  }  
  getParentTaxes(
    pageRequest: any = defaultPageRequest7
  ): Observable<Page<Tax>> {
    return http
      .get<Page<Tax>>(`${this.QUERY_CONTEXT}`, { params: pageRequest })
      .pipe(map((response) => response.data));
  }
  saveTax(payload: Tax): Observable<Map<string, any>> {
    return http
      .post<Map<string, any>>(`${this.COMMAND_CONTEXT}`, payload)
      .pipe(map((response) => response.data));
  }

  getTaxDetails(taxid: string): Observable<Tax> {
    return http
      .get<Tax>(`${this.QUERY_CONTEXT}/${taxid}`)
      .pipe(map((response) => response.data));
  }

  editTax(
    payload: Tax,
    taxid: string,
  ): Observable<Map<string, any>> {
    return http
      .patch<Map<string, any>>(`${this.COMMAND_CONTEXT}/${taxid}`, payload)
      .pipe(map((response) => response.data));
  }
}
