import type { Observable } from "rxjs/";
import { map } from "rxjs/operators";

import type { PageRequest } from "../../fettle-remote-api";
import { http } from "../../http.client";

export class QuotationService {
  readonly QUERY_CONTEXT = `/quotation-query-service/v1/quotations`;
  readonly COMMAND_CONTEXT = `/quotation-command-service/v1/quotations`;
  readonly MEMBER_COMMAND_CONTEXT = `/member-command-service/v1/member-plan-update`;
  readonly QUERY_CONTEXT_DOWNLOAD = `/quotation-query-service/v1/quotations/download`;
  getQuoationDetails(
    pageRequest: any
  ): Observable<any> {
    return http
      .get<any>(`${this.QUERY_CONTEXT}`, { params: pageRequest })
      .pipe(map((response) => response.data));
  }
  getPlanInfoDetails(
    pageRequest: any
  ): Observable<any> {
    return http
      .get<any>(`${this.QUERY_CONTEXT}`, { params: pageRequest })
      .pipe(map((response) => response.data));
  }

  getQuoationDownload(
    id: any
  ): Observable<any> {
    return http
      .get<any>(`${this.QUERY_CONTEXT}/download/${id}`, {
        responseType: 'blob'
      })
      .pipe(map((response) => response.data));
  }

  getQuoationByProspect(
    prospectName: string
  ): Observable<any> {
    return http
      .get<any>(`${this.QUERY_CONTEXT}/search-by-prospect-name/${prospectName}`)
      .pipe(map((response) => response.data));
  }

  getQuoationDetailsByID(quotaionid: string): Observable<any> {
    return http
      .get<any>(`${this.QUERY_CONTEXT}/${quotaionid}`)
      .pipe(map((response) => response.data));
  }
  getQuotationDetailsByPolicy(policyId: string): Observable<any> {
    return http
      .get<any>(`${this.QUERY_CONTEXT}/renewal/${policyId}`)
      .pipe(map((response) => response.data));
  }
  saveQuotation(payload: any): Observable<Map<string, any>> {
    return http
      .post<Map<string, any>>(`${this.COMMAND_CONTEXT}`, payload)
      .pipe(map((response) => response.data));
  }

  uploadTemplate(payload: any, quotationId: string, pageRequest: any,): Observable<any> {
    const headers = { 'Content-Type': 'multipart/form-data' };

    const config = {
      headers: headers,
      params: pageRequest
    }

    return http

      // .patch<any>(`${this.COMMAND_CONTEXT}/${quotationId}/members`, payload, { params: pageRequest }, { headers })
      .patch<any>(`${this.COMMAND_CONTEXT}/${quotationId}/members`, payload, config)
      .pipe(map((response) => response.data));
  }

  updateQuotation(pageRequest: PageRequest, payload: any, quotationId: string): Observable<Map<string, any>> {
    return http
      .patch<Map<string, any>>(`${this.COMMAND_CONTEXT}/${quotationId}`, payload, { params: pageRequest })
      .pipe(map((response) => response.data));
  }

  uploadMedicalReport(id: string, payload: FormData): Observable<Map<string, any>> {
    const headers = { 'Content-Type': 'multipart/form-data' };

    return http
      .patch<Map<string, any>>(`${this.MEMBER_COMMAND_CONTEXT}/${id}/meadical-docs`, payload, { headers })
      .pipe(map((response) => response.data));
  }

  uploadDiscountAndLoading(payload: any, quotationId: string): Observable<Map<string, any>> {
    return http
      .patch<Map<string, any>>(`${this.COMMAND_CONTEXT}/${quotationId}/update-loading-amount`, payload)
      .pipe(map((response) => response.data));
  }
  // ?action=decission
  quotationDecision(payload: any, quotationId: string): Observable<Map<string, any>> {
    return http
      .patch<Map<string, any>>(`${this.COMMAND_CONTEXT}/${quotationId}?action=decission`, payload)
      .pipe(map((response) => response.data));
  }
  // ?action=request-approval
  requestForApproval(quotationId: string): Observable<Map<string, any>> {
    return http
      .patch<Map<string, any>>(`${this.COMMAND_CONTEXT}/${quotationId}?action=request-approval`)
      .pipe(map((response) => response.data));
  }
  approveQuotation(quotationId: string, pageRequest: PageRequest): Observable<Map<string, any>> {
    return http
      .patch<Map<string, any>>(`${this.COMMAND_CONTEXT}/${quotationId}?action=approve`, {})
      .pipe(map((response) => response.data));
  }

  getQuotationTemplate(): Observable<{ blob: Blob; filename: string }> {
    return http
      .get<Blob>(`/master-data-service/v1/templateconfig/template`, {
        params: {
          templateType: 'QUOTATION',
          attatched: true
        },
        responseType: 'blob' as any
      })
      .pipe(
        map((response: any) => {
          const contentDisposition = response.headers?.['content-disposition'];
          let filename = 'QUOTATION_template.docx';

          if (contentDisposition) {
            const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
            if (filenameMatch && filenameMatch[1]) {
              filename = filenameMatch[1].replace(/['"]/g, '');
            }
          }

          return {
            blob: response.data,
            filename
          };
        })
      );
  }

  generateQuotationTemplate(quotationId: string, templateFile: File): Observable<any> {
    const formData = new FormData();
    formData.append('template', templateFile);

    const headers = { 'Content-Type': 'multipart/form-data' };

    return http
      .post<any>(`${this.QUERY_CONTEXT}/quotation_template`, formData, {
        params: { id: quotationId },
        headers: headers,
        responseType: 'blob' as any
      })
      .pipe(map((response) => response.data));
  }
}
