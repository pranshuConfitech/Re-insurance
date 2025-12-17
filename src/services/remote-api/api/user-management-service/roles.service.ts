import type { AxiosResponse } from "axios";
import type { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { http } from "../../http.client";
import type { Page } from "../../models/page";

export class RolesService {
    readonly CONTEXT = `/user-management-service/v1/roles`;
    readonly LOCATION = `/master-data-service/v1/location`;

    saveRoles(payload: any): Observable<AxiosResponse<Map<string, any>>> {
        return http
            .post<Map<string, any>>(`${this.CONTEXT}`, payload)
            .pipe(map((response) => response));
    }

    getRoles(): Observable<Page<any>> {
        return http
            .get<Page<any>>(`${this.CONTEXT}`)
            .pipe(map((response) => response.data));
    }
    getLocation(): Observable<Page<any>> {
        return http
            .get<Page<any>>(`${this.LOCATION}`)
            .pipe(map((response) => response.data));
    }
    updateRoles(roleName: string, payload: any): Observable<AxiosResponse<Map<string, any>>> {
        return http
            .put<Map<string, any>>(`${this.CONTEXT}/${roleName}`, payload)
            .pipe(map((response) => response));
    }

    getRoleDetails(roleName: string): Observable<Page<any>> {
        return http
            .get<Page<any>>(`${this.CONTEXT}/${roleName}`)
            .pipe(map((response) => response.data));
    }
}
