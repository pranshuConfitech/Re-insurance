import type { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

import { HttpClient } from '../http.client'

export class SampleData {
  instance = new HttpClient()
  getPosts(): Observable<{ id: number; userId: number; title: string; body: string }[]> {
    return this.instance
      .get<{ id: number; userId: number; title: string; body: string }[]>(`https://jsonplaceholder.typicode.com/posts`)
      .pipe(map(response => response.data))
  }
}
