import type { Observable } from "rxjs/";
import { map } from "rxjs/operators";

import { http } from "../../http.client";
import type { CleintType } from "../../models/client.type";
import type { Page } from "../../models/page";

export class ServiceGroupService {
    readonly COMMAND_CONTEXT = `/master-data-service/v1/servicegroups`;

    saveGrouping(
        payload: any
    ): Observable<Page<CleintType>> {
        return http
            .post<Page<CleintType>>(`${this.COMMAND_CONTEXT}`, payload)
            .pipe(map((response) => response.data));
    }

    updateGrouping(
        groupId: string,
        payload: any,
        step: number,
    ): Observable<Page<CleintType>> {
        return http
            .patch<Page<CleintType>>(`${this.COMMAND_CONTEXT}/${groupId}?step=${step}`, payload)
            .pipe(map((response) => response.data));
    }
}