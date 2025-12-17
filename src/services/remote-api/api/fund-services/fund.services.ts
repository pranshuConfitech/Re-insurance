import type { AxiosResponse } from "axios";
import type { Observable } from "rxjs/";
import { map } from "rxjs/operators";

import { http } from "../../http.client";
import type { Page } from "../../models/page";
import type { IFund } from "../../models/fund";


export class FundService {
  readonly COMMAND_CONTEXT = '/fund-command-service/v1/fundconfigs';
  readonly QUERY_CONTEXT = '/fund-query-service/v1/fundconfigs';
  readonly FUND_QUERY_CONTEXT = '/fund-query-service/v1/funds';
  readonly FEES_QUERY_CONTEXT = '/fund-query-service/v1/feeconfigs';
  readonly FEES_COMMAND_CONTEXT = '/fund-command-service/v1/feeconfigs';

  getConfigs(
    pageRequest: IFund
  ): Observable<Page<IFund>> {
    return http
      .get<Page<IFund>>(`${this.QUERY_CONTEXT}`, { params: pageRequest })
      .pipe(map((response) => response.data));
  }
  getConfigDetails(configid: string): Observable<IFund> {
    return http
      .get<IFund>(`${this.QUERY_CONTEXT}/${configid}`)
      .pipe(map((response) => response.data));
  }

  saveConfig(payload: IFund): Observable<AxiosResponse<Map<string, any>>> {
    return http
      .post<Map<string, any>>(`${this.COMMAND_CONTEXT}`, payload)
      .pipe(map((response) => response));
  }

  editConfig(
    payload: IFund,
    configid: string
  ): Observable<Map<string, any>> {
    return http
      .patch<Map<string, any>>(`${this.COMMAND_CONTEXT}/${configid}`, payload)
      .pipe(map((response) => response.data));
  }

  getFeesConfigs(
    pageRequest: any
  ): Observable<Page<IFund>> {
    return http
      .get<Page<IFund>>(`${this.FEES_QUERY_CONTEXT}`, { params: pageRequest })
      .pipe(map((response) => response.data));
  }

  saveFeesConfig(payload: any): Observable<AxiosResponse<Map<string, any>>> {
    return http
      .post<Map<string, any>>(`${this.FEES_COMMAND_CONTEXT}`, payload)
      .pipe(map((response) => response));
  }

  getFeeConfigDetails(configid: string): Observable<IFund> {
    return http
      .get<IFund>(`${this.FEES_QUERY_CONTEXT}/${configid}`)
      .pipe(map((response) => response.data));
  }

  getFundStatement(pageRequest: any): Observable<any> {
    return http
      .get<any>(`${this.FUND_QUERY_CONTEXT}`, { params: pageRequest })
      .pipe(map((response) => response.data));
  }

  editFeeConfig(
    payload: any,
    configid: string
  ): Observable<Map<string, any>> {
    return http
      .patch<Map<string, any>>(`${this.FEES_COMMAND_CONTEXT}/${configid}`, payload)
      .pipe(map((response) => response.data));
  }

}
