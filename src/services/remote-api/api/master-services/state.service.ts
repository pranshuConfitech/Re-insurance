import type { Observable } from "rxjs/";
import { map } from "rxjs/operators";

import { http } from "../../http.client";
import type { Page } from "../../models/page";

export class StateService {
  readonly COMMAND_CONTEXT = `/master-data-service/v1/states`;
  readonly QUERY_CONTEXT = `/master-data-service/v1/states`;

  getStateList(
    pageRequest: any,
    countryId:any
  ): Observable<Page<any>> {
    return http
      .get<Page<any>>(`${this.QUERY_CONTEXT}/${countryId}`, { params: pageRequest })
      .pipe(map((response) => response.data));
  }
}