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

export interface BordeauxReportHeader {
    active: boolean;
    rowCreatedBy: string;
    rowCreatedDate: number;
    rowLastUpdatedBy: string;
    rowLastUpdatedDate: number;
    rowLastModProcName: string;
    rowVersionNbr: number;
    id: number;
    sectionLob: string;
    bordeauxStatementNumber: string;
    bordeauxFromDate: string;
    bordeauxToDate: string;
    bordeauxStatementDate: string;
    statementStatus: string;
    treatyCode: string;
    brokerCode: string | null;
    reinsurerCode: string;
    reportGenerated: boolean;
    cellsJson: string;
    rangeA1: string;
    sumFee9001: number;
    sumFee9002: number;
    sumFee9003: number;
    sumFee1001: number;
    postedToFinance: string;
    financePostingDate: string | null;
    financeAccountingDate: string | null;
    createdAt: string;
    key: number;
    [key: string]: any;
}

export interface BordeauxInvoiceRequest {
    consolidatedIds: number[];
}

export interface BordeauxFinanceSettlementJournal {
    invoiceId: number;
    financeSettlementJournal: string;
    financePaidDate: string;
    financePaidAmount: number;
    financeOutstandingAmount: number;
    call: string;
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
            .post<any>(`${this.BASE_CONTEXT}/premium-stagging-bordeaux/upload`, formData, {
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
            .get<BordeauxSearchResponse>(`${this.BASE_CONTEXT}/premium-stagging-bordeaux/search-by-ri-date`, {
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
            .get<BordeauxSearchResponse>(`${this.BASE_CONTEXT}/premium-stagging-bordeaux/generate-header`, {
                params: queryParams
            })
            .pipe(map((response) => response.data));
    }

    /**
     * Confirm generated Bordeaux header rows
     * @param params - confirm parameters
     * @returns Observable<any>
     */
    confirmGeneratedHeader(params: BordeauxSearchParams): Observable<any> {
        const queryParams: any = {
            fromDate: params.fromDate,
            toDate: params.toDate
        };

        if (params.treatyCode && params.treatyCode !== 'All Treaties') {
            queryParams.treatyCode = params.treatyCode;
        }

        return http
            .post<any>(`${this.BASE_CONTEXT}/premium-stagging-bordeaux/confirm-generated-header`, null, {
                params: queryParams
            })
            .pipe(map((response) => response.data));
    }

    /**
     * Search report headers after confirmation
     * @param params - Search parameters
     * @returns Observable<BordeauxReportHeader[]>
     */
    searchReportHeaders(params: BordeauxSearchParams): Observable<BordeauxReportHeader[]> {
        const queryParams: any = {
            responseType: 'JSON',
            fromDate: params.fromDate,
            toDate: params.toDate
        };

        if (params.treatyCode && params.treatyCode !== 'All Treaties') {
            queryParams.treatyCode = params.treatyCode;
        }

        return http
            .get<any>(`${this.BASE_CONTEXT}/premium-stagging-bordeaux/report-headers`, {
                params: queryParams
            })
            .pipe(map((response) => {
                // The API returns {fromDate, toDate, treatyCode, count, rows: [...]}
                // We need to extract the rows array
                if (response.data && response.data.rows) {
                    return response.data.rows;
                }
                return [];
            }));
    }

    /**
     * Generate invoice from consolidated IDs
     * @param request - Invoice request with consolidated IDs
     * @returns Observable<any>
     */
    generateInvoice(request: BordeauxInvoiceRequest): Observable<any> {
        return http
            .post<any>(`${this.BASE_CONTEXT}/premium-stagging-bordeaux/invoices`, request)
            .pipe(map((response) => response.data));
    }

    /**
     * Search finance settlement journal
     * @param fromPaidDate - From paid date
     * @param toPaidDate - To paid date
     * @returns Observable<any>
     */
    searchFinanceSettlementJournal(fromPaidDate: string, toPaidDate: string): Observable<any> {
        return http
            .get<any>(`${this.BASE_CONTEXT}/premium-stagging-bordeaux/finance-settlement-journal`, {
                params: {
                    fromPaidDate,
                    toPaidDate
                }
            })
            .pipe(map((response) => response.data));
    }

    /**
     * Push invoice to finance settlement journal
     * @param data - Finance settlement journal data
     * @returns Observable<any>
     */
    pushToFinanceSettlementJournal(data: BordeauxFinanceSettlementJournal): Observable<any> {
        return http
            .post<any>(`${this.BASE_CONTEXT}/premium-stagging-bordeaux/finance-settlement-journal`, data)
            .pipe(map((response) => response.data));
    }

    /**
     * View invoice by consolidated ID
     * @param consolidatedId - Consolidated ID
     * @returns Observable<any>
     */
    viewInvoiceByConsolidatedId(consolidatedId: number): Observable<any> {
        return http
            .get<any>(`${this.BASE_CONTEXT}/premium-stagging-bordeaux/invoices/by-consolidated-id`, {
                params: {
                    consolidatedId
                }
            })
            .pipe(map((response) => response.data));
    }

    /**
     * Search ledger by date range and/or bordeaux statement number
     * @param params - Search parameters (fromDate, toDate, bordeauxStatementNumber, page, size)
     * @returns Observable<any>
     */
    searchLedger(params: {
        fromDate?: string;
        toDate?: string;
        bordeauxStatementNumber?: string;
        page?: number;
        size?: number;
    }): Observable<any> {
        const queryParams: any = {};

        if (params.fromDate) {
            queryParams.fromDate = params.fromDate;
        }
        if (params.toDate) {
            queryParams.toDate = params.toDate;
        }
        if (params.bordeauxStatementNumber) {
            queryParams.bordeauxStatementNumber = params.bordeauxStatementNumber;
        }
        if (params.page !== undefined) {
            queryParams.page = params.page;
        }
        if (params.size !== undefined) {
            queryParams.size = params.size;
        }

        return http
            .get<any>(`${this.BASE_CONTEXT}/premium-stagging-bordeaux/ledger`, {
                params: queryParams
            })
            .pipe(map((response) => response.data));
    }

    /**
     * Search treaties in staging table by date range
     * @param fromDate - From date
     * @param toDate - To date
     * @returns Observable<any>
     */
    searchTreatiesInStaging(fromDate: string, toDate: string): Observable<any> {
        return http
            .get<any>(`${this.BASE_CONTEXT}/premium-stagging-bordeaux/treaties`, {
                params: {
                    fromDate,
                    toDate
                }
            })
            .pipe(map((response) => response.data));
    }

    /**
     * Generate monthly statement for a single treaty
     * @param params - Statement generation parameters
     * @returns Observable<any>
     */
    generateMonthlyStatement(params: {
        treatyCode: string;
        fromDate: string;
        toDate: string;
    }): Observable<any> {
        return http
            .post<any>(`${this.BASE_CONTEXT}/premium-stagging-bordeaux/generate-monthly-statement`, null, {
                params: {
                    treatyCode: params.treatyCode,
                    fromDate: params.fromDate,
                    toDate: params.toDate
                }
            })
            .pipe(map((response) => response.data));
    }

    /**
     * Generate monthly statements in bulk for multiple treaties
     * @param params - Bulk statement generation parameters
     * @returns Observable<any>
     */
    generateMonthlyStatementsBulk(params: {
        treatyCodes: string[];
        fromDate: string;
        toDate: string;
    }): Observable<any> {
        return http
            .post<any>(`${this.BASE_CONTEXT}/premium-stagging-bordeaux/generate-monthly-statements-bulk`, {
                treatyCodes: params.treatyCodes,
                fromDate: params.fromDate,
                toDate: params.toDate
            })
            .pipe(map((response) => response.data));
    }
}
