import { Component, inject, TemplateRef } from '@angular/core';
import { NgClass, NgTemplateOutlet } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroXMark } from '@ng-icons/heroicons/outline';

import { ModalService } from '../../services';
import { ButtonDirective } from '../../directives';

@Component({
  selector: 'global-modal',
  templateUrl: 'globalModal.html',
  imports: [ButtonDirective, NgClass, NgIcon, NgTemplateOutlet],
  providers: [provideIcons({ heroXMark })],
})
export class GlobalModal {
  modalService = inject(ModalService);

  isTemplate(value: any): boolean {
    return value instanceof TemplateRef;
  }

  asTemplate(value: any): TemplateRef<any> {
    return value as TemplateRef<any>;
  }
}
