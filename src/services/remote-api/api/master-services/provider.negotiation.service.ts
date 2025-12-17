import type { Observable } from "rxjs/";
import { map } from "rxjs/operators";

import { http } from "../../http.client";
import type { Page } from "../../models/page";
import type { Negotiation } from "../../models/negotiation";


export class ProviderNegotiationService {
  readonly COMMAND_CONTEXT = `/provider-command-service/v1/providernegotiations`;
  readonly QUERY_CONTEXT = `/provider-query-service/v1/providernegotiations`;

  saveNegotiation(file: File, providerNegotiationDTO: any): Observable<any> {
    const formData = new FormData();

    formData.append("filePart", file);
    formData.append("providerNegotiationDTO",
      new Blob([JSON.stringify(providerNegotiationDTO)],
        { type: "application/json" }));

    return http
      .post<any>(`${this.COMMAND_CONTEXT}`, formData)
      .pipe(map((response) => response.data));
  }

  getNegotiations(
    pageRequest: any
  ): Observable<Page<Negotiation>> {
    return http
      .get<Page<Negotiation>>(`${this.QUERY_CONTEXT}`, { params: pageRequest })
      .pipe(map((response) => response.data));
  }

  downloadExcel(
  ): Observable<any> {
    return http
      .get<any>(`${this.QUERY_CONTEXT}/download/negotiation-template`, { responseType: 'blob' })
      .pipe(map((response) => response.data));
  }

}
