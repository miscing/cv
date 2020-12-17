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

import { Input, Component, OnInit } from '@angular/core';

import { Skill } from '../cv';

@Component({
	selector: 'app-skills',
	templateUrl: './skills.component.html',
	styleUrls: ['./skills.component.scss']
})
export class SkillsComponent implements OnInit {
	@Input() skills :Skill[];

	constructor() { }

	ngOnInit(): void {
	}

	urlify(raw :string) :string {
		let url = new URL(raw);
		return url.hostname+url.pathname;
	}

	capitalize(input: string): string {
		if (input.includes("/")) {
			// capitalize each item seperated by '/'
			return input.split('/').map( str => this.simpleCapitalize(str)).join("/");
		} else {
			return this.simpleCapitalize(input);
		}
	}

	simpleCapitalize(input :string) :string {
		return input.charAt(0).toUpperCase() + input.slice(1);
	}

}
