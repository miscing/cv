//
// Copyright 2020 Alexander Saastamoinen
//
//  Licensed under the EUPL, Version 1.2 or – as soon they
// will be approved by the European Commission - subsequent
// versions of the EUPL (the "Licence");
//  You may not use this work except in compliance with the
// Licence.
//  You may obtain a copy of the Licence at:
//
//  https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12
//
//  Unless required by applicable law or agreed to in
// writing, software distributed under the Licence is
// distributed on an "AS IS" basis,
//  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
// express or implied.
//  See the Licence for the specific language governing
// permissions and limitations under the Licence.
//

import { OnChanges, Component, Input  } from '@angular/core';

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
		if (item.text != "") {
			this.altLink = item.text;
		}
	}
}

function getKnownAsset(name :string) :string {
	let asset :string;
	known.forEach( (item) => {
		if (name == item.name) {
			asset = item.asset;
		}
	});
	if (asset) {
		return "assets/logos/"+asset;
	}
	return "";
}

@Component({
	selector: 'app-profile',
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnChanges {
	@Input() profile :Profile;
	links :external[];

	constructor() {}

	ngOnChanges() :void {
		let links = [];
		if (this.profile?.links) {
			this.profile.links.forEach( (item) => {
				let newLink = new external(item);
				links.push(newLink);
			});
			this.links = links;
		}
	}
}
