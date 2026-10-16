import { IndexedDBService, SearchOptions } from '../indexedDBService';
import { inject, Injectable, signal } from '@angular/core';

import { getId } from '../../helpers';

export interface Book {
  id: string;
  title: string;
  author: string;
  pages: number;
}

export interface NewBook extends Omit<Book, 'id'> {
  id?: string;
}

@Injectable({
  providedIn: 'root',
})
export class BooksService {
  indexedDBService = inject(IndexedDBService);

  books = signal<Book[]>([]);
  readonly query = signal<SearchOptions>({
    search: '',
  });

  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  async initData() {
    this.isLoading.set(true);
    this.error.set(null);

    return new Promise<void>((resolve, reject) => {
      this.indexedDBService.onDbInit.subscribe(async () => {
        resolve();
      });

      this.indexedDBService.onDbInitError.subscribe(() => {
        this.isLoading.set(false);
        this.error.set('Something went wrong during indexDB initialization');
        reject();
      });
    });
  }

  async getBooks(): Promise<void> {
    this.isLoading.set(true);
    this.error.set(null);

    try {
      const newBooks = await this.indexedDBService.getData(this.query());
      this.books.set(newBooks);
    } catch (error: unknown) {
      console.error(error);
      this.error.set('Something went wrong!');
    } finally {
      this.isLoading.set(false);
    }
  }

  async addBook(book: NewBook): Promise<void> {
    this.isLoading.set(true);
    this.error.set(null);

    try {
      await this.indexedDBService.addData({ ...book, id: book.id || getId() });
    } catch (error: unknown) {
      console.error(error);
      this.error.set('Something went wrong!');
    } finally {
      this.isLoading.set(false);
    }
  }

  async addBooks(books: NewBook[]) {
    this.isLoading.set(true);
    this.error.set(null);

    try {
      await Promise.allSettled(
        books.map(async (book) => {
          this.indexedDBService.addData({ ...book, id: book.id || getId() });
        }),
      );
    } catch (error: unknown) {
      console.error(error);
      this.error.set('Something went wrong!');
    } finally {
      this.isLoading.set(false);
    }
  }

  async deleteAllBooks() {
    this.isLoading.set(true);
    this.error.set(null);

    try {
      await this.indexedDBService.deleteAllData();
    } catch (error: unknown) {
      console.error(error);
      this.error.set('Something went wrong!');
    } finally {
      this.isLoading.set(false);
    }
  }

  async deleteBook(book: Book): Promise<void> {
    this.isLoading.set(true);
    this.error.set(null);

    try {
      await this.indexedDBService.deleteData(book.id);
    } catch (error: unknown) {
      console.error(error);
      this.error.set('Something went wrong!');
    } finally {
      this.isLoading.set(false);
    }
  }

  async editBook(book: Book): Promise<void> {
    this.isLoading.set(true);
    this.error.set(null);

    try {
      await this.indexedDBService.updateData(book);
    } catch (error: unknown) {
      console.error(error);
      this.error.set('Something went wrong!');
    } finally {
      this.isLoading.set(false);
    }
  }
}
