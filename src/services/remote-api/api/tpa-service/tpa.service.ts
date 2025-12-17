import type { Observable } from "rxjs/";
import { map } from "rxjs/operators";

import { http } from "../../http.client";
import type { Page } from "../../models/page";

export class TpaService {
    readonly COMMAND_CONTEXT = `/tpa-command-service/v1/tpas`;
    readonly QUERY_CONTEXT = `/tpa-query-service/v1/tpas`;

    getTpas(
        pageRequest: any
    ): Observable<Page<any>> {
        return http
            .get<Page<any>>(`${this.QUERY_CONTEXT}`, { params: pageRequest })
            .pipe(map((response) => response.data));
    }

    saveTpa(payload: any): Observable<Map<string, any>> {
        return http
            .post<Map<string, any>>(`${this.COMMAND_CONTEXT}`, payload)
            .pipe(map((response) => response.data));
    }

    getTpaDetails(tpaId: string): Observable<any> {
        return http
            .get<any>(`${this.QUERY_CONTEXT}/${tpaId}`)
            .pipe(map((response) => response.data));
    }
}
