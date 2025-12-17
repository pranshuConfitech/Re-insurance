import type { Observable } from "rxjs/";
import { map } from "rxjs/operators";

import { http } from "../../http.client";
import type { Denomination } from "../../models/denomination";
import type { Page } from "../../models/page";

export class DenominationService {
    readonly COMMAND_CONTEXT = `/master-data-service/v1/denominations`;
    readonly QUERY_CONTEXT = `/master-data-service/v1/denominations`;

  getDenominations(
    pageRequest: any
  ): Observable<Page<Denomination>> {
    return http
      .get<Page<Denomination>>(`${this.QUERY_CONTEXT}`, { params: pageRequest })
      .pipe(map((response) => response.data));
  }  

//   getParentBanks(
//     pageRequest: ProspectRequestQueryParam = defaultPageRequest6
//   ): Observable<Page<Bank>> {
//     return http
//       .get<Page<Bank>>(`${this.QUERY_CONTEXT}`, { params: pageRequest })
//       .pipe(map((response) => response.data));
//   }
  saveDenomination(payload: Denomination[]): Observable<Map<string, any>> {
    return http
      .post<Map<string, any>>(`${this.COMMAND_CONTEXT}`, payload)
      .pipe(map((response) => response.data));
  }


  
  getCardDetails(cardId: string): Observable<Denomination> {
    return http
      .get<Denomination>(`${this.QUERY_CONTEXT}/${cardId}`)
      .pipe(map((response) => response.data));
  }

  deleteDenomination(
    payload: any,
    denoID: string,
  ): Observable<Map<string, any>> {
    return http
      .patch<Map<string, any>>(`${this.COMMAND_CONTEXT}/${denoID}/delete`, payload)
      .pipe(map((response) => response.data));
  }
}
