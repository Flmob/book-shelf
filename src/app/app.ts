import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Header, GlobalModal } from './components';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, GlobalModal, Header],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
