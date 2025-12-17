import type { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

import { http } from '../../http.client'
import type { Page } from '../../models/page'

export class GuidlineService {
  readonly COMMAND_CONTEXT = `/master-data-service/v1/underwritings/guidelines`
  readonly QUERY_CONTEXT = `/master-data-service/v1/underwritings/guidelines`

  getAgeGuidlineList(pageRequest: any): Observable<Page<any>> {
    return http
      .get<Page<any>>(`${this.QUERY_CONTEXT}/age/group`, { params: pageRequest })
      .pipe(map(response => response.data))
  }

  getGenderGuidlineList(pageRequest: any): Observable<Page<any>> {
    return http
      .get<Page<any>>(`${this.QUERY_CONTEXT}/gender`, { params: pageRequest })
      .pipe(map(response => response.data))
  }
  getRelationshipGuidlineList(pageRequest: any): Observable<Page<any>> {
    return http
      .get<Page<any>>(`${this.QUERY_CONTEXT}/relationship`, { params: pageRequest })
      .pipe(map(response => response.data))
  }
  getAnnualIncomeGuidlineList(pageRequest: any): Observable<Page<any>> {
    return http
      .get<Page<any>>(`${this.QUERY_CONTEXT}/aginst/income`, { params: pageRequest })
      .pipe(map(response => response.data))
  }
  getBmiGuidlineList(pageRequest: any): Observable<Page<any>> {
    return http
      .get<Page<any>>(`${this.QUERY_CONTEXT}/bmi`, { params: pageRequest })
      .pipe(map(response => response.data))
  }

  saveAgeGuidline(payload: any): Observable<Map<string, any>> {
    return http
      .post<Map<string, any>>(`${this.COMMAND_CONTEXT}/age/group/save`, payload)
      .pipe(map(response => response.data))
  }
  saveRelationshipGuidline(payload: any): Observable<Map<string, any>> {
    return http
      .post<Map<string, any>>(`${this.COMMAND_CONTEXT}/relationship/save`, payload)
      .pipe(map(response => response.data))
  }
  saveGenderGuidline(payload: any): Observable<Map<string, any>> {
    return http
      .post<Map<string, any>>(`${this.COMMAND_CONTEXT}/gender/save`, payload)
      .pipe(map(response => response.data))
  }
  saveAnnualIncomeGuidline(payload: any): Observable<Map<string, any>> {
    return http
      .post<Map<string, any>>(`${this.COMMAND_CONTEXT}/age/aginst/income/save`, payload)
      .pipe(map(response => response.data))
  }
  saveBMIGuidline(payload: any): Observable<Map<string, any>> {
    return http
      .post<Map<string, any>>(`${this.COMMAND_CONTEXT}/age/bmi/save`, payload)
      .pipe(map(response => response.data))
  }

  saveMedicalCheckupAge(payload: { ageValue: number }): Observable<Map<string, any>> {
    return http
      .post<Map<string, any>>(`${this.COMMAND_CONTEXT}/meadical/checkup/save`, payload)
      .pipe(map(response => response.data))
  }

  getMedicalCheckupAgeGuideline(pageRequest: any): Observable<Page<any>> {
    return http
      .get<Page<any>>(`${this.QUERY_CONTEXT}/meadical/checkup`, { params: pageRequest })
      .pipe(map(response => response.data))
  }
}
