import type { Observable } from "rxjs/";
import { map } from "rxjs/operators";

import { http } from "../../http.client";
import type { Page } from "../../models/page";
import type { PreAuth } from "../../models/preauth";

export class PreAuthService {
  readonly COMMAND_CONTEXT = `/claim-command-service/v1/preauths`;
  readonly QUERY_CONTEXT = `/claim-query-service/v1/preauths`;
  readonly EXGRATIA_QUERY_CONTEXT = `/claim-query-service/v1/reimbursements/exgratia`;
  readonly INDEMNITY_QUERY_CONTEXT = `/claim-query-service/v1/reimbursements/indemnity`;
  readonly EXGRATIA_COMMAND_CONTEXT = `/claim-command-service/v1/reimburse`;
  readonly INDEMNITY_COMMAND_CONTEXT = `/claim-command-service/v1/reimburse`;
  readonly MATRIX_QUERY_CONTEXT = `/claim-query-service/v1`;

  // readonly REJECT_CONTEXT = `/claim-query-service/v1/reimbursements`;
  readonly REJECT_CONTEXT = `/claim-query-service/v1/reimbursements/reimbursmentRejectedList`;

  getPreAuthsByMembership(membershipNo: any): Observable<Page<PreAuth>> {
    return http
      .get<Page<any>>(`${this.QUERY_CONTEXT}/filter?memberShipNo=${membershipNo}&preAuthStatus=WAITING_FOR_CLAIM`,)
      .pipe(map((response) => response.data));
  }
  // /claim-query-service/v1/claim-matrix?role=claim_assessor&claimType=IP&claimAmount=150001
  checkIfCanBeCreated(role: any, type: any, amount: number): Observable<any> {
    return http
      .get<any>(`${this.MATRIX_QUERY_CONTEXT}/claim-matrix?role=${role}&claimType=${type}&claimAmount=${amount}`,)
      .pipe(map((response) => response.data));
  }

  getAllPreAuths(
    pageRequest: any
  ): Observable<any> {
    // ): Observable<Page<PreAuth>> {
    return http
      .get<Page<any>>(`${this.QUERY_CONTEXT}`, { params: pageRequest })
      .pipe(map((response) => response));
  }

  getClaimHistory(
    pageRequest: any
  ): Observable<any> {
    // ): Observable<Page<PreAuth>> {
    return http
      .get<Page<any>>(`${this.QUERY_CONTEXT}/history`, { params: pageRequest })
      .pipe(map((response) => response));
  }
  getRejectedReimburshment(
    pageRequest: any
  ): Observable<any> {
    // ): Observable<Page<PreAuth>> {
    return http
      .get<Page<any>>(`${this.EXGRATIA_QUERY_CONTEXT}`, { params: pageRequest })
      .pipe(map((response) => response));
  }
  getRequestedIndemnnity(
    pageRequest: any
  ): Observable<any> {
    // ): Observable<Page<PreAuth>> {
    return http
      .get<Page<any>>(`${this.EXGRATIA_QUERY_CONTEXT}`, { params: pageRequest })
      .pipe(map((response) => response));
  }
  // ?page=0&size=10&summary=true&active=true&source=PRE_AUTH&claimStatus=REJECTED&claimSubStatus=PARTIALLY_APPROVED&sort=rowCreatedDate+dsc
  getIndemnityClaims(
    pageRequest: any
  ): Observable<any> {
    // ): Observable<Page<PreAuth>> {
    return http
      .get<Page<any>>(`${this.EXGRATIA_QUERY_CONTEXT}`, { params: pageRequest })
      .pipe(map((response) => response));
  }
  getPreAuthList(pageRequest: any): Observable<Page<any>> {
    return http
      .get<Page<any>>(`${this.QUERY_CONTEXT}`, { params: pageRequest })
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

  importPreAuthData(
    pagerqsts: any
  ): Observable<Page<any>> {
    return http
      .get<Page<any>>(`${this.QUERY_CONTEXT}`, { params: pagerqsts })
      .pipe(map((response) => response.data));
  }


  savePreAuth(payload: PreAuth): Observable<Map<string, any>> {
    return http
      .post<Map<string, any>>(`${this.COMMAND_CONTEXT}`, payload)
      .pipe(map((response) => response.data));
  }


  getPreAuthById(id: string): Observable<PreAuth> {
    return http
      .get<any>(`${this.QUERY_CONTEXT}/${id}`)
      .pipe(map((response) => response.data));
  }

  cancelPreAuth(
    payload: any,
    id: string
  ): Observable<PreAuth> {
    return http
      .patch<any>(`${this.COMMAND_CONTEXT}/${id}/cancel`, payload)
      .pipe(map((response) => response.data));
  }

  approvePreAuth(
    payload: any,
    id: string
  ): Observable<PreAuth> {
    return http
      .patch<any>(`${this.COMMAND_CONTEXT}/${id}/gate-keaping-doctor-approved`, payload)
      .pipe(map((response) => response.data));
  }

  revertPreAuth(
    payload: any,
    id: string
  ): Observable<PreAuth> {
    return http
      .patch<any>(`${this.COMMAND_CONTEXT}/${id}/revert`, payload)
      .pipe(map((response) => response.data));
  }

  requestMoreDocsPreAuth(
    payload: any,
    id: string
  ): Observable<PreAuth> {
    return http
      .patch<any>(`${this.COMMAND_CONTEXT}/${id}?action=add-docx`, payload)
      .pipe(map((response) => response.data));
  }


  editPreAuth(
    payload: any,
    id: any,
    action: string
  ): Observable<Map<string, any>> {
    return http
      .patch<Map<string, any>>(`${this.COMMAND_CONTEXT}/${id}`, payload, { params: { action: action } })
      .pipe(map((response) => response.data));
  }


  addDoc(id: string, payload: FormData): Observable<Map<string, any>> {
    const headers = { 'Content-Type': 'multipart/form-data' };

    return http
      .put<Map<string, any>>(`${this.COMMAND_CONTEXT}/${id}/docs`, payload, { headers })
      .pipe(map((response) => response.data));
  }

  addExgratiaDoc(id: string, payload: FormData): Observable<Map<string, any>> {
    const headers = { 'Content-Type': 'multipart/form-data' };

    return http
      .put<Map<string, any>>(`${this.EXGRATIA_COMMAND_CONTEXT}/${id}/exgratia/docs`, payload, { headers })
      .pipe(map((response) => response.data));
  }

  addIndemnityDoc(id: string, payload: FormData): Observable<Map<string, any>> {
    const headers = { 'Content-Type': 'multipart/form-data' };

    return http
      .put<Map<string, any>>(`${this.EXGRATIA_COMMAND_CONTEXT}/${id}/indemnity/docs`, payload, { headers })
      .pipe(map((response) => response.data));
  }

  requestForApprovalExgraia(id: string, payload: any): Observable<Map<string, any>> {

    return http
      .patch<Map<string, any>>(`${this.EXGRATIA_COMMAND_CONTEXT}/${id}/exgratia/request`, payload)
      .pipe(map((response) => response.data));
  }

  requestForApprovalIndemnity(id: string, payload: any): Observable<Map<string, any>> {

    return http
      .patch<Map<string, any>>(`${this.EXGRATIA_COMMAND_CONTEXT}/${id}/indemnity/request`, payload)
      .pipe(map((response) => response.data));
  }

  decissionForApprovalExgraia(id: string, payload: any): Observable<Map<string, any>> {

    return http
      .patch<Map<string, any>>(`${this.EXGRATIA_COMMAND_CONTEXT}/${id}/exgratia/decission`, payload)
      .pipe(map((response) => response.data));
  }

  decissionForApprovalIndemnity(id: string, payload: any): Observable<Map<string, any>> {

    return http
      .patch<Map<string, any>>(`${this.EXGRATIA_COMMAND_CONTEXT}/${id}/indemnity/decission`, payload)
      .pipe(map((response) => response.data));
  }

  addDocAfterReviw(id: string, payload: any): Observable<Map<string, any>> {
    return http
      .patch<Map<string, any>>(`${this.COMMAND_CONTEXT}/${id}?action=add-doc-submit`, payload)
      .pipe(map((response) => response.data));
  }


  downloadDoc(id: string, fileName: string): Observable<any> {
    return http
      .get<any>(`${this.QUERY_CONTEXT}/${id}/docs/${fileName}`, { responseType: 'blob' })
      .pipe(map((response) => response));
  }
  downloadDischargeDocs(id: string, payload: FormData): Observable<Map<string, any>> {
    const headers = { 'Content-Type': 'multipart/form-data' };

    return http
      .put<Map<string, any>>(`${this.COMMAND_CONTEXT}/${id}/discharge-docs`, payload, { headers })
      .pipe(map((response) => response.data));
  }


  admissionUpdate(id: string, payload: any): Observable<Map<string, any>> {
    return http
      .put<Map<string, any>>(`${this.COMMAND_CONTEXT}/${id}/case-managements`, payload)
      .pipe(map((response) => response.data));
  }

  getCaseList(): Observable<any> {
    return http
      .get<any>(`${this.QUERY_CONTEXT}/case-managements/count`)
      .pipe(map((response) => response));
  }

  getDashboardCount(): Observable<any> {
    return http
      .get<any>(`${this.QUERY_CONTEXT}/dashboard-count`)
      .pipe(map((response) => response));
  }


  getCaseStatusList(pageRequest: any): Observable<Page<any>> {
    return http
      .get<Page<any>>(`${this.QUERY_CONTEXT}/case-managements/list-by-duration-and-status`, { params: pageRequest })
      .pipe(map((response) => response.data));
  }

  getHospitalVisitList(preAuthId: string): Observable<any> {
    return http
      .get<any>(`${this.QUERY_CONTEXT}/${preAuthId}/case-managements/history`)
      .pipe(map((response) => response));
  }

  getClaimsByBenefit(benefitId: any, membershipNo: any): Observable<Page<PreAuth>> {
    return http
      .get<Page<any>>(`${this.QUERY_CONTEXT}/claims-by-benefit?benefitId=${benefitId}&membershipNo=${membershipNo}`,)
      .pipe(map((response) => response.data));
  }

  downloadPreAuth(id: string): Observable<any> {
    return http
      .get<any>(`${this.QUERY_CONTEXT}/download/${id}`, { responseType: 'blob' })
      .pipe(map((response) => response));
  }
}
