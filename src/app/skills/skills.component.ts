import { Input, Component, OnInit } from '@angular/core';

import { Link } from '../cv';

@Component({
	selector: 'app-skills',
	templateUrl: './skills.component.html',
	styleUrls: ['./skills.component.scss']
})
export class SkillsComponent implements OnInit {
	@Input() skills :Link[];

	constructor() { }

	ngOnInit(): void {
		// console.log(this.skills);
	}

}
