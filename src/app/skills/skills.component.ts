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
		console.log(this.skills);
	}

}
