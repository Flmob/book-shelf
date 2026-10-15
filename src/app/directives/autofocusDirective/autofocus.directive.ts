import { Directive, ElementRef, inject, OnInit } from '@angular/core';

@Directive({
  selector: '[appAutofocus]',
})
export class AutofocusDirective implements OnInit {
  private el = inject(ElementRef);

  ngOnInit(): void {
    this.el.nativeElement.focus();
  }
}
