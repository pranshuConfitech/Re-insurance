import type { Observable } from "rxjs/";
import { map } from "rxjs/operators";
import { http } from "../../http.client";

export class ReportService {
  readonly COMMAND_CONTEXT = `/report-service/v1/reports`;
  // readonly QUERY_CONTEXT = `/policy-query-service/v1/policies`;
  readonly JSREPORTS_CONTEXT = `/report-service/v1/jsreports`;

  downloadReport(payload: any): Observable<any> {
    return http
      .post<Map<string, any>>(`${this.COMMAND_CONTEXT}?responseType=EXCEL`, payload, {
        responseType: 'blob'
      })
      .pipe(map((response) => response.data));
  }
  downloadJSReport(payload: any, exportFormat: string = 'excel'): Observable<any> {
    return http
      .post<Map<string, any>>(
        `${this.JSREPORTS_CONTEXT}?exportFormat=${exportFormat}`, 
        payload, 
        {
          responseType: 'blob'
        }
      )
      .pipe(map((response) => response.data));
  }
  leadReport(payload: any): Observable<any> {
    return http
      .post<Map<string, any>>(`${this.COMMAND_CONTEXT}?responseType=JSON`, payload)
      .pipe(map((response) => response.data));
  }

  clientOverviewReport(payload: any): Observable<any> {
    return http
      .post<Map<string, any>>(`${this.COMMAND_CONTEXT}?responseType=JSON`, payload)
      .pipe(map((response) => response.data));
  }

  // /report-service/v1/reports/types
  getReportList(): Observable<any> {
    return http
      .get<Map<string, any>>(`${this.COMMAND_CONTEXT}/types`)
      .pipe(map((response) => response.data));
  }
}
