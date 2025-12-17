import type { Observable } from "rxjs/";
import { map } from "rxjs/operators";

import { http } from "../../http.client";
import type { Page } from "../../models/page";
import { defaultPageRequest } from "../../models/page.request";
import type { Prospect } from "../../models/prospect";
import type { ProspectRequestQueryParam } from "../query-params/prospect.request.query.param";

export class ProspectService {
  readonly COMMAND_CONTEXT = `/client-command-service/v1/prospects`;
  readonly QUERY_CONTEXT = `/client-query-service/v1/prospects`;

  getProspects(
    pageRequest: ProspectRequestQueryParam = defaultPageRequest
  ): Observable<Page<Prospect>> {
    return http
      .get<Page<Prospect>>(`${this.QUERY_CONTEXT}`, { params: pageRequest })
      .pipe(map((response) => response.data));
  }
  getProspectList(
    id: any,
  ): Observable<Page<Prospect>> {
    return http
      .get<Page<Prospect>>(`${this.QUERY_CONTEXT}/${id}`)
      .pipe(map((response) => response.data));
  }
  importProspectData(
    pagerqsts: any
  ): Observable<Page<Prospect>> {
    return http
      .get<Page<Prospect>>(`${this.QUERY_CONTEXT}`, { params: pagerqsts })
      .pipe(map((response) => response.data));
  }

  saveProspect(payload: Prospect): Observable<Map<string, any>> {
    return http
      .post<Map<string, any>>(`${this.COMMAND_CONTEXT}`, payload)
      .pipe(map((response) => response.data));
  }
  // https://api.cognaisure.com/client-command-service/v1/contacts/otp/generate 
  generateOtp(payload: any): Observable<Map<string, any>> {
    return http
      .post<Map<string, any>>("/client-command-service/v1/contacts/otp/generate ", payload)
      .pipe(map((response) => response.data));
  }
  // /client-command-service/v1/contacts/otp/verify/1415701734838669312
  verifyOtp(payload: any, id: any): Observable<Map<string, any>> {
    return http
      .patch<Map<string, any>>(`/client-command-service/v1/contacts/otp/verify/${id}`, payload)
      .pipe(map((response) => response.data));
  }
  // /client-query-service/v1/contacts/otp/status/1415701734838669312/
  otpStatus(id: any): Observable<Map<string, any>> {
    return http
      .get<Map<string, any>>(`/client-query-service/v1/contacts/otp/status/${id}`)
      .pipe(map((response) => response.data));
  }

  getProspectDetails(prospectid: string): Observable<Prospect> {
    return http
      .get<Prospect>(`${this.QUERY_CONTEXT}/${prospectid}`)
      .pipe(map((response) => response.data));
  }

  editProspect(
    payload: Prospect,
    prospectid: string
  ): Observable<Map<string, any>> {
    return http
      .put<Map<string, any>>(`${this.COMMAND_CONTEXT}/${prospectid}`, payload)
      .pipe(map((response) => response.data));
  }
}
