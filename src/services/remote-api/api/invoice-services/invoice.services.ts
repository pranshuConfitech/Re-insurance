import type { Observable } from "rxjs/";
import { map } from "rxjs/operators";

import { http } from "../../http.client";
import type { Invoice } from "../../models/invoice";
import type { Page } from "../../models/page";

export class InvoiceService {
  readonly COMMAND_CONTEXT = `/invoice-command-service/v1/invoices`;
  readonly QUERY_CONTEXT = `/invoice-query-service/v1/invoices`;
  readonly FUND_INVOICE_COMMAND_CONTEXT = `/invoice-command-service/v1/invoices-funds`;
  readonly FUND_INVOICE_QUERY_CONTEXT = `/invoice-query-service/v1/invoices-funds`;

  getInvoice(
    pageRequest: any
  ): Observable<Page<Invoice>> {
    return http
      .get<Page<Invoice>>(`${this.QUERY_CONTEXT}`, { params: pageRequest })
      .pipe(map((response) => response.data));
  }


  importInvoiceData(
    pagerqsts: any
  ): Observable<Page<Invoice>> {
    return http
      .get<Page<Invoice>>(`${this.QUERY_CONTEXT}`, { params: pagerqsts })
      .pipe(map((response) => response.data));
  }


  saveInvoice(payload: Invoice): Observable<Map<string, any>> {
    return http
      .post<Map<string, any>>(`${this.COMMAND_CONTEXT}`, payload)
      .pipe(map((response) => response.data));
  }

  getInvoiceDetails(invoiceid: string): Observable<Invoice> {
    return http
      .get<Invoice>(`${this.QUERY_CONTEXT}/${invoiceid}`)
      .pipe(map((response) => response.data));
  }

  downloadInvoice(id: string): Observable<Invoice> {
    return http
      .get<Invoice>(`${this.QUERY_CONTEXT}/download/${id}`, {
        responseType: 'blob'
      })
      .pipe(map((response) => response.data));
  }



  revertInvoice(
    remarks: any,

    // payload: Invoice,
    invId: string,
  ): Observable<Map<string, any>> {
    return http
      .patch<Map<string, any>>(`${this.COMMAND_CONTEXT}/${invId}/revert`, { remark: remarks })
      .pipe(map((response) => response.data));
  }

  revertFundInvoice(
    remarks: any,

    // payload: Invoice,
    invId: string,
  ): Observable<Map<string, any>> {
    return http
      .patch<Map<string, any>>(`${this.FUND_INVOICE_COMMAND_CONTEXT}/${invId}/revert`, { remark: remarks })
      .pipe(map((response) => response.data));
  }


  getFundInvoice(
    pageRequest: any

    // payload: Invoice,
  ): Observable<any> {
    return http
      .get<any>(`${this.FUND_INVOICE_QUERY_CONTEXT}`, { params: pageRequest })
      .pipe(map((response) => response.data));
  }

  generateFundInvoice(
    payload: any,

    // payload: Invoice,
  ): Observable<Map<string, any>> {
    return http
      .post<Map<string, any>>(`${this.FUND_INVOICE_COMMAND_CONTEXT}`, payload)
      .pipe(map((response) => response.data));
  }
}
