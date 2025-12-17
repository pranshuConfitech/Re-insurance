import type { Observable } from "rxjs/";
import { map } from "rxjs/operators";

import { http } from "../../http.client";
import type { Page } from "../../models/page";
import type { PageRequest } from "../../models/page.request";
import { defaultPageRequest } from "../../models/page.request";

export class PremiumFrequencyService {

    readonly QUERY_CONTEXT = `master-data-service/v1/premiumfrequencies`;

    getPremiumFrequencies(
        pageRequest: PageRequest = defaultPageRequest
    ): Observable<Page<any>> {
        return http
            .get<Page<any>>(`${this.QUERY_CONTEXT}`, { params: pageRequest })
            .pipe(map((response) => response.data));
    }
}
