import {  Component, Input, OnInit } from '@angular/core';
import {  DomSanitizer } from '@angular/platform-browser';

import {  MatIconRegistry } from '@angular/material/icon';

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

	constructor(private domSanitizer :DomSanitizer, private matIconRegistry :MatIconRegistry) {
	}

	ngOnInit(): void {
		this.lab= gitlab+this.profile.gitlab;
		this.hub= github+this.profile.github;
		this.matIconRegistry.addSvgIcon("gitlab", this.domSanitizer.bypassSecurityTrustResourceUrl("assets/gitlab-logo-gray-rgb.svg"));
		// this.matIconRegistry.addSvgIcon("gitlab", this.domSanitizer.sanitize( 4, "/assets/gitlab-logo-gray-rgb.svg"));
	}

}
