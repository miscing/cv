import { Component } from '@angular/core';

import rawData from './data.json';
import { Cv } from './cv';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
	data :Cv = rawData;
	constructor() {
	}
}
