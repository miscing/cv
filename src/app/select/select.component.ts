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

import { EventEmitter, Output, Input, Component, OnInit } from '@angular/core';

import { Cv } from '../cv';
import { CvMask } from '../cv-mask';

const tops :string[] = [
	"profile",
	"about",
	"timeline",
	"skills"
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

	emitMasks(par :TopLevel) :void {
		this.emitMask([par.name], !par.selected);
		par.children.forEach( child => {
			this.emitMask(child.mask, !child.selected);
		});
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
