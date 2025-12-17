import type { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

import { http } from '../../http.client'
import type { Page } from '../../models/page'
import type { Policy } from '../../models/proposer'

export class PolicyService {
  readonly COMMAND_CONTEXT = `/policy-command-service/v1/policies`
  readonly QUERY_CONTEXT = `/policy-query-service/v1/policies`
  readonly QUERY_CONTEXT1 = `/policy-query-service/v1/policies/policyNumber`
  readonly QUERY_CONTEXT2 = `/policy-query-service/v1/policies/policyNumber?policyNumber=`

  getPolicy(pageRequest: any): Observable<Page<Policy>> {
    return http.get<Page<Policy>>(`${this.QUERY_CONTEXT}`, { params: pageRequest }).pipe(map(response => response.data))
  }
  getPolicyList(pageRequest: any): Observable<Page<Policy>> {
    return http
      .get<Page<Policy>>(`${this.QUERY_CONTEXT1}`, { params: pageRequest })
      .pipe(map(response => response.data))
  }

  //   importInvoiceData(
  //     pagerqsts
  //   ): Observable<Page<Invoice>> {
  //     return http
  //       .get<Page<Invoice>>(`${this.QUERY_CONTEXT}`, { params: pagerqsts })
  //       .pipe(map((response) => response.data));
  //   }

  savePolicy(payload: Policy): Observable<Map<string, any>> {
    return http.post<Map<string, any>>(`${this.COMMAND_CONTEXT}`, payload).pipe(map(response => response.data))
  }

  getPolicyDetails(policyId: string): Observable<Policy> {
    return http.get<Policy>(`${this.QUERY_CONTEXT}/${policyId}`).pipe(map(response => response.data))
  }
  getPolicyGeneralDetails(policyNumber: string): Observable<Policy> {
    return http.get<Policy>(`${this.QUERY_CONTEXT2}${policyNumber}`).pipe(map(response => response.data))
  }

  downloadPolicy(id: any): Observable<Policy> {
    return http
      .get<Policy>(`${this.QUERY_CONTEXT}/download/${id}`, {
        responseType: 'blob'
      })
      .pipe(map(response => response.data))
  }
  emailPolicy(id: any): Observable<Policy> {
    return http
      .get<Policy>(`${this.QUERY_CONTEXT}/${id}/send-email`)
      .pipe(map(response => response.data))
  }

  editPolicy(payload: Policy, policyId: string, step: string): Observable<Map<string, any>> {
    return http
      .patch<Map<string, any>>(`${this.COMMAND_CONTEXT}/${policyId}`, payload, { params: { step: step } })
      .pipe(map(response => response.data))
  }

  reAssignRequest(policyId: string): Observable<Map<string, any>> {
    return http
      .patch<Map<string, any>>(`${this.COMMAND_CONTEXT}/${policyId}`, {}, { params: { action: 're-assign' } })
      .pipe(map(response => response.data))
  }

  // Get policy count for renewal periods
  getPolicyCount(days: number): Observable<any> {
    return http
      .get<any>(`${this.QUERY_CONTEXT}/countPolicies`, { params: { days } })
      .pipe(map(response => response.data))
  }

  // Get policies list for renewal periods
  findPolicies(days: number): Observable<any> {
    return http
      .get<any>(`${this.QUERY_CONTEXT}/findPolicies`, { params: { days } })
      .pipe(map(response => response.data))
  }
}
