export class Cv {
	profile :Profile;
	skills? :Skill[];
}

export class Profile {
	firstname :string;
	surname :string;
	pic :string;
	links? :Link[];
	constructor() {
		this.links = [];
	}
}

export class Link {
	name :string;
	url :string;
	username? :string; //added to url to create shown text
	text? :string; //if set overrides normal (url+username) text shown
}

export class Skill {
	name :string;
	text? :string; //optional text to show
	links? :URL[]; //contains files or repositories to display in cv
	options? :SkillOption; //internal use
}

// contains option information for parsing of skills
export class SkillOption {
	topics? :string[]; // used instead of skill name if exists
	file? :string[];
	rfile? :string[];
	urls? :string[]; // websites to show
}

// export class Timeline {
// 	dates :Moment[];
// }

// export class Moment {
// 	date :Date;
// 	event :string; //text to show, for example "Started as account handler at Company A"
// }
