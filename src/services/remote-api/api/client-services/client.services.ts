import type { Observable} from 'rxjs';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { http } from '../../http.client';
import type { Client } from '../../models/client';
import type { Page } from '../../models/page';
import { defaultPageRequest3 } from '../query-params/client.request.query.param';
import type { ProspectRequestQueryParam } from '../query-params/prospect.request.query.param';

export class ClientService {
  readonly COMMAND_CONTEXT = `/client-command-service/v1/clients`;
  readonly QUERY_CONTEXT = `/client-query-service/v1/clients`;
  readonly QUERY_CONTEXT_PROSPECT = `/client-query-service/v1/clients/prospect`;

  getClients(pageRequest: any): Observable<Page<Client>> {
    return http
      .get<Page<Client>>(`${this.QUERY_CONTEXT}`, { params: pageRequest })
      .pipe(map(response => response.data));
  }
  getParentClients(pageRequest: ProspectRequestQueryParam = defaultPageRequest3): Observable<Page<Client>> {
    return http
      .get<Page<Client>>(`${this.QUERY_CONTEXT}`, { params: pageRequest })
      .pipe(map(response => response.data));
  }
  saveClient(payload: Client): Observable<Map<string, any>> {
    return http.post<Map<string, any>>(`${this.COMMAND_CONTEXT}`, payload).pipe(
      map(response => response.data),
      catchError(err => of(err)),
    );
  }

  importClient(pagerqsts: any): Observable<Page<Client>> {
    return http
      .get<Page<Client>>(`${this.QUERY_CONTEXT}`, { params: pagerqsts })
      .pipe(map(response => response.data));
  }
  getClientDetails(clientid: string): Observable<Client> {
    return http.get<Client>(`${this.QUERY_CONTEXT}/${clientid}`).pipe(map(response => response.data));
  }
  getClientProspect(clientid: string): Observable<Client> {
    return http.get<Client>(`${this.QUERY_CONTEXT_PROSPECT}/${clientid}`).pipe(map(response => response.data));
  }
  editCient(payload: Client, clientid: string, step: string): Observable<Map<string, any>> {
    return http
      .patch<Map<string, any>>(`${this.COMMAND_CONTEXT}/${clientid}`, payload, { params: { step: step } })
      .pipe(map(response => response.data));
  }

  getGroups(param:any): Observable<Map<string, any>> {
    return http
      .get<Map<string, any>>(`${this.QUERY_CONTEXT}` , {params: param})
      .pipe(map(response => response.data));
  }

}
