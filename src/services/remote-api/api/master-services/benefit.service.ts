import type { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

import { http } from '../../http.client'
import type { Page } from '../../models/page'
import type { PageRequest } from '../../models/page.request'
import { defaultPageRequest } from '../../models/page.request'

export class BenefitService {
  readonly QUERY_CONTEXT = `master-data-service/v1/benefits`
  readonly BENEFIT_QUERY_CONTEXT = `benefit-structure-query-service/v1/benefitstructures`

  getBenefitInterventions(id: string): Observable<Page<any>> {
    return http
      .get<Page<any>>(`${this.BENEFIT_QUERY_CONTEXT}/benifit-intervention/${id}`)
      .pipe(map(response => response.data))
  }

  getServicesfromInterventions(id: string, benefitStructureId: string): Observable<Page<any>> {
    return http
      .get<Page<any>>(`${this.BENEFIT_QUERY_CONTEXT}/benifit-intervention-digonesis/${id}/${benefitStructureId}`)
      .pipe(map(response => response.data))
  }

  getAllBenefit(pageRequest: PageRequest = defaultPageRequest): Observable<Page<any>> {
    return http.get<Page<any>>(`${this.QUERY_CONTEXT}`, { params: pageRequest }).pipe(map(response => response.data))
  }
  getAllBenefitWithChild(pageRequest: any): Observable<Page<any>> {
    return http
      .get<Page<any>>(`${this.BENEFIT_QUERY_CONTEXT}/sha/master/benefits`, { params: pageRequest })
      .pipe(map(response => response.data))
  }

  getBenefitParameterDetails(benefitCode: string): Observable<Page<any>> {
    return http.get<Page<any>>(`${this.QUERY_CONTEXT}/${benefitCode}`).pipe(map(response => response.data))
  }
  getBenefitParameterDetails2(benefitCode: string, benefitstructuresId: string): Observable<Page<any>> {
    return http
      .get<Page<any>>(`${this.BENEFIT_QUERY_CONTEXT}/${benefitCode}/${benefitstructuresId}`)
      .pipe(map(response => response.data))
  }
  getBenefitDetailsById(benefitstructuresId: string): Observable<Page<any>> {
    return http
      .get<Page<any>>(`${this.BENEFIT_QUERY_CONTEXT}/basic-details/${benefitstructuresId}`)
      .pipe(map(response => response.data))
  }
}
