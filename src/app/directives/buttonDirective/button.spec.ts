import { ButtonDirective } from './button.directive';

describe('Button', () => {
  let directive: ButtonDirective;

  beforeEach(() => {
    directive = new ButtonDirective();
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });
});
