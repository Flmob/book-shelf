import { Service, signal, TemplateRef } from '@angular/core';

export interface ModalData {
  title?: string;
  content: string | TemplateRef<unknown>;
  height?: 'sm' | 'md' | 'lg';
  onClose?: () => void;
}

@Service()
export class ModalService {
  isOpen = signal<boolean>(false);
  modalData = signal<ModalData | null>(null);

  open(data: ModalData) {
    this.modalData.set({ ...data, height: data.height || 'md' });
    this.isOpen.set(true);
  }

  close() {
    this.isOpen.set(false);
    this.modalData.set(null);
  }
}
