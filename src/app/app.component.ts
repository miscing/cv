//
// Copyright 2020 Alexander Saastamoinen
//
//  Licensed under the EUPL, Version 1.2 or – as soon they
// will be approved by the European Commission - subsequent
// versions of the EUPL (the "Licence");
//  You may not use this work except in compliance with the
// Licence.
//  You may obtain a copy of the Licence at:
//
//  https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12
//
//  Unless required by applicable law or agreed to in
// writing, software distributed under the Licence is
// distributed on an "AS IS" basis,
//  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
// express or implied.
//  See the Licence for the specific language governing
// permissions and limitations under the Licence.
//

import { AfterViewChecked, Component } from '@angular/core';

import { Renderer2 } from '@angular/core';

import { Observable } from 'rxjs';

import rawData from '../../cv.json';
import { Cv } from './cv';
import { CvMaker } from './cv-maker';

const a4Height = 297; //in millimeters

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewChecked {
	data :Observable<Cv>;
	maker :CvMaker;

	constructor(private renderer :Renderer2) {
		// second argument is optional, true to use mock data
		this.maker = new CvMaker(rawData, true); //initiliaze
		this.data = this.maker.Output();
	}

	ngAfterViewChecked() {
		this.pageBreakFromPage(20);
	}

	// inserts a page break to element if within distanceMM of end of a4
	pageBreakFromPage(distanceMM :number) :void {
		let els = document.getElementsByClassName("avoid-page-end");
		for(let i=0; i<els.length;i++) {
			const botOffset = pxToMm(els[i].getBoundingClientRect().bottom + window.pageYOffset);
			const normalizer = Math.floor(botOffset / a4Height) + 1
			if( Math.abs(botOffset*normalizer - a4Height) <= distanceMM) {
				this.renderer.setStyle(els[i], "page-break-before", "always");
			}
		}
	}
}

function pxToMm(px :number) :number {
	return px/3.78
}
