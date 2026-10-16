import 'fake-indexeddb/auto';
import { TestBed } from '@angular/core/testing';

import { IndexedDBService } from './indexedDB.service';
import type { Book } from '../booksService';

describe('IndexedDB Service', () => {
  let service: IndexedDBService;

  beforeEach(async () => {
    await new Promise((resolve) => {
      const req = indexedDB.deleteDatabase('books');
      req.onsuccess = resolve;
      req.onerror = resolve;
    });

    TestBed.configureTestingModule({});
    service = TestBed.inject(IndexedDBService);

    await new Promise<void>((resolve) => {
      service.onDbInit.subscribe(async () => {
        resolve();
      });

      service.onDbInitError.subscribe(() => {
        resolve();
      });
    });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create, edit and delete book', async () => {
    const testBook: Book = {
      id: '0',
      title: '01',
      author: '001',
      pages: 10,
    };
    const newTitle: Book['title'] = '02';

    let data: Book[] = [];

    await service.addData(testBook);
    data = await service.getData();

    expect(data.length).toBe(1);
    expect(data[0]).toEqual(testBook);

    await service.updateData({ ...testBook, title: newTitle });
    data = await service.getData();

    expect(data.length).toBe(1);
    expect(data[0].title).toBe(newTitle);

    await service.deleteData(testBook.id);
    data = await service.getData();

    expect(data.length).toBe(0);
  });
});
