import { Component } from '@angular/core';

import rawData from '../../data.json';
import { Cv } from './cv';
import { CvMaker } from './cv-maker';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
	data :Cv = rawData;
	cvMaker :CvMaker

	constructor() {
		this.cvMaker = new CvMaker(this.data);
		this.cvMaker.generate(); //initiliaze
	}
}
