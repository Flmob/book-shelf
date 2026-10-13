import { Component, inject, signal, viewChild } from '@angular/core';
import type { TemplateRef } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroArrowPathRoundedSquare, heroFolderOpen } from '@ng-icons/heroicons/outline';

import { BooksService, ModalService } from '../../services';

import { BookItem } from '../BookItem';
import { BookForm } from '../BookForm';
import { XmlForm } from '../XmlForm';

import { ButtonDirective } from '../../directives';

@Component({
  selector: 'books',
  templateUrl: 'books.html',
  imports: [BookItem, BookForm, NgIcon, ButtonDirective, XmlForm],
  providers: [provideIcons({ heroArrowPathRoundedSquare, heroFolderOpen })],
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
})
export class Books {
  addBookTemplate = viewChild<TemplateRef<unknown>>('addBookModalContent');
  importBooksTemplate = viewChild<TemplateRef<unknown>>('importBooksModalContent');

  modalService = inject(ModalService);
  booksService = inject(BooksService);

  async ngOnInit() {
    await this.booksService.initData();
  }

  openAddModal() {
    this.modalService.open({
      title: 'Add Book',
      content: this.addBookTemplate()!,
    });
  }

  openImportModal() {
    this.modalService.open({
      title: 'Import Books',
      content: this.importBooksTemplate()!,
      height: 'lg',
    });
  }
}
