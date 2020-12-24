import { Input, Component, OnInit } from '@angular/core';

import { Moment, SimpleDate } from '../cv';

@Component({
	selector: 'app-timeline',
	templateUrl: './timeline.component.html',
	styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit {
	@Input() moments :Moment[];
	// gridStyles :StyleValue;

	constructor() { }

	ngOnInit(): void {
		this.moments.sort(compareMoments);
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
		for(let i=this.moments.length-1;i>=0;i--) {
			if (i%2 !== 0) {
				this.moments.splice(i, 0, null, null);
			}
		}
		this.moments.splice(this.moments.length, 0, null); // add the line of final box
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
