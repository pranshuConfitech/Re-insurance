import type { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

import { http } from '../../http.client'
import type { Page } from '../../models/page'
import type { Provider } from '../../models/provider'
import { defaultPageRequest5 } from '../query-params/client.request.query.param'
import type { ProspectRequestQueryParam } from '../query-params/prospect.request.query.param'

export class ProvidersService {
  readonly COMMAND_CONTEXT = `/provider-command-service/v1/providers`
  readonly QUERY_CONTEXT = `/provider-query-service/v1/providers`
  readonly COMMAND_CONSTEXT = `provider-command-service/v1/providers/create-provider-contract`

  getProviders(pageRequest?: any): Observable<Page<Provider>> {
    return http
      .get<Page<Provider>>(`${this.QUERY_CONTEXT}`, { params: pageRequest })
      .pipe(map(response => response.data))
  }
  getPendingProviders(pageRequest: any): Observable<Page<Provider>> {
    return http
      .get<Page<Provider>>(`${this.QUERY_CONTEXT}/to-approve`, { params: pageRequest })
      .pipe(map(response => response.data))
  }
  getParentProviders(pageRequest: ProspectRequestQueryParam = defaultPageRequest5): Observable<Page<Provider>> {
    return http
      .get<Page<Provider>>(`${this.QUERY_CONTEXT}`, { params: pageRequest })
      .pipe(map(response => response.data))
  }
  saveProvider(payload: Provider): Observable<Map<string, any>> {
    return http.post<Map<string, any>>(`${this.COMMAND_CONTEXT}`, payload).pipe(map(response => response.data))
  }

  getProviderDetails(providerid: string): Observable<Provider> {
    return http.get<Provider>(`${this.QUERY_CONTEXT}/${providerid}`).pipe(map(response => response.data))
  }

  getProviderAllDetails(payload: any, provider: string): Observable<Map<string, any>> {
    return http
      .patch<Map<string, any>>(`${this.COMMAND_CONSTEXT}/${provider}`, payload)
      .pipe(map(response => response.data))
  }

  editProvider(payload: Provider, providerid: string, step: string): Observable<Map<string, any>> {
    return http
      .patch<Map<string, any>>(`${this.COMMAND_CONTEXT}/${providerid}`, payload, { params: { step: step } })
      .pipe(map(response => response.data))
  }

  blacklistProvider(payload: any): Observable<Map<string, any>> {
    return http
      .patch<Map<string, any>>(`${this.COMMAND_CONTEXT}/blacklist`, payload)
      .pipe(map(response => response.data))
  }
  approveProvider(id: string, payload: any): Observable<Map<string, any>> {
    return http
      .patch<Map<string, any>>(`${this.COMMAND_CONTEXT}/approve-provider/${id}`, payload)
      .pipe(map(response => response.data))
  }

  unblacklistProvider(payload: any): Observable<Map<string, any>> {
    return http
      .patch<Map<string, any>>(`${this.COMMAND_CONTEXT}/unblacklist`, payload)
      .pipe(map(response => response.data))
  }

  categorizeProvider(payload: any): Observable<Map<string, any>> {
    return http
      .patch<Map<string, any>>(`${this.COMMAND_CONTEXT}/category`, payload)
      .pipe(map(response => response.data))
  }

  getProvidersList(payload?: any): Observable<Map<string, any>> {
    return http
      .get<Map<string, any>>(`${this.QUERY_CONTEXT}/findAllproviderIdAndName`, payload)
      .pipe(map(response => response.data))
  }

  getProviderTypeCount(): Observable<any> {
    return http
      .get<any>(`${this.QUERY_CONTEXT}/providertype/count`)
      .pipe(map(response => response.data));
  }

  getContractedProviderTypeCount(type: string, contracted: boolean): Observable<any> {
    return http
      .get<any>(`${this.QUERY_CONTEXT}/Contractedprovidertype/count`, {
        params: { type, contracted: contracted.toString() }
      })
      .pipe(map(response => response.data));
  }

  saveProviderDocuments(providerid: string, formData: FormData): Observable<Map<string, any>> {
    return http
      .patch<Map<string, any>>(`${this.COMMAND_CONTEXT}/${providerid}/docs`, formData)
      .pipe(map(response => response.data));
  }

  getProviderDocuments(providerid: string): Observable<Map<string, any>> {
    return http
      .get<Map<string, any>>(`${this.QUERY_CONTEXT}/${providerid}/docs`)
      .pipe(map(response => response.data));
  }

  getDocumentById(documentId: string): Observable<Blob> {
    return http
      .get(`${this.QUERY_CONTEXT}/docs/${documentId}`, {
        responseType: 'blob'
      } as any)
      .pipe(
        map((response: any) => response.data as Blob)
      );
  }

  deleteProviderDocument(providerid: string, documentId: string): Observable<Map<string, any>> {
    return http
      .delete<Map<string, any>>(`${this.COMMAND_CONTEXT}/${providerid}/docs/${documentId}`)
      .pipe(map(response => response.data));
  }

  getApprovalStatus(acknowledgementNo: string): Observable<any> {
    return http
      .get<any>(`${this.QUERY_CONTEXT}/approval/status`, {
        params: { acknowledgementNo }
      })
      .pipe(map(response => response.data));
  }

  suspendProvider(payload: any): Observable<Map<string, any>> {
    return http
      .patch<Map<string, any>>(`${this.COMMAND_CONTEXT}/suspend`, payload)
      .pipe(map(response => response.data));
  }

  withdrawSuspensionProvider(payload: any): Observable<Map<string, any>> {
    return http
      .patch<Map<string, any>>(`${this.COMMAND_CONTEXT}/suspend-withdraw`, payload)
      .pipe(map(response => response.data));
  }

  getSuspendedProviderCount(type?: string): Observable<any> {
    const params: any = {};
    if (type) {
      params.type = type;
    }
    return http
      .get<any>(`${this.QUERY_CONTEXT}/suspended-providers/count`, { params })
      .pipe(map(response => response.data));
  }

  getSuspendedProviders(pageRequest?: any): Observable<Page<Provider>> {
    // Remove suspended parameter if present, as it's already in the endpoint path
    const { suspended, ...restParams } = pageRequest || {};
    return http
      .get<Page<Provider>>(`${this.QUERY_CONTEXT}/suspended-providers`, { params: restParams })
      .pipe(map(response => response.data));
  }







}
