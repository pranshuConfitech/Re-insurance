import type { AxiosResponse } from "axios";
import type { Observable } from "rxjs/";
import { map } from "rxjs/operators";

import { http } from "../../http.client";
import type { Page } from "../../models/page";
import type { PageRequest } from "../../models/page.request";
import { defaultPageRequest } from "../../models/page.request";

export class BenefitStructureService {
    readonly COMMAND_CONTEXT = `/benefit-structure-command-service/v1/benefitstructures`;
    readonly QUERY_CONTEXT = `/benefit-structure-query-service/v1/benefitstructures`;

    getAllBenefitStructures(
        pageRequest: PageRequest = defaultPageRequest
    ): Observable<Page<any>> {
        return http
            .get<Page<any>>(`${this.QUERY_CONTEXT}`, { params: pageRequest })
            .pipe(map((response) => response.data));
    }

    saveBenefitStructures(
        payload: any
    ): Observable<Map<string, any>> {
        return http
            .post<Map<string, any>>(`${this.COMMAND_CONTEXT}`, payload)
            .pipe(map((response) => response.data));
    }

    getBenefitStructuresById(
        benefitStructureId: string
    ): Observable<AxiosResponse<Page<any>>> {
        return http
            .get<Page<any>>(`${this.QUERY_CONTEXT}/${benefitStructureId}`)
            .pipe(map((response) => response));
    }

    updateBenefitStructures(
        payload: any,
        benefitStructureId: string
    ): Observable<Map<string, any>> {
        return http
            .put<Map<string, any>>(`${this.COMMAND_CONTEXT}/${benefitStructureId}`, payload)
            .pipe(map((response) => response.data));
    }
    approveBenefit(
        benefitStructureId: string
    ): Observable<Map<string, any>> {
        return http
            .patch<Map<string, any>>(`${this.COMMAND_CONTEXT}/${benefitStructureId}/approve`)
            .pipe(map((response) => response.data));
    }

    getBenefitInterventions(id: string): Observable<any> {
        return http
            .get<any>(`${this.QUERY_CONTEXT}/benifit-intervention/${id}`)
            .pipe(map(response => response.data));
    }


    getBenefitStructure(
    ): Observable<Map<string, any>> {
        return http
            .get<Map<string, any>>(`${this.QUERY_CONTEXT}?page=0&size=10&summary=true&active=true`)
            .pipe(map((response) => response.data));
    }

    getBenefitStructureIntervention(id: any): Observable<Map<string, any>> {
        return http
            .get<Map<string, any>>(`${this.QUERY_CONTEXT}/benifit-intervention/${id}`)
            .pipe(map((response) => response.data));
    }

    getBenefitStructureChild(id: any
    ): Observable<Map<string, any>> {
        return http
            .get<Map<string, any>>(`${this.QUERY_CONTEXT}/benefits-with-asociated-child-benefits/${id}`)
            .pipe(map((response) => response.data));
    }


}
