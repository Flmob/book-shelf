import 'fake-indexeddb/auto';
import { TestBed } from '@angular/core/testing';

import type { Book } from './books.service';
import { BooksService } from './books.service';

describe('Books Service', () => {
  let service: BooksService;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [BooksService],
    });
    service = TestBed.inject(BooksService);
    await service.initData();
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

    await service.addBook(testBook);
    await service.getBooks();

    expect(service.books().length).toBe(1);
    expect(service.books()[0]).toEqual(testBook);

    await service.editBook({ ...testBook, title: newTitle });
    await service.getBooks();

    expect(service.books().length).toBe(1);
    expect(service.books()[0].title).toBe(newTitle);

    await service.deleteBook(testBook);
    await service.getBooks();

    expect(service.books().length).toBe(0);
  });
});
