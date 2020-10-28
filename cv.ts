export class Cv {
	profile :Profile;
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
	username? :string; //optional
	text? :string; //if set overrides normal text shown
}
