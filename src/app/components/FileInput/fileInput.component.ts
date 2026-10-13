import { Component, signal, output } from '@angular/core';
import { NgClass } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroDocumentArrowDown } from '@ng-icons/heroicons/outline';

import { ButtonDirective } from '../../directives';

@Component({
  selector: 'file-input',
  templateUrl: 'fileInput.html',
  imports: [ButtonDirective, NgClass, NgIcon],
  providers: [provideIcons({ heroDocumentArrowDown })],
})
export class FileInput {
  onFilesSelect = output<File[]>();

  isDragging = signal<boolean>(false);

  onDragOver(event: Event) {
    event.preventDefault();
    this.isDragging.set(true);
  }

  onDragLeave(event: Event) {
    event.preventDefault();
    this.isDragging.set(false);
  }

  onDropped(event: Event) {
    event.preventDefault();
    const dragEvent = event as DragEvent;

    this.isDragging.set(false);

    const files = dragEvent.dataTransfer?.files ? Array.from(dragEvent.dataTransfer!.files) : [];

    if (files.length === 0) {
      return;
    }

    if (files.length > 1) {
      console.warn('More than one file dropped. You cannot do that, dammit!!!');
      alert('Only one file is allowed');
      return;
    }

    this.onFilesSelect.emit(files);
  }

  onSelected(event: Event) {
    const target = event.target as HTMLInputElement;

    const files = target.files ? Array.from(target.files) : [];

    if (files.length === 0) {
      return;
    }

    this.onFilesSelect.emit(Array.from(files));
  }
}
