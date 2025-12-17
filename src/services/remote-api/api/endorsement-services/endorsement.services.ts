import type { Observable } from "rxjs/";
import { map } from "rxjs/operators";

import { http } from "../../http.client";
import type { Page } from "../../models/page";

export class EndorsementService {
  readonly COMMAND_CONTEXT = `/endorsement-command-service/v1/endorsements`;
  readonly COMMAND_CONTEXT_2 = `/endorsement-command-service/v1/endorsement`;
  readonly QUERY_CONTEXT = `/endorsement-query-service/v1/endorsements`;

  getEndorsements(
    pageRequest: any
  ): Observable<Page<any>> {
    return http
      .get<Page<any>>(`${this.QUERY_CONTEXT}`, { params: pageRequest })
      .pipe(map((response) => response.data));
  }


  importEndorsementData(
    pagerqsts: any
  ): Observable<Page<any>> {
    return http
      .get<Page<any>>(`${this.QUERY_CONTEXT}`, { params: pagerqsts })
      .pipe(map((response) => response.data));
  }


  saveEndorsements(payload: any): Observable<Map<string, any>> {
    return http
      .post<Map<string, any>>(`${this.COMMAND_CONTEXT}`, payload)
      .pipe(map((response) => response.data));
  }

  getEndorsementDetail(id: string): Observable<any> {
    return http
      .get<any>(`${this.QUERY_CONTEXT}/${id}`)
      .pipe(map((response) => response.data));
  }

  getEndorsementDashCount(value: string): Observable<any> {
    return http
      .get<any>(`${this.QUERY_CONTEXT}/counts?action=${value}`)
      .pipe(map((response) => response.data));
  }

  deleteMember(
    payload: any,
    id: string,
  ): Observable<Map<string, any>> {
    return http
      .post<Map<string, any>>(`${this.COMMAND_CONTEXT}/premium/${id}?action=premium-refund-calculated`, payload)
      .pipe(map((response) => response.data));
  }

  uploadTemplateForAddition(payload: any, policyId: number, action: string): Observable<any> {
    const headers = { 'Content-Type': 'multipart/form-data' };

    const config = {
      headers: headers,

      // params: pageRequest
    }

    return http

      // .patch<any>(`${this.COMMAND_CONTEXT}/${quotationId}/members`, payload, { params: pageRequest }, { headers })
      .post<any>(`${this.COMMAND_CONTEXT_2}s/add/member?policyId=${policyId}&action=${action}`, payload, config)
      .pipe(map((response) => response.data));
  }

  uploadTemplate(payload: any): Observable<any> {
    const headers = { 'Content-Type': 'multipart/form-data' };

    const config = {
      headers: headers,

      // params: pageRequest
    }

    return http

      // .patch<any>(`${this.COMMAND_CONTEXT}/${quotationId}/members`, payload, { params: pageRequest }, { headers })
      .post<any>(`${this.COMMAND_CONTEXT}`, payload)
      .pipe(map((response) => response.data));
  }

  editEndorsement(
    payload: any,
    id: string,
  ): Observable<Map<string, any>> {
    return http
      .patch<Map<string, any>>(`${this.COMMAND_CONTEXT}/${id}`, payload)
      .pipe(map((response) => response.data));
  }


  calculatePremium(
    payload: any,
    id: string,
    action: string,
  ): Observable<Map<string, any>> {
    return http
      .patch<Map<string, any>>(`${this.COMMAND_CONTEXT}/${id}?action=calculate`, payload)
      .pipe(map((response) => response.data));
  }
  approveEndorsement(
    id: string,
  ): Observable<Map<string, any>> {
    return http
      .patch<Map<string, any>>(`${this.COMMAND_CONTEXT}/${id}?action=approve`)
      .pipe(map((response) => response.data));
  }
}
