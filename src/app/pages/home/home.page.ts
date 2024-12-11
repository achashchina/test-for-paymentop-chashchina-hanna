import { DataSource } from '@angular/cdk/collections'
import { DatePipe } from '@angular/common'
import { Component, inject, OnInit, ViewChild } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIcon } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatTable, MatTableModule } from '@angular/material/table'
import { filter, map, Observable, ReplaySubject, switchMap } from 'rxjs'

import { Book } from '../../interfaces/book.interface'
import { EditBookDialogComponent } from '../../modals/edit-book/edit-book.component'
import { BookDataService } from '../../services/book-data.service'

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatButtonModule,
    MatTableModule,
    MatIcon,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    DatePipe,
  ],
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss',
})
export default class HomePage implements OnInit {
  readonly dialog = inject(MatDialog)
  @ViewChild(MatTable) table?: MatTable<Book>

  displayedColumns: string[] = ['author', 'name', 'created']

  dataSource = new BookDataSource([])

  constructor(private bookDataService: BookDataService) {}

  ngOnInit(): void {
    this.bookDataService
      .fetchData()
      .pipe(
        switchMap(() => this.bookDataService.state$),
        map((state: Book[]) => state.map((x) => ({ ...x, created: x.created ? new Date(x.created) : new Date() }))),
      )
      .subscribe((state) => (this.dataSource.data = state))
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
    this.dataSource.filter = filterValue.trim().toLowerCase()
  }

  removeData(index: number) {
    this.dataSource.remove(index)
  }

  openDialogForEdit(book: Book): void {
    const dialogRef = this.dialog.open(EditBookDialogComponent, {
      data: book,
      width: '500px',
    })

    this.afterModalClose(dialogRef)
  }

  openDialogForCreate(): void {
    const dialogRef = this.dialog.open(EditBookDialogComponent, {
      data: {},
      width: '500px',
    })

    this.afterModalClose(dialogRef, true)
  }

  private afterModalClose(dialogRef: MatDialogRef<EditBookDialogComponent>, create?: boolean): void {
    dialogRef
      .afterClosed()
      .pipe(filter(Boolean))
      .subscribe((book: Book & { toDelete?: boolean }) => {
        if (book.toDelete) {
          this.dataSource.remove(book.index)
        } else {
          if (create) {
            this.dataSource.add(book)
          } else {
            this.dataSource.edit(book)
          }
        }
      })
  }
}

class BookDataSource extends DataSource<Book> {
  private _dataStream = new ReplaySubject<Book[]>()
  private booksList: Book[] = []

  constructor(initialData: Book[]) {
    super()
    this.booksList = initialData
    this.setData()
  }

  set data(data: Book[]) {
    this.booksList = data
    this.setData()
  }

  set filter(searchValue: string) {
    const filtered = this.booksList.filter(
      (book) =>
        book.name.trim().toLowerCase().includes(searchValue) || book.author.trim().toLowerCase().includes(searchValue),
    )
    this._dataStream.next(filtered)
  }

  get length() {
    return this.booksList.length
  }

  connect(): Observable<Book[]> {
    return this._dataStream
  }

  disconnect() {
    //
  }

  add(book: Book) {
    this.booksList.push(book)
    this.setData()
  }

  edit(book: Book) {
    this.booksList = this.booksList.map((x) => (book.index === x.index ? book : x))
    this.setData()
  }

  remove(index: number) {
    this.booksList.splice(
      this.booksList.findIndex((x) => x.index === index),
      1,
    )
    this.setData()
  }

  setData() {
    this._dataStream.next(this.booksList)
  }
}
