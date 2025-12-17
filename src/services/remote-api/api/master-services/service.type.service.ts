import type { Observable } from "rxjs/";
import { map } from "rxjs/operators";

import { http } from "../../http.client";
import type { CleintType } from "../../models/client.type";
import type { Page } from "../../models/page";
import type { PageRequest } from "../../models/page.request";
import { defaultPageRequest } from "../../models/page.request";
import type { PageRequestServicegrouping, PageRequestServices } from "../../models/page.request.service.grouping";
import { defaultPageRequestServiceGrouping, defaultPageRequestServices } from "../../models/page.request.service.grouping";

export class ServiceTypeService {
    readonly QUERY_CONTEXT = `/master-data-service/v1/servicetypes`;

    getServiceTypes(
        pageRequest: PageRequest = defaultPageRequest
    ): Observable<Page<CleintType>> {
        return http
            .get<Page<CleintType>>(`${this.QUERY_CONTEXT}`, { params: pageRequest })
            .pipe(map((response) => response.data));
    }

    getExpenseHead(
        serviceId: string,
        name?: string,
        pageRequest: PageRequest = defaultPageRequest
    ): Observable<Page<CleintType>> {
        const params: Record<string, any> = { ...pageRequest };

        if (name) {
            params.name = name;
        }

        return http
            .get<Page<CleintType>>(`${this.QUERY_CONTEXT}/${serviceId}/services`, { params })
            .pipe(map((response) => response.data));
    }



    getServiceGroupes(
        serviceId: string,
        pageRequest: PageRequestServicegrouping = defaultPageRequestServiceGrouping,
    ): Observable<Page<CleintType>> {
        return http
            .get<Page<CleintType>>(`${this.QUERY_CONTEXT}/${serviceId}/servicegroups`, { params: pageRequest })
            .pipe(map((response) => response.data));
    }

    getServices(
        serviceId: string,
        serviceGroupId: string,
        pageRequest: PageRequestServices = defaultPageRequestServices,
    ): Observable<Page<CleintType>> {
        return http
            .get<Page<CleintType>>(`${this.QUERY_CONTEXT}/${serviceId}/services?service-group-id=${serviceGroupId}`, { params: pageRequest })
            .pipe(map((response) => response.data));
    }

    getServicesbyId(
        serviceId: string,
        pageRequest: PageRequestServices = defaultPageRequestServices,
    ): Observable<Page<CleintType>> {
        return http
            .get<Page<CleintType>>(`${this.QUERY_CONTEXT}/${serviceId}/services`, { params: pageRequest })
            .pipe(map((response) => response.data));
    }
    // /master-data-service/v1/servicetypes/service-code?code=1A00
    getServicesbyCode(
        code: string,
        pageRequest: PageRequestServices = defaultPageRequestServices,
    ): Observable<Page<CleintType>> {
        return http
            .get<Page<CleintType>>(`${this.QUERY_CONTEXT}/service-code?code=${code}`)
            .pipe(map((response) => response.data));
    }


}
