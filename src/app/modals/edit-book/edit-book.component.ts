import { Component, inject, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { provideNativeDateAdapter } from '@angular/material/core'
import { MatDatepickerModule } from '@angular/material/datepicker'
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'

import { Book } from '../../interfaces/book.interface'

type BookFormGroup = FormGroup & { value: Book }

@Component({
  selector: 'app-edit-book-dialog',
  templateUrl: 'edit-book-dialog.html',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDatepickerModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatIconModule
  ],
  providers: [provideNativeDateAdapter()],
})
export class EditBookDialogComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<EditBookDialogComponent>)
  readonly data = inject<Book>(MAT_DIALOG_DATA)
  readonly fb = inject(FormBuilder)

  form = this.fb.group({
    index: this.fb.nonNullable.control(''),
    author: this.fb.nonNullable.control('', {
      validators: [Validators.required],
    }),
    name: this.fb.nonNullable.control('', {
      validators: [Validators.required],
    }),
    created: this.fb.control(new Date()),
    about: this.fb.control(''),
  }) as BookFormGroup

  ngOnInit(): void {
    this.form.patchValue(this.data)
  }

  get name() {
    return this.form.get('name')
  }

  get author() {
    return this.form.get('author')
  }

  close(save: boolean): void {
    this.dialogRef.close(save ? this.form.value : null)
  }

  deleteBook(): void {
    this.dialogRef.close({...this.data, toDelete: true})
  }
}
