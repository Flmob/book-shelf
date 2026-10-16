import { TestBed } from '@angular/core/testing';

import { ModalData, ModalService } from './modal.service';

describe('ModalService', () => {
  let service: ModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should open modal with data', () => {
    const modalData: ModalData = { content: 'Test content', height: 'sm' };
    service.open(modalData);

    expect(service.isOpen()).toBeTruthy();
    expect(service.modalData()).toEqual(modalData);
  });

  it('should close modal and delete data', () => {
    service.close();

    expect(service.isOpen()).toBeFalsy();
    expect(service.modalData()).toEqual(null);
  });
});
