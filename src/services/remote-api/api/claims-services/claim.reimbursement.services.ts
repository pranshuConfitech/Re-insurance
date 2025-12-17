import type { Observable } from "rxjs/";
import { map } from "rxjs/operators";

import { http } from "../../http.client";
import type { Page } from "../../models/page";
import type { Reimbursement } from "../../models/reimbursement";

export class ReimbursementService {
  readonly COMMAND_CONTEXT = `/claim-command-service/v1/reimburse`;
  readonly QUERY_CONTEXT = `/claim-query-service/v1/reimbursements`;

  // /claim-query-service/v1/reimbursements/reinsurance
  getReimbursementsFromTreaty(
    pageRequest: any
  ): Observable<Page<Reimbursement>> {
    return http
      .get<Page<any>>(`${this.QUERY_CONTEXT}/reinsurance`, { params: pageRequest })
      .pipe(map((response) => response.data));
  }
  getAllReimbursements(
    pageRequest: any
  ): Observable<Page<Reimbursement>> {
    return http
      .get<Page<any>>(`${this.QUERY_CONTEXT}`, { params: pageRequest })
      .pipe(map((response) => response.data));
  }

  getReimbursementList(
    pageRequest: any
  ): Observable<Page<any>> {
    return http
      .get<Page<any>>(`${this.QUERY_CONTEXT}`, { params: pageRequest })
      .pipe(map((response) => response.data));
  }

  getReimbursementHistory(
    pageRequest: any
  ): Observable<Page<any>> {
    return http
      .get<Page<any>>(`${this.QUERY_CONTEXT}/history`, { params: pageRequest })
      .pipe(map((response) => response.data));
  }

  changeStatus(id: any, claimType: any, payload: any): Observable<Map<string, any>> {
    return http
      .patch<Map<string, any>>(`${this.COMMAND_CONTEXT}/${id}/claimworkflow`, payload, { params: { claimType: claimType } })
      .pipe(map((response) => response.data));
  }

  changeStat(id: any, status: any) {
    return http
      .patch<Map<string, any>>(`${this.COMMAND_CONTEXT}/${id}`, { params: { action: status } })
      .pipe(map((response) => response.data));
  }

  importReimbursementData(
    pagerqsts: any
  ): Observable<Page<any>> {
    return http
      .get<Page<any>>(`${this.QUERY_CONTEXT}`, { params: pagerqsts })
      .pipe(map((response) => response.data));
  }


  saveReimbursement(payload: Reimbursement): Observable<Map<string, any>> {
    return http
      .post<Map<string, any>>(`${this.COMMAND_CONTEXT}`, payload)
      .pipe(map((response) => response.data));
  }


  getReimbursementById(id: string): Observable<Reimbursement> {
    return http
      .get<Reimbursement>(`${this.QUERY_CONTEXT}/${id}`)
      .pipe(map((response) => response.data));
  }



  editReimbursement(
    payload: any,
    id: string,
    action: string
  ): Observable<Map<string, any>> {
    return http
      .patch<Map<string, any>>(`${this.COMMAND_CONTEXT}/${id}`, payload, { params: { action: action } })
      .pipe(map((response) => response.data));
  }

  editDoctorsOpinion(id: string, payload: any): Observable<Map<string, any>> {
    return http
      .put<Map<string, any>>(`${this.COMMAND_CONTEXT}/${id}/opinion-diagnosis`, payload)
      .pipe(map((response) => response.data));
  }

  addDoc(id: string, payload: FormData): Observable<Map<string, any>> {
    const headers = { 'Content-Type': 'multipart/form-data' };

    return http
      .put<Map<string, any>>(`${this.COMMAND_CONTEXT}/${id}/docs`, payload, { headers })
      .pipe(map((response) => response.data));
  }


  downloadDoc(id: string, fileName: string): Observable<any> {
    return http
      .get<any>(`${this.QUERY_CONTEXT}/${id}/docs/${fileName}`, { responseType: 'blob' })
      .pipe(map((response) => response));
  }

  auditDecision(claimId: string, payload: any): Observable<Map<string, any>> {
    return http
      .patch<Map<string, any>>(`${this.COMMAND_CONTEXT}/${claimId}/audits`, payload)
      .pipe(map((response) => response.data));
  }

  getReadyToProcessReimbursements(
    pageRequest: any
  ): Observable<Page<Reimbursement>> {
    return http
      .get<Page<any>>(`${this.QUERY_CONTEXT}/claims-ready-to-process`, { params: pageRequest })
      .pipe(map((response) => response.data));
  }

  getAllAuditReimbursements(
    pageRequest: any
  ): Observable<Page<Reimbursement>> {
    return http
      .get<Page<any>>(`${this.QUERY_CONTEXT}/audits`, { params: pageRequest })
      .pipe(map((response) => response.data));
  }
}

