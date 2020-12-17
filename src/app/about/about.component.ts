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
}
