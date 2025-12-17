import type { Observable } from "rxjs/";
import { map } from "rxjs/operators";

import { http } from "../../http.client";

export class CaseManagementService {
  readonly COMMAND_CONTEXT = `/claim-command-service/v1/case-managements`;
  readonly QUERY_CONTEXT = `/claim-query-service/v1/case-managements`;

  admissionUpdate(payload: any): Observable<Map<string, any>> {
    return http
      .post<Map<string, any>>(`${this.COMMAND_CONTEXT}/admission`, payload)
      .pipe(map((response) => response.data));
  }





}
