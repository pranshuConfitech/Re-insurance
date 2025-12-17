import type { AxiosResponse } from "axios";
import type { Observable } from "rxjs/";
import { map } from "rxjs/operators";

import { http } from "../../http.client";
import type { Page } from "../../models/page";
import type { IParameterPageRequest } from "../../models/page.request.parameter";
import { defaultParameterPageRequest } from "../../models/page.request.parameter";
import type { Parameter } from "../../models/parameters";

export class ParametersService {

    readonly COMMAND_CONTEXT = `/master-data-service/v1/parameters`;
    readonly QUERY_CONTEXT = `master-data-service/v1/parameters`;

    saveParameter(payload: Parameter): Observable<AxiosResponse<Map<string, any>>> {
        return http
            .post<Map<string, any>>(`${this.COMMAND_CONTEXT}`, payload)
            .pipe(map((response) => response));
    }

    getAllParameters(pageRequest: IParameterPageRequest = defaultParameterPageRequest): Observable<Page<any>> {
        return http
            .get<Page<any>>(`${this.QUERY_CONTEXT}`, { params: pageRequest })
            .pipe(map((response) => response.data));
    }

    getParameterDetailsById(parameterId: string): Observable<Page<any>> {
        return http
            .get<Page<any>>(`${this.QUERY_CONTEXT}/${parameterId}`)
            .pipe(map((response) => response.data));
    }

    updateParameter(payload: Parameter, parameterId: string): Observable<AxiosResponse<Map<string, any>>> {
        return http
            .put<Map<string, any>>(`${this.COMMAND_CONTEXT}/${parameterId}`, payload)
            .pipe(map((response) => response));
    }
}
