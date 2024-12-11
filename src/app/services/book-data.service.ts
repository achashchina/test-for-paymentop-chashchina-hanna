import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable, tap } from 'rxjs'

import { Book } from '../interfaces/book.interface'

@Injectable({
  providedIn: 'root',
})
export class BookDataService {
  private stateSubject = new BehaviorSubject<Book[]>([])
  public state$: Observable<Book[]> = this.stateSubject.asObservable()

  constructor(private http: HttpClient) {}

  fetchData(): Observable<Book[]> {
    const url = 'assets/data.json'
    return this.http.get<Book[]>(url).pipe(tap((data) => this.stateSubject.next(data)))
  }

  updateState(newState: Book[]): void {
    this.stateSubject.next(newState)
  }

  getCurrentState(): Book[] {
    return this.stateSubject.value
  }
}
