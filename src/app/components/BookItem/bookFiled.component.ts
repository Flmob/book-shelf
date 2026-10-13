import { Component, input } from '@angular/core';

@Component({
  selector: 'book-field',
  templateUrl: 'bookField.html',
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
})
export class BookField {
  name = input.required<string>();
  value = input<string | number | null>();
}
