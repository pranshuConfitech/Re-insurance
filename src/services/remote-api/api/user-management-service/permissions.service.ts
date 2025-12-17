import type { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { http } from "../../http.client";
import type { Page } from "../../models/page";

export class PermissionsService {
    readonly CONTEXT = `/user-management-service/v1/permissions`;

    getPermissions(): Observable<Page<any>> {
        return http
            .get<Page<any>>(`${this.CONTEXT}`)
            .pipe(map((response) => response.data));
    }
}
