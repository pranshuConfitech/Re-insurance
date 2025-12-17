import type { Observable } from "rxjs/";
import { map } from "rxjs/operators";

import { http } from "../../http.client";
import type { Page } from "../../models/page";
import type { PageRequest } from "../../models/page.request";
import { defaultPageRequest } from "../../models/page.request";

export class BankService {
  readonly QUERY_CONTEXT = `/master-data-service/v1/banks`;

  getBankList(): Observable<Array<any>> {
    return http
      .get<Array<any>>(`${this.QUERY_CONTEXT}`)
      .pipe(map((response) => response.data));
  }
  getBranchList(bankId: string): Observable<Array<any>> {
    return http
      .get<Array<any>>(`${this.QUERY_CONTEXT}/${bankId}/branches`)
      .pipe(map((response) => response.data));
  }

}
