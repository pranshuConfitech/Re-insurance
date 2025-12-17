import type { Observable } from "rxjs/";
import { map } from "rxjs/operators";

import { http } from "../../http.client";
import type { CleintType } from "../../models/client.type";
import type { Page } from "../../models/page";
import type { PageRequest } from "../../models/page.request";
import { defaultPageRequest } from "../../models/page.request";

export class TransactionModeService {
  readonly COMMAND_CONTEXT = `/master-data-service/v1/transactionmodes`;
  readonly QUERY_CONTEXT = `/master-data-service/v1/transactionmodes`;

  getTransactionModes(
    pageRequest: PageRequest = defaultPageRequest
  ): Observable<Page<CleintType>> {
    return http
      .get<Page<CleintType>>(`${this.QUERY_CONTEXT}`, { params: pageRequest })
      .pipe(map((response) => response.data));
  }
}
