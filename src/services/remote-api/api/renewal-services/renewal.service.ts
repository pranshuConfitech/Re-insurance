import type { Observable } from "rxjs/";
import { map } from "rxjs/operators";

import { http } from "../../http.client";
import type { Page } from "../../models/page";
import type { Policy } from "../../models/proposer";

export class RenewalService {
  readonly COMMAND_CONTEXT = `/policy-command-service/v1/policies`;
  readonly QUERY_CONTEXT = `/policy-query-service/v1/policies`;

  getRenewalPolicy(
    pageRequest:any
  ): Observable<Page<Policy>> {
    return http
      .get<Page<Policy>>(`${this.QUERY_CONTEXT}`, { params: pageRequest })
      .pipe(map((response) => response.data));
  } 
}
