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

export class Cv {
	profile :Profile;
	about? :About;
	timeline? :Moment[];
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

export class About {
	text :string[];
	langs? :Lang[];
	custom? :AboutExtra[];
	constructor() {
		this.text = [];
	}
}

export class AboutExtra {
	key :string;
	value :string;
	constructor(key :string, value :string) {
		this.key = key;
		this.value = value;
	}
}
 
export class Lang {
	name :string;
	level :number; //language proficiency
	constructor(name :string, level :number) {
		this.name = name;
		this.level = level;
	}
}

export class Skill {
	name :string;
	level? :number;
	text? :string; //optional text to show
	links? :string[]; //contains files or repositories to display in cv
	options? :SkillOption; //internal use
}

// contains option information for parsing of skills
export class SkillOption {
	topics? :string[]; // used instead of skill name if exists
	file? :string[];
	rfile? :string[];
}

export class Moment {
	dateStart :SimpleDate;
	dateEnd :SimpleDate;
	desc :string; //text to show, for example "Started as account handler at Company A"
}

export class SimpleDate {
	month :number;
	year :number;
	constructor(month, year) {
		if (month > 12 || month < 1) {
			throw SyntaxError("invalid month, must be between 1 and 12");
		}
		this.month = month;
		if (year > new Date().getFullYear() || year < 1900) {
			throw SyntaxError("invalid year, must be between current year and 1900");
		}
		this.year = year;
	}
}
