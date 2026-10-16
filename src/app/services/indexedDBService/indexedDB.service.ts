import { EventEmitter, Injectable } from '@angular/core';

export type SortDirection = 'asc' | 'desc';
export interface SearchOptions {
  search: string;
  direction?: SortDirection | null;
}
@Injectable({
  providedIn: 'root',
})
export class IndexedDBService {
  private dbName = 'BooksShelf';
  private storeName = 'books';
  private searchIndex = 'author_and_title';
  private db!: IDBDatabase;

  onDbInit = new EventEmitter();
  onDbInitError = new EventEmitter();

  constructor() {
    this.initDB();
  }

  initDB() {
    const request = indexedDB.open(this.dbName, 1);

    request.onupgradeneeded = (event: any) => {
      this.db = event.target.result;
      if (!this.db.objectStoreNames.contains(this.storeName)) {
        const store = this.db.createObjectStore(this.storeName, {
          keyPath: 'id',
          autoIncrement: true,
        });

        store.createIndex(this.searchIndex, ['author', 'title']);
      }
    };

    request.onsuccess = (event: any) => {
      this.db = event.target.result;
      console.log('Database initialized successfully');
      this.onDbInit.emit();
    };
    request.onerror = (event) => {
      console.error('Error initializing database:', (event.target as IDBOpenDBRequest).error);
      this.onDbInitError.emit();
    };
  }

  addData(data: any): Promise<number> {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(this.storeName, 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.add(data);
      request.onsuccess = () => resolve(request.result as number);
      request.onerror = () => reject(request.error);
    });
  }

  getData(options?: SearchOptions): Promise<any[]> {
    const { search = null, direction } = options || {};

    // cursorQuery is not efficient, so we will use getAll if we can
    if (!search && !direction) {
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction(this.storeName, 'readonly');
        const store = transaction.objectStore(this.storeName);
        const request = store.getAll();

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    }

    const searchStr = search ? search.toLowerCase() : null;

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(this.storeName, 'readonly');
      const store = transaction.objectStore(this.storeName);
      const index = store.index(this.searchIndex);
      const cursorQuery = index.openCursor(null, direction === 'desc' ? 'prev' : 'next');

      const result: Record<string, any>[] = [];

      cursorQuery.onsuccess = (event: Event) => {
        const target = event.target as IDBRequest<IDBCursorWithValue | null>;
        const cursor = target.result;

        if (cursor) {
          const value = cursor.value;
          if (!searchStr) result.push(value);

          const author = (value.author || '').toLowerCase();
          const title = (value.title || '').toLowerCase();

          if (author.includes(searchStr) || title.includes(searchStr)) {
            result.push(value);
          }

          cursor.continue();
        } else {
          resolve(result);
        }
      };
      cursorQuery.onerror = () => {
        reject(cursorQuery.error);
      };
    });
  }

  deleteAllData(): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(this.storeName, 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.clear();
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  updateData(data: any): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(this.storeName, 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.put(data);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  deleteData(id: number | string): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(this.storeName, 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}
