import type { Observable } from "rxjs/";
import { map } from "rxjs/operators";

import { http } from "../../http.client";
import type { Bank } from "../../models/bank";
import type { Page } from "../../models/page";
import { defaultPageRequest6 } from "../query-params/client.request.query.param";
import type { ProspectRequestQueryParam } from "../query-params/prospect.request.query.param";

export class BankService {
  readonly COMMAND_CONTEXT = `/bank-command-service/v1/banks`;
  readonly QUERY_CONTEXT = `/bank-query-service/v1/banks`;

  getBanks(
    pageRequest: any
  ): Observable<Page<Bank>> {
    return http
      .get<Page<Bank>>(`${this.QUERY_CONTEXT}`, { params: pageRequest })
      .pipe(map((response) => response.data));
  }  
  getParentBanks(
    pageRequest: ProspectRequestQueryParam = defaultPageRequest6
  ): Observable<Page<Bank>> {
    return http
      .get<Page<Bank>>(`${this.QUERY_CONTEXT}`, { params: pageRequest })
      .pipe(map((response) => response.data));
  }
  saveBank(payload: Bank): Observable<Map<string, any>> {
    return http
      .post<Map<string, any>>(`${this.COMMAND_CONTEXT}`, payload)
      .pipe(map((response) => response.data));
  }

  getBankDetails(clientid: string): Observable<Bank> {
    return http
      .get<Bank>(`${this.QUERY_CONTEXT}/${clientid}`)
      .pipe(map((response) => response.data));
  }

  editBank(
    payload: Bank,
    clientid: string,
    step:string
  ): Observable<Map<string, any>> {
    return http
      .patch<Map<string, any>>(`${this.COMMAND_CONTEXT}/${clientid}`, payload,{ params: {step:step} })
      .pipe(map((response) => response.data));
  }
}
