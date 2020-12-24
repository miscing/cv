import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';

import {DlJsonComponent} from '../dl-json/dl-json.component';

@Component({
	selector: 'app-controls',
	templateUrl: './controls.component.html',
	styleUrls: ['./controls.component.scss']
})
export class ControlsComponent implements OnInit {

	constructor(public dialog :MatDialog) { }

	ngOnInit(): void {
	}

	printPdf() :void {
		window.print();
	}

	showJson() :void {
		this.dialog.open(DlJsonComponent);
	}
}
