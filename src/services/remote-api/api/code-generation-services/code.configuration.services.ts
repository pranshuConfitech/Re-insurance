import type { Observable } from "rxjs/";
import { map } from "rxjs/operators";

import { http } from "../../http.client";

export class CodeConfigurationService {
  readonly COMMAND_CONTEXT = `/configuration-command-service/v1/configurations`;
  readonly QUERY_CONTEXT = `/configuration-query-service/v1/configurations`;

  getConfigDetails(configName:any,clientName:any):Observable<any>{
    return http
          .get<any>(`${this.QUERY_CONTEXT}`, { params: {configName:configName,clientName:clientName} })
          .pipe(map((response:any) => response.data));
  }

  saveasDraft(payload: any,step:any,id:any): Observable<Map<string, any>> {
    return http
      .patch<Map<string, any>>(`${this.COMMAND_CONTEXT}/${id}`,payload,{ params: {step:step} })
      .pipe(map((response:any) => response.data));
  }
  

  saveCodeConfigurations(payload: any,step:any): Observable<Map<string, any>> {
    return http
      .post<Map<string, any>>(`${this.COMMAND_CONTEXT}`,payload,{ params: {step:step} })
      .pipe(map((response:any) => response.data));
  }


  

 
}
