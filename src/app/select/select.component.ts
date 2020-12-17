import { EventEmitter, Output, Input, Component, OnInit } from '@angular/core';

import { Cv } from '../cv';
import { CvMask } from '../cv-mask';

const tops :string[] = [
	"profile",
	"about",
	"skills",
]

@Component({
	selector: 'app-select',
	templateUrl: './select.component.html',
	styleUrls: ['./select.component.scss']
})
export class SelectComponent implements OnInit {
	@Input() cv :Cv;
	@Output() mask = new EventEmitter<CvMask>();
	checkboxes :TopLevel[];

	constructor() {
		this.checkboxes = [];
	}

	// this is necessary to guarantee order of top level items
	ngOnInit(): void {
		tops.forEach( name => {
			let topLevel = new TopLevel(name);
			topLevel.children = this.getChildren(name);
			this.checkboxes.push(topLevel);
		});
	}

	getChildren(topField :string) :CvField[] {
		let result = [];
		let mask = [topField];
		for(const field in this.cv) {
			if (field === topField) {
				if (Array.isArray(this.cv[field])) {
					result.push(...makeCvField(this.cv[field], mask));
				} else {
					for(const child in this.cv[field]) {
						if (Array.isArray(this.cv[field][child])) {
								result.push(...makeCvField(this.cv[field][child], mask.concat(child)));
						}
					}
				}
				return result;
			}
		}
		return null;
	}

	emitMask(mask :any[], add :boolean) :void {
		this.mask.emit(new CvMask(mask, add));
	}
}

function makeCvField(arr :any[], mask :any[]) :CvField[] {
	let result = [];
	arr.forEach( (child :any, i :number) => {
		if (child.hasOwnProperty("name")){
			result.push(new CvField(child.name, mask.concat(i)));
		} else if(child.hasOwnProperty("key")) {
			result.push(new CvField(child.key, mask.concat(i)));
		} else {
			result.push(new CvField(String(i), mask.concat(i)));
		}
	});
	return result;
}

class CvField {
	name :string;
	selected :boolean;
	mask :any[];
	constructor(name :string, mask? :any[]) {
		this.name = name;
		this.selected = true;
		if (mask) {
			this.mask = mask;
		}
	}

	toggle(val :boolean) :void {
		this.selected = val;
	}
}

class TopLevel extends CvField {
	children? :CvField[];
	constructor(name :string) {
		super(name);
	}

	updateAllCompleted() :void {
		if(this.children == null) {
			return;
		}
		this.selected = this.children.every(c => c.selected);
	}

	someSelected() :boolean {
		if(this.children == null) {
			return false;
		}
		return this.children.filter(c => c.selected).length > 0 && !this.selected;
	}

	setAll(completed :boolean) :void {
		this.selected = completed;
		if(this.children == null) {
			return;
		}
		this.children.forEach(c => c.selected = completed);
	}
}
