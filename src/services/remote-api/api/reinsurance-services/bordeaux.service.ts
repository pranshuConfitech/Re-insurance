import type { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { http } from "../../http.client";

export interface BordeauxSearchParams {
    fromDate: string;
    toDate: string;
    treatyCode?: string;
}

export interface BordeauxSearchResponse {
    fromDate: string;
    treatyCode: string | null;
    toDate: string;
    count: number;
    rows: BordeauxRow[];
}

export interface BordeauxRow {
    id: number;
    gcLoadDate: string;
    transactionDate: string;
    treatyCode: string;
    reinsurerCode: string;
    policyNumber: string;
    endtNumber: string;
    policyHolderName: string;
    gwpAmountSection: number;
    risiAmountSection: number;
    participantRiAmount: number;
    bordeauxStatementNumber: string;
    bordeauxFromDate: string;
    bordeauxToDate: string;
    bordeauxStatementDate: string;
    postedToFinance: string;
    reportGenerated: boolean;
    statementType: string | null;
    [key: string]: any;
}

export class BordeauxService {
    readonly BASE_CONTEXT = `/reinsurance-service/v1`;

    /**
     * Upload Bordeaux staging Excel file
     * @param file - Excel file to upload
     * @returns Observable<any>
     */
    uploadBordeauxStaging(file: File): Observable<any> {
        const formData = new FormData();
        formData.append('file', file);

        return http
            .post<any>(`${this.BASE_CONTEXT}/portfolio-treaty/premium-stagging-bordeaux/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .pipe(map((response) => response.data));
    }

    /**
     * Search Bordeaux data by RI date
     * @param params - Search parameters
     * @returns Observable<BordeauxSearchResponse>
     */
    searchBordeauxByRiDate(params: BordeauxSearchParams): Observable<BordeauxSearchResponse> {
        const queryParams: any = {
            fromDate: params.fromDate,
            toDate: params.toDate
        };

        if (params.treatyCode && params.treatyCode !== 'All Treaties') {
            queryParams.treatyCode = params.treatyCode;
        }

        return http
            .get<BordeauxSearchResponse>(`${this.BASE_CONTEXT}/portfolio-treaty/premium-stagging-bordeaux/search-by-ri-date`, {
                params: queryParams
            })
            .pipe(map((response) => response.data));
    }

    /**
     * Generate Bordeaux header report
     * @param params - Generate parameters
     * @returns Observable<BordeauxSearchResponse>
     */
    generateBordeauxHeader(params: BordeauxSearchParams): Observable<BordeauxSearchResponse> {
        const queryParams: any = {
            fromDate: params.fromDate,
            toDate: params.toDate
        };

        if (params.treatyCode && params.treatyCode !== 'All Treaties') {
            queryParams.treatyCode = params.treatyCode;
        }

        return http
            .get<BordeauxSearchResponse>(`${this.BASE_CONTEXT}/portfolio-treaty/premium-stagging-bordeaux/generate-header`, {
                params: queryParams
            })
            .pipe(map((response) => response.data));
    }
}
