import type { Observable } from "rxjs/";
import { map } from "rxjs/operators";

import { http } from "../../http.client";

export interface TemplateConfigRequest {
    templateType: 'QUOTATION' | 'INVOICE' | 'RECEIPT';
    startDate: string;
    filePart: File;
}

export interface TemplateConfigResponse {
    id?: string;
    templateType: string;
    startDate: string;
    fileName?: string;
    createdAt?: string;
    updatedAt?: string;
}

export class TemplateConfigService {
    readonly COMMAND_CONTEXT = `/master-data-service/v1/templateconfig`;
    readonly QUERY_CONTEXT = `/master-data-service/v1/templateconfig`;

    getAllTemplateConfigs(pageRequest?: any): Observable<any> {
        return http
            .get<any>(`${this.QUERY_CONTEXT}`, { params: pageRequest })
            .pipe(
                map((response) => {
                    const data = response.data;

                    // If the API returns an array directly, transform it to Page format
                    if (Array.isArray(data)) {
                        return {
                            content: data,
                            totalElements: data.length,
                            totalPages: 1,
                            number: 0,
                            size: data.length,
                            first: true,
                            last: true,
                            numberOfElements: data.length,
                            empty: data.length === 0
                        };
                    }

                    // If it's already in Page format, return as is
                    return data;
                })
            );
    }

    getTemplateView(templateType: string): Observable<{ blob: Blob; filename: string }> {
        return http
            .get<Blob>(`${this.QUERY_CONTEXT}/template`, {
                params: {
                    templateType,
                    attatched: true
                },
                responseType: 'blob' as any
            })
            .pipe(
                map((response: any) => {
                    // Extract filename from Content-Disposition header
                    const contentDisposition = response.headers?.['content-disposition'];
                    let filename = `${templateType}_template`;

                    if (contentDisposition) {
                        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
                        if (filenameMatch && filenameMatch[1]) {
                            filename = filenameMatch[1].replace(/['"]/g, '');
                        }
                    }

                    return {
                        blob: response.data,
                        filename
                    };
                })
            );
    }

    createTemplateConfig(
        templateType: string,
        startDate: string,
        file: File
    ): Observable<TemplateConfigResponse> {
        const formData = new FormData();
        formData.append('filePart', file);

        // Convert date string to timestamp (milliseconds)
        const startDateTimestamp = new Date(startDate).getTime();

        return http
            .post<TemplateConfigResponse>(
                `${this.COMMAND_CONTEXT}`,
                formData,
                {
                    params: {
                        templateType,
                        startDate: startDateTimestamp
                    }
                }
            )
            .pipe(map((response) => response.data));
    }
}
