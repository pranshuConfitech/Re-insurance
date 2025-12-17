import type { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { http } from '../../http.client';
import type { Page } from '../../models/page';

export interface TreatyType {
    id: string;
    treatyTypeName: string;
    treatyTypeCode: string;
    description?: string;
    active?: boolean;
}

export class TreatyTypeService {
    readonly QUERY_CONTEXT = `/master-data-service/v1/trety-type`;

    getAllTreatyTypes(pageRequest?: any): Observable<Page<TreatyType>> {
        return http
            .get<Page<TreatyType>>(`${this.QUERY_CONTEXT}`, { params: pageRequest })
            .pipe(map((response) => response.data));
    }

    getTreatyTypeById(id: string): Observable<TreatyType> {
        return http
            .get<TreatyType>(`${this.QUERY_CONTEXT}/${id}`)
            .pipe(map((response) => response.data));
    }
}
