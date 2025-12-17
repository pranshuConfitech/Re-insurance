import type { AxiosResponse } from "axios";
import type { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { http } from "../../http.client";
import type { Page } from "../../models/page";

export class UsersService {
    readonly CONTEXT = `/user-management-service/v1/users`;

    getEmailConfirmation(id: any): Observable<any> {
        return http
            .get<Page<any>>(`${this.CONTEXT}/verify/${id}`)
            .pipe(map((response) => response.data));
    }

    saveUsers(payload: any): Observable<AxiosResponse<Map<string, any>>> {
        return http
            .post<Map<string, any>>(`${this.CONTEXT}`, payload)
            .pipe(map((response) => response));
    }

    getUsers(): Observable<Page<any>> {
        return http
            .get<Page<any>>(`${this.CONTEXT}?page=0&size=10&summary=true&active=true`)
            .pipe(map((response) => response.data));
    }
    getAgent(role: string): Observable<Page<any>> {
        return http
            // .get<Page<any>>(`${this.CONTEXT}/master?roles=agent-default-role`)
            .get<Page<any>>(`${this.CONTEXT}/master?roles=${role}`)
            .pipe(map((response) => response.data));
    }
    updateUsers(roleName: string, payload: any): Observable<AxiosResponse<Map<string, any>>> {
        return http
            .put<Map<string, any>>(`${this.CONTEXT}/${roleName}`, payload)
            .pipe(map((response) => response));
    }

    getUserDetails(userName: string): Observable<Page<any>> {
        return http
            .get<Page<any>>(`${this.CONTEXT}/${userName}`)
            .pipe(map((response) => response.data));
    }
}
