import { Component, inject, input, output, signal } from '@angular/core';
import { XMLParser } from 'fast-xml-parser';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroArrowPathRoundedSquare, heroFolderOpen } from '@ng-icons/heroicons/outline';

import { BookItem } from '../BookItem';
import { ButtonDirective } from '../../directives';
import { findNestedValue, getId } from '../../helpers';

import { ModalService } from '../../services';
import { BooksService } from '../../services';
import type { NewBook } from '../../services';

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '',
  parseAttributeValue: true,
});

@Component({
  selector: 'xml-viewer',
  templateUrl: 'xmlViewer.html',
  imports: [BookItem, NgIcon, ButtonDirective],
  providers: [provideIcons({ heroArrowPathRoundedSquare, heroFolderOpen })],
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
})
export class XmlViewer {
  xml = input<string>('');
  onChancel = output<void>();

  xmlBooks = signal<NewBook[]>([]);

  booksService = inject(BooksService);
  modalService = inject(ModalService);

  ngOnChanges() {
    const result = xmlParser.parse(this.xml());
    let books: Array<unknown> = findNestedValue(result, 'book') || [];
    if (books && Array.isArray(books) && books.length! > 0) {
      const newBooks: NewBook[] = books
        .map((book: any) => {
          if (!book || typeof book !== 'object' || Array.isArray(book) || book == null) {
            return;
          }

          const newBook: NewBook = {
            id: getId(),
            title: book.title || '',
            author: book.author || '',
            pages: book.pages || 0,
          };

          return newBook;
        })
        .filter((book) => !!book && !!book?.title && !!book?.author) as NewBook[];
      this.xmlBooks.set(newBooks);
    }
  }

  async importBooks(replace?: boolean) {
    let deleteAll = false;

    if (replace) {
      deleteAll = confirm('Are you sure you want to delete all previous books before import?');
    }

    if (deleteAll) {
      await this.booksService.deleteAllBooks();
    }
    await this.booksService.addBooks(this.xmlBooks());
    
    this.booksService.getBooks();

    this.modalService.close();
  }
}
