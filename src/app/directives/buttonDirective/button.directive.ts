import { Directive } from '@angular/core';

const main =
  'inline-flex justify-center items-center cursor-pointer bg-transparent text-blue-700 font-semibold py-2 px-4 border border-blue-500 hover:border-transparent rounded';
const hover = 'hover:bg-blue-500 hover:text-white hover:border-transparent';
const disabled =
  'disabled:bg-blue-500 disabled:text-white disabled:opacity-50 disabled:cursor-not-allowed';

@Directive({
  selector: '[appButton]',
  host: {
    class: `${main} ${hover} ${disabled}`,
  },
})
export class ButtonDirective {}
