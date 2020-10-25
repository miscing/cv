export interface Cv {
	profile :Profile;
}

export interface Profile {
	firstname :string;
	surname :string;
	pic :string;
	links? :Link[];
}

export interface Link {
	// code will attempt to construct a link based on name and username if
	// name is known (such as "github" or "gitlab"). Otherwise uses "url" or "url+username"
	name :string;
	url :string; //optional
	username? :string; //optional
}
