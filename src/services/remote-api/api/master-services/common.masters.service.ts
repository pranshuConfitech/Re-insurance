import type { Observable } from "rxjs/";
import { map } from "rxjs/operators";

import { http } from "../../http.client";
import type { Page } from "../../models/page";
import type { PageRequest } from "../../models/page.request";
import { defaultPageRequest } from "../../models/page.request";

export interface CommonMaster {
    id?: number;
    commonCode: string;
    commonDesc: string;
    commonTypeDesc: string;
    active?: boolean;
    parent?: boolean;
}

export interface CommonMasterParams {
    commonTypeDesc: string;
    page?: number;
    size?: number;
    summary?: boolean;
    active?: boolean;
    parent?: boolean;
}

export class CommonMastersService {
    readonly COMMAND_CONTEXT = `/master-data-service/v1/commonmasters`;
    readonly QUERY_CONTEXT = `/master-data-service/v1/commonmasters`;

    /**
     * Get common masters data by type (e.g., CURRENCY, OP_UNIT)
     * @param params - Parameters including commonTypeDesc and pagination options
     * @returns Observable<Page<CommonMaster>>
     */
    getCommonMasters(params: CommonMasterParams): Observable<Page<CommonMaster>> {
        const pageRequest: any = {
            page: params.page || 0,
            size: params.size || 20,
            summary: params.summary !== undefined ? params.summary : true,
            active: params.active !== undefined ? params.active : true,
            commonTypeDesc: params.commonTypeDesc,
            parent: params.parent !== undefined ? params.parent : true
        };

        return http
            .get<Page<CommonMaster>>(`${this.QUERY_CONTEXT}`, { params: pageRequest })
            .pipe(map((response) => response.data));
    }

    /**
     * Get currencies from common masters
     * @param pageRequest - Optional page request parameters
     * @returns Observable<Page<CommonMaster>>
     */
    getCurrencies(pageRequest: Partial<PageRequest> = {}): Observable<Page<CommonMaster>> {
        return this.getCommonMasters({
            commonTypeDesc: 'CURRENCY',
            ...pageRequest
        });
    }

    /**
     * Get operating units from common masters
     * @param pageRequest - Optional page request parameters
     * @returns Observable<Page<CommonMaster>>
     */
    getOperatingUnits(pageRequest: Partial<PageRequest> = {}): Observable<Page<CommonMaster>> {
        return this.getCommonMasters({
            commonTypeDesc: 'OP_UNIT',
            ...pageRequest
        });
    }

    /**
     * Get RI graded retention options from common masters
     * @param pageRequest - Optional page request parameters
     * @returns Observable<Page<CommonMaster>>
     */
    getRiGradedOptions(pageRequest: Partial<PageRequest> = {}): Observable<Page<CommonMaster>> {
        return this.getCommonMasters({
            commonTypeDesc: 'RI_GRADED',
            ...pageRequest
        });
    }

    /**
     * Get installment options from common masters
     * @param pageRequest - Optional page request parameters
     * @returns Observable<Page<CommonMaster>>
     */
    getInstallmentOptions(pageRequest: Partial<PageRequest> = {}): Observable<Page<CommonMaster>> {
        return this.getCommonMasters({
            commonTypeDesc: 'INSTALLMENT',
            ...pageRequest
        });
    }

    /**
     * Get processing method options from common masters
     * @param pageRequest - Optional page request parameters
     * @returns Observable<Page<CommonMaster>>
     */
    getProcessingMethodOptions(pageRequest: Partial<PageRequest> = {}): Observable<Page<CommonMaster>> {
        return this.getCommonMasters({
            commonTypeDesc: 'PROC_METHOD',
            ...pageRequest
        });
    }

    /**
     * Get product LOB options from common masters
     * @param pageRequest - Optional page request parameters
     * @returns Observable<Page<CommonMaster>>
     */
    getProductLobOptions(pageRequest: Partial<PageRequest> = {}): Observable<Page<CommonMaster>> {
        return this.getCommonMasters({
            commonTypeDesc: 'PROD_LOB',
            ...pageRequest
        });
    }

    /**
     * Get accounting LOB options from common masters
     * @param pageRequest - Optional page request parameters
     * @returns Observable<Page<CommonMaster>>
     */
    getAccountingLobOptions(pageRequest: Partial<PageRequest> = {}): Observable<Page<CommonMaster>> {
        return this.getCommonMasters({
            commonTypeDesc: 'ACC_LOB',
            ...pageRequest
        });
    }

    /**
     * Get risk category options from common masters
     * @param pageRequest - Optional page request parameters
     * @returns Observable<Page<CommonMaster>>
     */
    getRiskCategoryOptions(pageRequest: Partial<PageRequest> = {}): Observable<Page<CommonMaster>> {
        return this.getCommonMasters({
            commonTypeDesc: 'RISK_CAT',
            ...pageRequest
        });
    }

    /**
     * Save a new common master
     * @param payload - Common master data to save
     * @returns Observable<CommonMaster>
     */
    saveCommonMaster(payload: CommonMaster): Observable<CommonMaster> {
        return http
            .post<CommonMaster>(`${this.COMMAND_CONTEXT}`, payload)
            .pipe(map((response) => response.data));
    }

    /**
     * Update an existing common master
     * @param id - ID of the common master to update
     * @param payload - Updated common master data
     * @returns Observable<CommonMaster>
     */
    updateCommonMaster(id: number, payload: CommonMaster): Observable<CommonMaster> {
        return http
            .patch<CommonMaster>(`${this.COMMAND_CONTEXT}/${id}`, payload)
            .pipe(map((response) => response.data));
    }

    /**
     * Delete a common master
     * @param id - ID of the common master to delete
     * @returns Observable<any>
     */
    deleteCommonMaster(id: number): Observable<any> {
        return http
            .delete<any>(`${this.COMMAND_CONTEXT}/${id}`)
            .pipe(map((response) => response.data));
    }
}
