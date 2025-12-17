import type { Observable } from "rxjs/";
import { map } from "rxjs/operators";

import { http } from "../../http.client";
import type { Page } from "../../models/page";
import { defaultPageRequest } from "../../models/page.request";
import type { Plan } from "../../models/plan";
import type { ProspectRequestQueryParam } from "../query-params/prospect.request.query.param";

export class PlanService {
  readonly COMMAND_CONTEXT = `/product-command-service/v1/plans`;
  readonly QUERY_CONTEXT = `/product-query-service/v1/plans`;

  getPlans(
    pageRequest: ProspectRequestQueryParam = defaultPageRequest
  ): Observable<Page<Plan>> {
    return http
      .get<Page<Plan>>(`${this.QUERY_CONTEXT}`, { params: pageRequest })
      .pipe(map((response) => response.data));
  }

  savePlan(payload: Plan): Observable<Map<string, any>> {
    return http
      .post<Map<string, any>>(`${this.COMMAND_CONTEXT}`, payload)
      .pipe(map((response) => response.data));
  }

  getPlanDetails(planid: string): Observable<Plan> {
    return http
      .get<Plan>(`${this.QUERY_CONTEXT}/${planid}`)
      .pipe(map((response) => response.data));
  }

  addPlanCategory(payload: any, planid: string): Observable<Map<string, any>> {
    return http
      .patch<Map<string, any>>(`${this.COMMAND_CONTEXT}/${planid}/category`, payload)
      .pipe(map((response) => response.data));
  }

  editPlan(
    payload: Plan,
    planid: string
  ): Observable<Map<string, any>> {
    return http
      .put<Map<string, any>>(`${this.COMMAND_CONTEXT}/${planid}`, payload)
      .pipe(map((response) => response.data));
  }

  getPlanFromProduct(productID: any): Observable<Page<Plan>> {
    return http
      .get<Page<Plan>>(`${this.QUERY_CONTEXT}/product/${productID}`)
      .pipe(map((response) => response.data));
  }

  getCategoriesFromPlan(planid: string): Observable<any> {
    return http
      .get<any>(`${this.QUERY_CONTEXT}/${planid}/category`)
      .pipe(map((response) => response.data));
  }
}
