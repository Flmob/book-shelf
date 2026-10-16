import { Component, inject, TemplateRef, viewChild } from '@angular/core';
import XMLBuilder from 'fast-xml-builder';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  heroArrowDownTray,
  heroArrowUpTray,
  heroMagnifyingGlassPlus,
  heroPlus,
  heroUsers,
} from '@ng-icons/heroicons/outline';

import { ButtonDirective } from '../../directives';

import { BookForm } from '../BookForm';
import { XmlForm } from '../XmlForm';

import { BooksService, ModalService } from '../../services';

const options = {
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
};
const builder = new XMLBuilder(options);

@Component({
  selector: 'app-header',
  templateUrl: 'header.html',
  imports: [BookForm, ButtonDirective, NgIcon, XmlForm],
  providers: [
    provideIcons({
      heroUsers,
      heroArrowDownTray,
      heroArrowUpTray,
      heroMagnifyingGlassPlus,
      heroPlus,
    }),
  ],
})
export class Header {
  addBookTemplate = viewChild<TemplateRef<unknown>>('addBookModalContent');
  importBooksTemplate = viewChild<TemplateRef<unknown>>('importBooksModalContent');

  booksService = inject(BooksService);
  modalService = inject(ModalService);

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

  exportBooks() {
    const xmlContent = builder.build({
      '?xml': {
        '@_version': '1.0',
        '@_encoding': 'UTF-8',
      },
      books: {
        book: this.booksService.books(),
      },
    });

    const blob = new Blob([xmlContent], { type: 'application/xml' });

    const link = document.createElement('a');

    link.href = URL.createObjectURL(blob);
    link.download = 'BooksShelf.xml';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(link.href);
  }
}
