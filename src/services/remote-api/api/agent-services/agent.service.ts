import type { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

import { http } from '../../http.client'
import type { Page } from '../../models/page'

export class AgentService {
  readonly QUERY_CONTEXT = `/agent-query-service/v1/agents`

  getAgents(pageRequest: any): Observable<Page<any>> {
    return http
      .get<Page<any>>(`${this.QUERY_CONTEXT}`, { params: pageRequest })
      .pipe(map(response => response.data))
  }
} 