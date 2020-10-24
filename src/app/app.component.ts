import { Component } from '@angular/core';
import {  DomSanitizer } from '@angular/platform-browser';

import {  MatIconRegistry } from '@angular/material/icon';

import rawData from './data.json';
import { Cv } from './cv';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
	data :Cv = rawData;

	constructor(private domSanitizer :DomSanitizer, private matIconRegistry :MatIconRegistry) {
		this.matIconRegistry.addSvgIcon("gitlab", this.domSanitizer.bypassSecurityTrustResourceUrl("assets/gitlab-logo-gray-rgb.svg"));
	}
}
