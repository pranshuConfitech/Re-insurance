import type { Observable } from "rxjs/";
import { map, retry, catchError } from "rxjs/operators";
import { of } from "rxjs";

import { http } from "../../http.client";
import type { Page } from "../../models/page";

export class RegionService {
  readonly COMMAND_CONTEXT = `/organization-command-service/v1/region`;

  saveRegion(payload: { name: string }): Observable<Map<string, any>> {
    return http
      .post<Map<string, any>>(`${this.COMMAND_CONTEXT}`, payload)
      .pipe(
        map((response) => response.data),
        retry(2), // Retry up to 2 times on failure
        catchError((error) => {
          console.error('Error saving region:', error);
          return of(error);
        })
      );
  }
} 