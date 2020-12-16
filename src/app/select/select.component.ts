import { Input, Component, OnInit } from '@angular/core';

import { Cv } from '../cv';

@Component({
	selector: 'app-select',
	templateUrl: './select.component.html',
	styleUrls: ['./select.component.scss']
})
export class SelectComponent implements OnInit {
	@Input() cv :Cv;

	constructor() { }

	ngOnInit(): void {
	}
}
