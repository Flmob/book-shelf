import { Component, signal } from '@angular/core';

import { XmlViewer } from '../XmlViewer';
import { FileInput } from '../FileInput';

@Component({
  selector: 'xml-form',
  templateUrl: 'xmlForm.html',
  imports: [FileInput, XmlViewer],
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
})
export class XmlForm {
  xmlFile = signal<File | null>(null);
  xmlString = signal<string>('');

  async setXmlString(xmlFile: File | null) {
    if (!xmlFile) return;

    try {
      const xmlContent = await xmlFile.text();
      this.xmlString.set(xmlContent);
    } catch (error) {
      console.error('Error while reading XML. file', error);
      alert('Something went wrong :(');
    }
  }

  onFiles(files: File[]) {
    if (files.length === 0) return;

    this.xmlFile.set(files[0]);
    this.setXmlString(files[0]);
  }

  onFileChancel() {
    this.xmlFile.set(null);
    this.xmlString.set('');
  }
}
