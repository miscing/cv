import {  Component, Input, OnInit } from '@angular/core';

import { Profile } from '../cv';

const known :knownProvider[] = [
	{ name : "gitlab", asset : "gitlab_logo.png"},
	{ name : "github", asset : "github_logo.png"}
]


class knownProvider {
	name :string;
	asset :string;
}

class external {
	name :string;
	img :string;
	link :URL;
}

@Component({
	selector: 'app-profile',
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
	@Input() profile :Profile;
	knownUrls :Map<string, string>;
	links :external[];

	constructor() {
		this.knownUrls = new Map();
		known.forEach( (item) => {
			this.knownUrls.set(item.name, item.asset);
		});
		this.links = new Array();
	}

	ngOnInit(): void {
		this.profile.links.forEach( (item) => {
			let newLink = new external;
			if (this.knownUrls.has(item.name)) {
				newLink.name = item.name;
				newLink.img = "assets/logos/"+this.knownUrls.get(item.name);
				newLink.link = new URL(item.url+item.username);
				this.links.push(newLink);
			} else {
				newLink.name = item.name;
				if (item.hasOwnProperty('username')){
					if (item.hasOwnProperty('url')){
						newLink.link = new URL(item.url+item.username);
						this.links.push(newLink);
					} else {
						newLink.link = new URL(item.username);
						this.links.push(newLink);
					}
				} else if (item.hasOwnProperty('url')){
					newLink.link = new URL(item.url);
					this.links.push(newLink);
				}
			}
		});
	}
}
