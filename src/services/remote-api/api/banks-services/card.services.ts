import type { Observable } from "rxjs/";
import { map } from "rxjs/operators";

import { http } from "../../http.client";
import type { Card } from "../../models/card";
import type { Page } from "../../models/page";

export class CardService {
  readonly COMMAND_CONTEXT = `/bank-command-service/v1/cards`;
  readonly QUERY_CONTEXT = `/bank-query-service/v1/cards`;

  getCards(
    pageRequest: any
  ): Observable<Page<Card>> {
    return http
      .get<Page<Card>>(`${this.QUERY_CONTEXT}`, { params: pageRequest })
      .pipe(map((response) => response.data));
  }  

//   getParentBanks(
//     pageRequest: ProspectRequestQueryParam = defaultPageRequest6
//   ): Observable<Page<Bank>> {
//     return http
//       .get<Page<Bank>>(`${this.QUERY_CONTEXT}`, { params: pageRequest })
//       .pipe(map((response) => response.data));
//   }
  saveCard(payload: Card): Observable<Map<string, any>> {
    return http
      .post<Map<string, any>>(`${this.COMMAND_CONTEXT}`, payload)
      .pipe(map((response) => response.data));
  }

  getCardDetails(cardId: string): Observable<Card> {
    return http
      .get<Card>(`${this.QUERY_CONTEXT}/${cardId}`)
      .pipe(map((response) => response.data));
  }

  editCard(
    payload: Card,
    cardId: string,
  ): Observable<Map<string, any>> {
    return http
      .patch<Map<string, any>>(`${this.COMMAND_CONTEXT}/${cardId}`, payload)
      .pipe(map((response) => response.data));
  }
}
