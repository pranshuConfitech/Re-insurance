import type { Observable } from "rxjs/";
import { map } from "rxjs/operators";

import { http } from "../../http.client";
import type { Page } from "../../models/page";

export class QuestionnaireService {
  readonly COMMAND_CONTEXT = `/master-data-service/v1/Questionnaire`;
  readonly QUERY_CONTEXT = `/master-data-service/v1/Questionnaire`;

  getQuestionnaireList(
    pageRequest: any
  ): Observable<Page<any>> {
    return http
      .get<Page<any>>(`${this.QUERY_CONTEXT}`, { params: pageRequest })
      .pipe(map((response) => response.data));
  }
  
  getMemberQuestionnaireList(
    pageRequest: any
  ): Observable<Page<any>> {
    return http
      .get<Page<any>>(`${this.QUERY_CONTEXT}/member`, { params: pageRequest })
      .pipe(map((response) => response.data));
  }

  getQuestionnaireById(
    id: any
  ): Observable<Page<any>> {
    return http
      .get<Page<any>>(`${this.QUERY_CONTEXT}/${id}`)
      .pipe(map((response) => response.data));
  }

  saveQuestionnaire(payload: any): Observable<Map<string, any>> {
    return http
      .post<Map<string, any>>(`${this.COMMAND_CONTEXT}`, payload)
      .pipe(map((response) => response.data));
  }
  
  editQuestionnaire(payload: any, id:any): Observable<Map<string, any>> {
    return http
      .post<Map<string, any>>(`${this.COMMAND_CONTEXT}/${id}`, payload)
      .pipe(map((response) => response.data));
  }
}