import type { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

import { http } from '../../http.client'
import type { Invoice } from '../../models/invoice'
import type { Page } from '../../models/page'

export class HierarchyService {
  readonly COMMAND_CONTEXT = `/organization-command-service/v1/positions`
  readonly BRANCH_COMMAND_CONTEXT = `/organization-command-service/v1/branches`
  readonly REGION_COMMAND_CONTEXT = `/organization-command-service/v1/region`
  readonly UNIT_COMMAND_CONTEXT = `/organization-command-service/v1/unit`
  readonly QUERY_CONTEXT = `/organization-query-service/v1/positions`
  readonly BRANCH_QUERY_CONTEXT = `/organization-query-service/v1/branches`
  readonly REGION_QUERY_CONTEXT = `/organization-query-service/v1/region`
  readonly UNIT_QUERY_CONTEXT = `/organization-query-service/v1/units`
  readonly TEST_QUERY = `/organization-query-service/v1/positions/AGENT/hierarchical`

  getInvoice(pageRequest: any): Observable<Page<Invoice>> {
    return http
      .get<Page<Invoice>>(`${this.QUERY_CONTEXT}`, { params: pageRequest })
      .pipe(map(response => response.data))
  }

  getBranches(pageRequest: any): Observable<Page<Invoice>> {
    return http
      .get<Page<Invoice>>(`${this.BRANCH_QUERY_CONTEXT}`, { params: pageRequest })
      .pipe(map(response => response.data))
  }

  getBranchesFromRegion(regionId: any): Observable<any> {
    return http
      .get<any>(`${this.REGION_QUERY_CONTEXT}/${regionId}`)
      .pipe(map(response => response.data))
  }

  getUnitsFromBranch(branchId: any): Observable<any> {
    return http
      .get<any>(`${this.BRANCH_QUERY_CONTEXT}/${branchId}`)
      .pipe(map(response => response.data))
  }

  getRegion(pageRequest: any): Observable<any> {
    return http
      .get<any>(`${this.REGION_QUERY_CONTEXT}`, { params: pageRequest })
      .pipe(map(response => response.data))
  }

  getUnit(pageRequest: any): Observable<any> {
    return http
      .get<any>(`${this.UNIT_QUERY_CONTEXT}`, { params: pageRequest })
      .pipe(map(response => response.data))
  }

  saveBranch(regionId: string, payload: any): Observable<Map<string, any>> {
    // return http.post<Map<string, any>>(`${this.BRANCH_COMMAND_CONTEXT}`, payload).pipe(map(response => response.data))

    // return http.post<Map<string, any>>(`${this.REGION_COMMAND_CONTEXT}/${regionId}/branch`, payload).pipe(map(response => response.data))
    return http.patch<Map<string, any>>(`${this.REGION_COMMAND_CONTEXT}/${regionId}/branch`, payload).pipe(map(response => response.data))
  }

  saveRegion(payload: any): Observable<Map<string, any>> {
    return http.post<Map<string, any>>(`${this.REGION_COMMAND_CONTEXT}`, payload).pipe(map(response => response.data))
  }

  saveUnit(regionId: any, branchId: any, payload: any): Observable<Map<string, any>> {
    return http.patch<Map<string, any>>(`${this.REGION_COMMAND_CONTEXT}/${regionId}/branch/${branchId}/unit`, payload).pipe(map(response => response.data))
    // return http.patch<Map<string, any>>(`${this.REGION_COMMAND_CONTEXT}`, payload).pipe(map(response => response.data))
  }

  editBranch(regionId: string, payload: any, branchId: string): Observable<Map<string, any>> {
    // return http
    //   .patch<Map<string, any>>(`${this.BRANCH_COMMAND_CONTEXT}/${branchId}`, payload, { params: { step: step } })
    //   .pipe(map(response => response.data))
    return http.patch<Map<string, any>>(`${this.REGION_COMMAND_CONTEXT}/${regionId}/branch`, payload).pipe(map(response => response.data))
  }

  SaveBranchOtherDetails(regionId: string, payload: any, branchId: string, step: number): Observable<Map<string, any>> {
    // return http
    //   .patch<Map<string, any>>(`${this.BRANCH_COMMAND_CONTEXT}/${branchId}`, payload, { params: { step: step } })
    //   .pipe(map(response => response.data))
    return http.patch<Map<string, any>>(`${this.REGION_COMMAND_CONTEXT}/${regionId}/branch/${branchId}/address?step=${step}`, payload).pipe(map(response => response.data))
  }

  editRegion(payload: any, branchId: string): Observable<Map<string, any>> {
    return http
      .patch<Map<string, any>>(`${this.REGION_COMMAND_CONTEXT}/${branchId}`, payload)
      .pipe(map(response => response.data))
  }

  editUnit(regionId: any, branchId: any, payload: any, unitId: string): Observable<Map<string, any>> {
    // return http
    //   .patch<Map<string, any>>(`${this.UNIT_COMMAND_CONTEXT}/${unitId}`, payload)
    //   .pipe(map(response => response.data))
    return http.patch<Map<string, any>>(`${this.REGION_COMMAND_CONTEXT}/${regionId}/branch/${branchId}/unit`, payload).pipe(map(response => response.data))
  }

  getBranchDetails(branchId: string): Observable<any> {
    return http.get<any>(`${this.BRANCH_QUERY_CONTEXT}/${branchId}`).pipe(map(response => response.data))
  }

  getRegionDetails(branchId: string): Observable<any> {
    return http.get<any>(`${this.REGION_QUERY_CONTEXT}/${branchId}`).pipe(map(response => response.data))
  }

  getUnitDetails(unitId: string): Observable<any> {
    return http.get<any>(`${this.UNIT_QUERY_CONTEXT}/${unitId}`).pipe(map(response => response.data))
  }

  addPosition(payload: any): Observable<any> {
    return http.post<any>(`${this.COMMAND_CONTEXT}`, payload).pipe(map(response => response.data))
  }

  deletePosition(id: any): Observable<any> {
    return http.put<any>(`${this.COMMAND_CONTEXT}/${id}/delete`).pipe(map(response => response.data))
  }

  addUser(payload: any, positionID: any): Observable<any> {
    return http.patch<any>(`${this.COMMAND_CONTEXT}/${positionID}/user`, payload).pipe(map(response => response.data))
  }
  addUserNew(payload: any, positionID: any): Observable<any> {
    return http.patch<any>(`user-management-service/v1/users/master`, payload).pipe(map(response => response.data))
  }

  getHierarchyData(type: any): Observable<any> {
    return http.get<any>(`${this.QUERY_CONTEXT}/${type}/hierarchical`).pipe(map(response => response.data))
  }
  getSampleData(): Observable<any> {
    return http.get<any>(`${this.TEST_QUERY}`).pipe(map(response => response.data))
  }

  importInvoiceData(pagerqsts: any): Observable<Page<Invoice>> {
    return http.get<Page<Invoice>>(`${this.QUERY_CONTEXT}`, { params: pagerqsts }).pipe(map(response => response.data))
  }

  saveInvoice(payload: Invoice): Observable<Map<string, any>> {
    return http.post<Map<string, any>>(`${this.COMMAND_CONTEXT}`, payload).pipe(map(response => response.data))
  }

  getInvoiceDetails(invoiceid: string): Observable<Invoice> {
    return http.get<Invoice>(`${this.QUERY_CONTEXT}/${invoiceid}`).pipe(map(response => response.data))
  }

  revertInvoice(
    remarks: any,

    // payload: Invoice,
    invId: string
  ): Observable<Map<string, any>> {
    return http
      .patch<Map<string, any>>(`${this.COMMAND_CONTEXT}/${invId}/revert`, { remark: remarks })
      .pipe(map(response => response.data))
  }
}
