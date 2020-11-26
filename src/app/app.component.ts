import { Component } from '@angular/core';

import rawData from '../../cv.json';
import { Cv } from './cv';
import { CvMaker } from './cv-maker';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
	data :Cv;

	constructor() {
		this.data = new CvMaker(rawData, true); //initiliaze
	}
}
