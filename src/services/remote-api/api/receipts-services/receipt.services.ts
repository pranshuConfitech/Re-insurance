import type { Observable } from "rxjs/";
import { map } from "rxjs/operators";

import { http } from "../../http.client";
import type { Page } from "../../models/page";
import type { Receipt } from "../../models/receipt";

export class ReceiptService {
  readonly COMMAND_CONTEXT = `/receipt-command-service/v1/receipts`;
  readonly QUERY_CONTEXT = `/receipt-query-service/v1/receipts`;

  getReceipts(
    pageRequest: any
  ): Observable<Page<Receipt>> {
    return http
      .get<Page<Receipt>>(`${this.QUERY_CONTEXT}`, { params: pageRequest })
      .pipe(map((response) => response.data));
  }


  importReceiptData(
    pagerqsts: any
  ): Observable<Page<Receipt>> {
    return http
      .get<Page<Receipt>>(`${this.QUERY_CONTEXT}`, { params: pagerqsts })
      .pipe(map((response) => response.data));
  }


  saveReceipt(payload: Receipt): Observable<Map<string, any>> {
    return http
      .post<Map<string, any>>(`${this.COMMAND_CONTEXT}`, payload)
      .pipe(map((response) => response.data));
  }

  getReceiptDetails(invoiceid: string): Observable<Receipt> {
    return http
      .get<Receipt>(`${this.QUERY_CONTEXT}/${invoiceid}`)
      .pipe(map((response) => response.data));
  }
  getReceiptDownload(id: string): Observable<Receipt> {
    return http
      .get<Receipt>(`${this.QUERY_CONTEXT}/download/${id}`, {
        responseType: 'blob',
      }
      )
      .pipe(map((response) => response.data));
  }


  revertReceipt(
    remarks: any,

    // payload: Invoice,
    invId: string,
  ): Observable<Map<string, any>> {
    return http
      .patch<Map<string, any>>(`${this.COMMAND_CONTEXT}/${invId}/revert`, { remark: remarks })
      .pipe(map((response) => response.data));
  }
}
