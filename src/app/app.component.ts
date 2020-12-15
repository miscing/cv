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

import { Renderer2, AfterViewInit, Component } from '@angular/core';

import rawData from '../../cv.json';
import { Cv } from './cv';
import { CvMaker } from './cv-maker';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
	data :Cv;

	constructor(private renderer :Renderer2) {
		this.data = new CvMaker(rawData, true); //initiliaze
	}

	ngAfterViewInit() {
		// TODO: use letter height for freedom browsers
		this.addPageBreaks();
	}


	addPageBreaks() :void {
		let elements = document.getElementsByClassName('protected');
		let modifier = 0;
		for (let i=0;i<elements.length;i++) {
			console.log(elements[i]);
			let eFitter = new elementPdfFitter(elements[i], modifier);
			if (eFitter.withinBounds()) {
				console.log(elements[i].getElementsByTagName('mat-card-title')[0].textContent);
				this.renderer.setStyle(elements[i], "page-break-before", "always");
				// the number at the end is to account for 1cm margins
				// modifier += eFitter.distanceToNextPage()+20;
				modifier += eFitter.distanceToNextPage()+10;
			}
		}
	}

}



const letterHeight = 279.4 // mm, freedom units
const a4Height = 297 // mm, non-freedom units

// checks whether element fits into pdf pages
// default is a4, use options for US letter
class elementPdfFitter {
	topOffset :number;
	bottomOffset :number;
	normalizer :number;
	height :number

	// modifier is given in millimeters
	constructor(element :Element, modifier :number = 0, usLetter? :boolean) {
		if (usLetter) {
			this.height = letterHeight;
		} else {
			this.height = a4Height;
		}
		// this.topOffset = pxToMm(element.getBoundingClientRect().top + window.pageYOffset);
		// this.bottomOffset = pxToMm(element.getBoundingClientRect().bottom + window.pageYOffset);
		this.topOffset = pxToMm(element.getBoundingClientRect().top + window.pageYOffset) + modifier;
		this.bottomOffset = pxToMm(element.getBoundingClientRect().bottom + window.pageYOffset) + modifier;
		this.normalizer = Math.floor(this.topOffset / this.height)+1;
	}

	// does element coincide with a page break
	withinBounds() :boolean {
			// console.log(this.topOffset/this.normalizer ,this.height ,this.bottomOffset/this.normalizer);
		if (this.topOffset/this.normalizer < this.height && this.height < this.bottomOffset/this.normalizer) {
		// the 10 are for 1cm top and bottom margin
		// if (this.topOffset/this.normalizer < (this.height - 10) && (this.height + 10)< this.bottomOffset/this.normalizer) {
			return true;
		} else {
			return false;
		}
	}

	// mm response
	distanceToNextPage() :number {
		return this.height - (this.topOffset/this.normalizer);
	}

	// distanceToNextPage() :string {
	// 	return mmToPx(this.height - (this.topOffset/this.normalizer)).toString()+"px";
	// }

}

function mmToPx(mm :number) :number {
	return mm * 3.78;
}

function pxToMm(px :number) :number {
	// return ((px * 25.4) / 96);
	return px * (1 / 3.78);
}
