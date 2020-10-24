import {  Component, Input, OnInit } from '@angular/core';

import { Profile } from '../cv';

const gitlab = "https://gitlab.com/";
const github = "https://github.com/";

@Component({
	selector: 'app-profile',
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
	@Input() profile :Profile;

	lab :string;
	hub :string;

	constructor() {
	}

	ngOnInit(): void {
		this.lab= gitlab+this.profile.gitlab;
		this.hub= github+this.profile.github;
	}

}
