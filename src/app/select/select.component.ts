import { Input, Component, OnInit } from '@angular/core';

import { Cv, Skill } from '../cv';

class CvField {
	name :string;
	selected :boolean;
	constructor(name :string) {
		this.name = name;
		this.selected = true;
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
		for(const field in this.cv) {
			if (field === topField) {
				if (Array.isArray(this.cv[field])) {
					this.cv[field].forEach( (child :any, i :number) => {
						if (child.hasOwnProperty("name")){
							result.push(new CvField(child.name));
						} else {
							result.push(new CvField(String(i)));
						}
					});
				} else {
					for(const child in this.cv[field]) {
						if (Array.isArray(this.cv[field][child])) {
							this.cv[field][child].forEach( (child :any, i :number) => {
								if (child.hasOwnProperty("name")){
									result.push(new CvField(child.name));
								} else if(child.hasOwnProperty("key")) {
									result.push(new CvField(child.key));
								} else {
									result.push(new CvField(String(i)));
								}
							});
						}
					}
				}
				return result;
			}
		}
		return null;
	}
}
