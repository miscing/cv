import {  Component, Input, OnInit } from '@angular/core';

import { Profile, Link } from '../cv';

const known :knownProvider[] = [
	{ name : "gitlab", asset : "gitlab_logo.png"},
	{ name : "github", asset : "github_logo.png"},
	{ name : "matrix", asset : "matrix_logo.png"}
]


class knownProvider {
	name :string;
	asset :string;
}

class external {
	name :string;
	img :string;
	link :URL;
	altLink :string;
	constructor(item :Link) {
		this.name = item.name;
		this.img = getKnownAsset(item.name)
		this.link = new URL(item.url);
	}
}

function getKnownAsset(name :string) :string {
	let asset :string;
	known.forEach( (item) => {
		if (name == item.name) {
			asset = item.asset;
		}
	});
	if (asset != ""){
		return "assets/logos/"+asset;
	}
	return "";
}

@Component({
	selector: 'app-profile',
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
	@Input() profile :Profile;
	links :external[];

	constructor() {
		this.links = new Array();
	}

	ngOnInit(): void {
		this.profile.links.forEach( (item) => {
			let newLink = new external(item);
			this.links.push(newLink);
		});
	}

}
