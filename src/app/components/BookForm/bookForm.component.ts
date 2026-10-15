import { Component, input, output, linkedSignal, signal, inject } from '@angular/core';
import { form, FormField, FormRoot, disabled, required, min } from '@angular/forms/signals';

import type { Book, NewBook } from '../../services';
import { BooksService } from '../../services';
import { AutofocusDirective, ButtonDirective } from '../../directives';

const defaultBookValues: Book = {
  id: '',
  title: '',
  author: '',
  pages: 0,
};

@Component({
  selector: 'book-form',
  templateUrl: 'bookForm.html',
  imports: [AutofocusDirective, ButtonDirective, FormField, FormRoot],
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
})
export class BookForm {
  initialValues = input<Book | NewBook>();
  onFormSubmit = output<void>();

  booksService = inject(BooksService);

  private readonly bookModel = linkedSignal<Book | NewBook | undefined, Book>({
    source: this.initialValues,
    computation: (values) => {
      if (!values) return defaultBookValues;

      if (!values.id) values.id = '';

      return values as Book;
    },
  });

  bookForm = form(
    this.bookModel,
    (schemaPath) => {
      // required(schemaPath.id, { message: 'This field is required' });
      required(schemaPath.title, { message: 'This field is required' });
      required(schemaPath.author, { message: 'This field is required' });
      required(schemaPath.pages, { message: 'This field is required' });

      disabled(schemaPath.id);
      //readonly(schemaPath.id);

      min(schemaPath.pages, 0, { message: 'Not enough pages' });
    },
    {
      submission: {
        action: async (newModel) => {
          const bookData = newModel().value();

          if (!bookData.id) this.booksService.addBook(bookData);
          else this.booksService.editBook(bookData);

          this.onFormSubmit.emit();
        },
      },
    },
  );
}
