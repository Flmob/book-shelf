import { Component, effect, inject } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroChevronDown, heroChevronUp, heroMinus, heroXMark } from '@ng-icons/heroicons/outline';
import { ReactiveFormsModule } from '@angular/forms';
import { debounce, form, FormField, FormRoot, maxLength, submit } from '@angular/forms/signals';

import { ButtonDirective } from '../../directives';
import { BooksService } from '../../services';

@Component({
  selector: 'search-form',
  templateUrl: 'searchForm.html',
  imports: [ButtonDirective, FormField, FormRoot, NgIcon, ReactiveFormsModule],
  providers: [provideIcons({ heroChevronDown, heroChevronUp, heroMinus, heroXMark })],
})
export class SearchForm {
  booksService = inject(BooksService);

  queryForm = form(this.booksService.query, (schemaPath) => {
    // debounce(schemaPath.search, 400);
    maxLength(schemaPath.search, 30);
  });

  onSortDirectionBtnClick(event: Event) {
    event.preventDefault();

    this.booksService.query.set({
      ...this.booksService.query(),
      direction: this.booksService.query().direction
        ? this.booksService.query().direction === 'asc'
          ? 'desc'
          : null
        : 'asc',
    });
  }

  onClearBtnClick(event: Event) {
    event.preventDefault();

    this.booksService.query.set({
      ...this.booksService.query(),
      search: '',
      direction: null,
    });
  }

  constructor() {
    effect((onCleanup) => {
      const currentValue = this.booksService.query();

      const timeoutId = setTimeout(() => {
        this.booksService.getBooks();
      }, 400);

      onCleanup(() => clearTimeout(timeoutId));
    });
  }
}
