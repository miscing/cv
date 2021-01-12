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

import { OnChanges, Input, Component  } from '@angular/core';

import { Moment, SimpleDate } from '../cv';

@Component({
	selector: 'app-timeline',
	templateUrl: './timeline.component.html',
	styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnChanges {
	@Input() moments :Moment[];
	entries :Moment[]

	constructor() { }

	ngOnChanges(): void {
		this.entries = this.moments.slice();
		this.entries.sort(compareMoments);
		this.addBlankGrids(); //this hack allows auto filling grid
	}

	Timespan(m :Moment) :string {
		if (m.present) {
			return this.DateAsString(m.start)+"-"+"Present";
		}
		return this.DateAsString(m.start)+"-"+this.DateAsString(m.end);
	}

	DateAsString(date :SimpleDate) {
		return date.month+"/"+date.year;
	}

	addBlankGrids() :void {
		for(let i=this.entries.length-1;i>=0;i--) {
			if (i%2 !== 0) {
				this.entries.splice(i, 0, null, null);
			}
		}
		if (this.entries.length%2 !== 0) {
			this.entries.splice(this.entries.length, 0, null); // add the line of final box
		}
	}

	isLeft(i :number) :boolean {
		if (everyOtherGrouper(i) > 0) {
			return true;
		}
		return false;
	}
}

function everyOtherGrouper(i :number) :number {
	return Math.cos((Math.PI/2)*(i-0.5));
}

function compareMoments(a :Moment, b :Moment) :number {
	if (!a || !b) {
		return 0;
	}
	if (a.start.year < b.start.year) {
		return -1;
	} else if (a.start.year > b.start.year) {
		return 1;
	} else {
		if (a.start.month < b.start.month) {
			return -1;
		} else if (a.start.month > b.start.month) {
			return 1;
		} else {
			return 0
		}
	}
}
