export class Cv {
	profile :Profile;
	skills? :Skill[];
	constructor() {
	}
}

export class Profile {
	firstname :string;
	surname :string;
	pic :string;
	links? :Link[];
}

export class Link {
	name :string;
	url :string;
	username? :string; //added to url to create shown text
	text? :string; //if set overrides normal (url+username) text shown
}

export class Skill {
	name: string;
	text?: string; //optional text to show
	links?: URL[];
	skill?: Skill;
}

export class Timeline {
	dates :Moment[];
}

export class Moment {
	date :Date;
	event :string; //text to show, for example "Started as account handler at Company A"
}
