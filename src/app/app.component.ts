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

import { Component } from '@angular/core';

import rawData from '../../cv.json';
import { Cv } from './cv';
import { CvMaker } from './cv-maker';

const letterHeight = 279.4 // mm, default pdf size is letter, aka freedom units
const a4Height = 297 // mm, non-retard units

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
	data :Cv;

	constructor() {
		this.data = new CvMaker(rawData, true); //initiliaze

		// todo: use letter height for freedom browsers
			document.addEventListener('DOMContentLoaded', addWhitespaceToPreventPdfPrintCutoff);
	}

}

function addWhitespaceToPreventPdfPrintCutoff() {
	console.log('hello');
	// todo: replace with getElementByClass and give each element that should be protected a specific class
	let matCards = document.getElementsByTagName('mat-card');
	for (let i=0;i<matCards.length;i++) {
		if (withinBounds(matCards[i])) {
			console.log(matCards[i].getElementsByTagName('mat-card-title')[0].textContent);
			let whitespace = document.createElement("div");
			whitespace.style.height = "100px";
			matCards[i].parentNode.insertBefore(whitespace, matCards[i]);
			// return
		}
	}
}

function withinBounds(element :Element) :boolean {
	const topOffset = pxToMm(element.getBoundingClientRect().top + window.pageYOffset);
	const bottomOffset = pxToMm(element.getBoundingClientRect().bottom + window.pageYOffset);
	const normalizer = Math.floor(topOffset / a4Height) + 1;
	if (topOffset/normalizer < a4Height && a4Height < bottomOffset/normalizer) {
		return true;
	} else {
		return false;
	}
}

function pxToMm(px :number) :number {
	// return ((px * 25.4) / 96);
	return px * (1 / 3.78);
}
