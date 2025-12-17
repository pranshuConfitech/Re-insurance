import type { Observable } from "rxjs/";
import { map } from "rxjs/operators";

import { http } from "../../http.client";
import type { CleintType } from "../../models/client.type";
import type { Page } from "../../models/page";

export class GenderTypeService {
    readonly QUERY_CONTEXT = `/master-data-service/v1/genders`;

    getGenders(
    ): Observable<Page<CleintType>> {
        return http
            .get<Page<CleintType>>(`${this.QUERY_CONTEXT}`)
            .pipe(map((response) => response.data));
    }


}