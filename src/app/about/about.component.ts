import { Input, Component, OnInit } from '@angular/core';

import { About  } from '../cv';

@Component({
	selector: 'app-about',
	templateUrl: './about.component.html',
	styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
	@Input() about :About;

	constructor() { }

	ngOnInit(): void {
	}

	langProf(num :number) :string {
		switch (num) {
			case 1:
				return "limited working proficiency";
			case 2:
				return "working proficiency";
			case 3:
				return "native";
		}
	}
}
