import { TestBed } from '@angular/core/testing';
import { ElementRef } from '@angular/core';

import { AutofocusDirective } from './autofocus.directive';

class MockElementRef extends ElementRef {
  constructor() {
    super(document.createElement('div'));
  }
}

describe('Autofocus', () => {
  let directive: AutofocusDirective;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AutofocusDirective, { provide: ElementRef, useClass: MockElementRef }],
    });
    directive = TestBed.inject(AutofocusDirective);
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });
});
