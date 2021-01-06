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

import { OnInit, AfterViewInit, Component } from '@angular/core';

import { Renderer2 } from '@angular/core';

import { Observable } from 'rxjs';

import { Cv } from './cv';
import { CvMakerService } from './cv-maker.service';

const a4Height = 297; //in millimeters

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
	data :Observable<Cv>;

	constructor(private renderer :Renderer2, public maker :CvMakerService) {
	}

	ngOnInit() :void {
		// second argument is optional, true to use mock data
		this.maker.Initialize(); //initiliaze
		// this.maker.Initialize({mock: true}); // with mock data
		// this.maker.Initialize({store:true}); // download github data as file
		this.data = this.maker.Output();
	}

	ngAfterViewInit() {
		const distanceToPutInNewPage = 50; // mm
		this.pageBreakFromPage(distanceToPutInNewPage);
		this.data.subscribe( () => this.pageBreakFromPage(distanceToPutInNewPage));
	}

	// inserts a page break to element if within distanceMM of end of a4
	pageBreakFromPage(distanceMM :number) :void {
		let els = document.getElementsByClassName("avoid-page-end");
		for(let i=0; i<els.length;i++) {
			const botOffset = pxToMm(els[i].getBoundingClientRect().bottom + window.pageYOffset);
			const normalizer = Math.floor(botOffset / a4Height) + 1
			if( Math.abs(botOffset*normalizer - a4Height) <= distanceMM) {
				// console.log("Moving element: '"+els[i].innerHTML+"' to next pdf page, so it is not the last element of the page");
				this.renderer.setStyle(els[i], "page-break-before", "always");
			} else {
				this.renderer.removeStyle(els[i], "page-break-before");
			}
		}
	}
}

function pxToMm(px :number) :number {
	return px/3.78
}
