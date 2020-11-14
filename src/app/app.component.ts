import { Component } from '@angular/core';

import { Observable } from 'rxjs';

import rawData from '../../cv.json';
import { Cv } from './cv';
import { CvMaker } from './cv-maker';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
	data :Observable<Cv>;
	cvMaker :CvMaker //maybe remove from here, making it inaccessable outside constructor?

	constructor() {
		this.cvMaker = new CvMaker(rawData);
		this.data = this.cvMaker.generate(); //initiliaze
	}
}
