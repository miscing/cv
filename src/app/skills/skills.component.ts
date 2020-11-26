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

	capitalize(input: string): string {
		return input.charAt(0).toUpperCase() + input.slice(1);
	}

}
