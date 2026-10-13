import { Component, inject, input, viewChild } from '@angular/core';
import type { TemplateRef } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroBookOpen, heroPencil, heroTrash } from '@ng-icons/heroicons/outline';

import { BooksService, ModalService } from '../../services';
import type { Book, NewBook } from '../../services';
import { ButtonDirective } from '../../directives';
import { BookField } from './bookFiled.component';
import { BookForm } from '../BookForm';

@Component({
  selector: 'book-item',
  templateUrl: 'bookItem.html',
  imports: [NgIcon, ButtonDirective, BookField, BookForm],
  providers: [provideIcons({ heroBookOpen, heroPencil, heroTrash })],
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
})
export class BookItem {
  editBookTemplate = viewChild<TemplateRef<unknown>>('editBookModalContent');
  deleteBookTemplate = viewChild<TemplateRef<unknown>>('deleteBookModalContent');

  modalService = inject(ModalService);
  booksService = inject(BooksService);

  book = input.required<NewBook>();
  viewOnly = input<boolean>(false);

  openEditModal() {
    this.modalService.open({
      title: 'Edit Book',
      content: this.editBookTemplate()!,
    });
  }

  openDeleteModal() {
    this.modalService.open({
      title: 'Delete Book',
      content: this.deleteBookTemplate()!,
      height: 'sm',
    });
  }

  deleteBook() {
    this.booksService.deleteBook(this.book() as Book);
    this.modalService.close();
  }
}
