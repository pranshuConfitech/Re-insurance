import type { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

import { http } from '../../http.client'
import type { CleintType } from '../../models/client.type'
import type { Page } from '../../models/page'
import type { PageRequest } from '../../models/page.request'
import { defaultPageRequest } from '../../models/page.request'

export class ProviderTypeService {
  readonly COMMAND_CONTEXT = `/master-data-service/v1/providertypes`
  readonly QUERY_CONTEXT = `/master-data-service/v1/providertypes`
  readonly QUERY_CONTEXT1 = `/master-data-service/v1/providerownertypes`
  readonly QUERY_CATEGORY = `/master-data-service/v1/categories`
  readonly QUERY_CATEGORY_FUND = `/master-data-service/v1/fundType`
  readonly QUERY_CATEGORY_PROVIDER = `/master-data-service/v1/providertypes`
  readonly QUERY_CATEGORY_PROVIDER_OWNER = `/master-data-service/v1/providerownertypes`
  readonly QUERY_CATEGORY_ROLE = `/master-data-service/v1`
  readonly COMMAND_CONTEXT_CONTRACT_TYPES = `/master-data-service/v1/contracttypes`
  readonly COMMAND_CONTEXT_NATIONAL_SCHEME_CONTRACT_TYPES = `/master-data-service/v1/nationalschemecontracttypes` 


  getProviderTypes(pageRequest: PageRequest = defaultPageRequest): Observable<Page<CleintType>> {
    return http
      .get<Page<CleintType>>(`${this.QUERY_CONTEXT}`, { params: pageRequest })
      .pipe(map(response => response.data))
  }

  getProviderOwnerTypes(pageRequest: PageRequest = defaultPageRequest): Observable<Page<CleintType>> {
    return http
      .get<Page<CleintType>>(`${this.QUERY_CONTEXT1}`, { params: pageRequest })
      .pipe(map(response => response.data))
  }

  addProviderOwnerType(payload: any): Observable<Page<CleintType>> {
    return http.post<Page<CleintType>>(`${this.QUERY_CONTEXT1}`, payload).pipe(map(response => response.data))
  }

  getProviderCategory(pageRequest: PageRequest = defaultPageRequest): Observable<Page<CleintType>> {
    return http
      .get<Page<CleintType>>(`${this.QUERY_CATEGORY}`, { params: pageRequest })
      .pipe(map(response => response.data))
  }

  addProviderCategoryType(payload: any): Observable<Page<CleintType>> {
    return http.post<Page<CleintType>>(`${this.QUERY_CATEGORY}`, payload).pipe(map(response => response.data))
  }

  addFundCategoryType(payload: any): Observable<Page<CleintType>> {
    return http.post<Page<CleintType>>(`${this.QUERY_CATEGORY_FUND}`, payload).pipe(map(response => response.data))
  }

  addProviderType(payload: any): Observable<Page<CleintType>> {
    return http.post<Page<CleintType>>(`${this.QUERY_CONTEXT}`, payload).pipe(map(response => response.data))
  }

  getProviderList(page: any): Observable<Page<CleintType>> {
    return http
      .get<Page<CleintType>>(`${this.QUERY_CATEGORY_FUND}?page=${page}&size=10&summary=true&active=true`)
      .pipe(map(response => response.data))
  }

  deleteFundList(id: any): Observable<Page<CleintType>> {
    return http.delete<Page<CleintType>>(`${this.QUERY_CATEGORY_FUND}/${id}`).pipe(map(response => response.data))
  }

  editFundList(id: any, param: any): Observable<Page<CleintType>> {
    return http
      .patch<Page<CleintType>>(`${this.QUERY_CATEGORY_FUND}/${id}`, { name: param })
      .pipe(map(response => response.data))
  }

  deleteProviderList(id: any): Observable<Page<CleintType>> {
    return http.delete<Page<CleintType>>(`${this.QUERY_CATEGORY}/${id}`).pipe(map(response => response.data))
  }

  deleteProviderTypesList(id: any): Observable<Page<CleintType>> {
    return http.delete<Page<CleintType>>(`${this.QUERY_CATEGORY_PROVIDER}/${id}`).pipe(map(response => response.data))
  }

  deleteProviderOwnerTypesList(id: any): Observable<Page<CleintType>> {
    return http
      .delete<Page<CleintType>>(`${this.QUERY_CATEGORY_PROVIDER_OWNER}/${id}`)
      .pipe(map(response => response.data))
  }
  editProviderList(id: any, param: any): Observable<Page<CleintType>> {
    return http
      .patch<Page<CleintType>>(`${this.QUERY_CATEGORY}/${id}`, { name: param })
      .pipe(map(response => response.data))
  }

  editProviderType(id: any, param: any): Observable<Page<CleintType>> {
    return http
      .patch<Page<CleintType>>(`${this.QUERY_CATEGORY_PROVIDER}/${id}`, { name: param })
      .pipe(map(response => response.data))
  }

  editOwnerProviderType(id: any, param: any): Observable<Page<CleintType>> {
    return http
      .patch<Page<CleintType>>(`${this.QUERY_CATEGORY_PROVIDER_OWNER}/${id}`, { name: param })
      .pipe(map(response => response.data))
  }

  getProviderLabel(): Observable<Page<CleintType>> {
    return http
      .get<Page<CleintType>>(`${this.QUERY_CATEGORY}?page=0&size=10&summary=true&active=true`)
      .pipe(map(response => response.data))
  }

  getProviderType(): Observable<Page<CleintType>> {
    return http
      .get<Page<CleintType>>(`${this.QUERY_CONTEXT}?page=0&size=10&summary=true&active=true`)
      .pipe(map(response => response.data))
  }

  getProviderOwner(): Observable<Page<CleintType>> {
    return http
      .get<Page<CleintType>>(`${this.QUERY_CATEGORY_ROLE}/providerownertypes?page=0&size=10&summary=true&active=true`)
      .pipe(map(response => response.data))
  }

  addProviderOwner(payload: any): Observable<Page<CleintType>> {
    return http
      .post<Page<CleintType>>(`${this.QUERY_CATEGORY_ROLE}/providerownertypes`, payload)
      .pipe(map(response => response.data))
  }

  getCommissionRole(): Observable<Page<CleintType>> {
    return http
      .get<Page<CleintType>>(`${this.QUERY_CATEGORY_ROLE}/commissionrole?page=0&size=10&summary=true&active=true`)
      .pipe(map(response => response.data))
  }

  addCommissionRole(payload: any): Observable<Page<CleintType>> {
    return http
      .post<Page<CleintType>>(`${this.QUERY_CATEGORY_ROLE}/commissionrole`, payload)
      .pipe(map(response => response.data))
  }

  getBasicDetail(): Observable<Page<CleintType>> {
    return http
      .get<Page<CleintType>>(`${this.QUERY_CATEGORY_ROLE}/instantconfiguration`)
      .pipe(map(response => response.data))
  }
  getCountryDetail(): Observable<Page<CleintType>> {
    return http
      .get<Page<CleintType>>(`${this.QUERY_CATEGORY_ROLE}/countries?page=0&size=10&summary=true&active=true`)
      .pipe(map(response => response.data))
  }

  saveBasicDetail(payload: any): Observable<Page<CleintType>> {
    return http
      .post<Page<CleintType>>(`${this.QUERY_CATEGORY_ROLE}/instantconfiguration`, payload)
      .pipe(map(response => response.data))
  }

  updateBasicDetail(id: any, payload: any): Observable<Page<CleintType>> {
    return http
      .patch<Page<CleintType>>(`${this.QUERY_CATEGORY_ROLE}/instantconfiguration/${id}`, payload)
      .pipe(map(response => response.data))
  }

  getNotificationConfiguration(id: any): Observable<Page<CleintType>> {
    return http
      .get<Page<CleintType>>(`${this.QUERY_CATEGORY_ROLE}/instantconfiguration/${id}/notifications`)
      .pipe(map(response => response.data))
  }

  updateNotificationConfiguration(id: any, payload: any): Observable<Page<CleintType>> {
    return http
      .patch<Page<CleintType>>(`${this.QUERY_CATEGORY_ROLE}/instantconfiguration/${id}/notifications`, payload)
      .pipe(map(response => response.data))
  }

  getCallManagement(): Observable<Page<CleintType>> {
    return http
      .get<
        Page<CleintType>
      >(`${this.QUERY_CATEGORY_ROLE}/callmanagementconfigurationservice?page=0&size=10&summary=true&active=true`)
      .pipe(map(response => response.data))
  }

  saveCallManagement(payload: any): Observable<Page<CleintType>> {
    return http
      .post<Page<CleintType>>(`${this.QUERY_CATEGORY_ROLE}/grievence-service`, payload)
      .pipe(map(response => response.data))
  }

  getCallManagementDetails(): Observable<Page<CleintType>> {
    return http
      .get<Page<CleintType>>(`${this.QUERY_CATEGORY_ROLE}/grievence-service?page=0&size=10&summary=true&active=true`)
      .pipe(map(response => response.data))
  }


  getContractTypes(pageRequest: PageRequest = defaultPageRequest): Observable<Page<CleintType>> {
    return http
      .get<Page<CleintType>>(`${this.COMMAND_CONTEXT_CONTRACT_TYPES}`, { params: pageRequest })
      .pipe(map(response => response.data))
  }

  getNationalSchemeContractTypes(pageRequest: PageRequest = defaultPageRequest): Observable<Page<CleintType>> {
    return http
      .get<Page<CleintType>>(`${this.COMMAND_CONTEXT_NATIONAL_SCHEME_CONTRACT_TYPES}`, { params: pageRequest })
      .pipe(map(response => response.data))
  }


  
  
}
