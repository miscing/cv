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

import { parse } from 'yaml';
import { copyFile, readdir, readFile, writeFile } from 'fs';
import { Cv, About, AboutExtra, Lang, Profile, Link,  Skill, SkillOption, Moment, SimpleDate } from './src/app/cv';
import { fromFile } from 'file-type';

function generateCv(file :string) : Promise<Cv>{
	return new Promise(  (resolve, reject) => {
		readFile(file, 'utf8', (err, data) => {
			if (err !== null) {
				return reject(err);
			}
			let cv = new Cv; // new cv for yaml data
			console.log(data); // print so input is visible in cicd logs
			let parsed :any;
			try {
				parsed = parse(data);
			} catch (e) {
				return reject(e);
			}

			// generate skills
			let skills = generateSkills(parsed.skills);
			// generate about
			let about = generateAbout(parsed.about);
			// generate timeline
			let timeline = generateTimeline(parsed.timeline);
			// generate profile
			let prof = generateProfile(parsed);

			// collect results
			Promise.all([skills, prof, about, timeline]).then( resArr => {
				cv.skills = resArr[0];
				cv.profile = resArr[1];
				cv.about = resArr[2];
				cv.timeline = resArr[3];
				return resolve(cv);
			}).catch(e => { return reject(e) });
		});
	});
}

function generateTimeline(timeline :any) :Promise<Moment[]> {
	return new Promise( (resolve, reject) => {
		let result = [];
		timeline.forEach( obj => {
			let moment = parseDate(Object.getOwnPropertyNames(obj)[0]);
			moment.desc = obj[Object.getOwnPropertyNames(obj)[0]];
			result.push(moment);
		});
		resolve(result);
	});
}

function parseDate(date :string) :Moment {
	let dates = date.split('-');
	if (dates.length != 2) {
		throw "timeline dates must consist of two '-' seperated dates, a start and end";
	}
	let moment = new Moment;
	dates.forEach( (d, i)=>  {
		let dest :string;
		if (i === 0) {
			dest = "dateStart";
		} else {
			dest = "dateEnd";
		}
		let dFields = d.split('/');
		switch (dFields.length) {
			case 2:
				moment[dest] = new SimpleDate(Number(dFields[0]), Number(dFields[1]));
				break;
			case 3:
				// ignores day
				console.log("CV only allows month/year dates, ignoring day in "+date);
				moment[dest] = new SimpleDate(Number(dFields[1]), Number(dFields[2]));
				break;
			default:
				throw new SyntaxError("incorrect syntax in date: "+date);
		}
	});
	return moment;
}

function generateAbout(parsedAbout :any) :Promise<About> {
	return new Promise( (resolve, reject) => {
		let about = new About;
		if (Array.isArray(parsedAbout)) {
			parsedAbout.forEach( field => {
				if (typeof field === "string") {
					// strings must be texts
					about.text.push(field);
				} else if (typeof field === "object") {
					switch (Object.getOwnPropertyNames(field)[0]) {
						case "languages":
							if (!about.hasOwnProperty("languages")) {
								about.langs = [];
							}
							field.languages.forEach( yamlLang => {
								let languageName = Object.getOwnPropertyNames(yamlLang);
								if (languageName.length === 0) {
									throw "language contains more than one field, invalid syntax.";
								}
								about.langs.push(new Lang(languageName[0], yamlLang[languageName[0]]));
							});
							break;
						default:
							if (!about.hasOwnProperty("custom")) {
								about.custom = [];
							}
							let extra = new AboutExtra(Object.getOwnPropertyNames(field)[0], field[Object.getOwnPropertyNames(field)[0]]);
							about.custom.push(extra);
							break;
					}
				}
			});
		} else if ((typeof parsedAbout) === "string") {
			// only contains a single main text
			about.text.push(parsedAbout);
		} else {
			throw "syntax error in about, must contain an array or string";
		}
		resolve(about);
	});
}

function generateProfile(parsed :any) :Promise<Profile> {
	return new Promise( async (resolve, reject) => {
		try {
			let picPromise = getProfilePic()
			let cv = genProfile(parsed)
			let pic = await picPromise
			copyFile(pic, "./src/assets/"+pic, e => {
				if (e != null){
					return reject(e)
				} else {
					cv.pic = "assets/"+pic;
					return resolve(cv);
				}
			});
		} catch (e) {
			return reject(e);
		}
	});
}

function getProfilePic() :Promise<string> {
	return new Promise( (resolve, reject) => {
		// add profile pic to assets and link name. sets empty path if no valid image found
		readdir( ".", {withFileTypes: true}, (err, files) => {
			if (err != null) {
				reject(err);
			}
			let promises = [];
			let fileNames = [];
			let profileName = /profile\.\w*/;
			files.forEach( file => {
				if (file.isFile()) {
					if (file.name.match(profileName)){
						promises.push(fromFile(file.name));
						fileNames.push(file.name);
					}
				}
			});
			Promise.all(promises).then( filetypes => {
				let imageMime = /image\/\w*/;
				let i = filetypes.findIndex( ft =>  ft.mime.match(imageMime) );
				resolve(fileNames[i]);
			}).catch( e => { reject(e) });
		});
	});
}

function genProfile(parsed :any) :Profile {
	let profile = new Profile;

	Object.getOwnPropertyNames(parsed).forEach( (field :any) => {
		switch (field) {
			case "name":
				let words = parsed[field].split(' ');
				if (words.length != 2) {
					throw "name must be in format 'firstname surname'";
				}
				profile.firstname = words[0];
				profile.surname = words[1];
				break;
			case "github":
				let githublink = new Link;
				githublink.name = "github";
				githublink.url = "https://github.com/"+parsed[field];
				githublink.username = parsed[field];
				profile.links.push(githublink);
				break;
			case "gitlab":
				let gitlablink = new Link;
				gitlablink.name = "gitlab";
				gitlablink.url = "https://gitlab.com/"+parsed[field];
				gitlablink.username = parsed[field];
				profile.links.push(gitlablink);
				break;
			case "matrix":
				let matrixlink = new Link;
				matrixlink.name = "matrix";
				matrixlink.url = "https://app.element.io/";
				matrixlink.text = parsed[field];
				profile.links.push(matrixlink);
				break;
			default:
				break;
		}
	});

	return profile;
}

function generateSkills(yamlSkills :any) :Promise<Skill[]> {
	return new Promise( (resolve, reject) => {
		if (yamlSkills.length != 0){
			try {
				return resolve(genSkills(yamlSkills));
			} catch (e) {
				return reject(e);
			}
		}
	});
}

// generates js skills from yaml skills
function genSkills(yamlSkills :any) :Skill[] {
	let skills = [];
	yamlSkills.forEach( (v) => {
		let skill = new Skill;
		if (typeof v === "object"){
			skill = genSkill(v);
		} else if (typeof v === "string") {
			// if string assumed to be a skill which matches to same name topics
			skill.name = v;
		} else {
			throw "unsupported field in "+v as string;
		}
		skills.push(skill);
	});
	return skills;
}

// generates a js skill from a yaml skill definitions with options, simple one line skills are generated by parent function genSkills
function genSkill(item :any) :Skill {
	let skill = new Skill;
	let fields = Object.getOwnPropertyNames(item);
	if (fields.length != 1) {
		throw "skill with more than one (or 0) names, should not be possible";
	}
	skill.name = fields[0];
	let skillOpt = new SkillOption;
	item[fields[0]].forEach( (option :any) => {
		if (typeof option === "object") {
			// if child is an object, it must be a reserved keyword
			Object.getOwnPropertyNames(option).forEach( (optName) => {
				switch (optName) {
					case "text":
						skill.text = option[optName];
						break;
					case 'file':
						skillOpt.file = option[optName];
						break;
					case 'rfile':
						skillOpt.rfile = option[optName];
						break;
					case 'url':
						if (!skill.links) {
							skill.links = [];
						}
						skill.links.push(...option[optName]);
						break;
					case "level":
						skill.level = option[optName];
						break;
					default:
						throw "invalid option name "+optName;
				}
			});
		} else if (typeof option === "string") {
			// if child is a string, assumed to be a topic. Multiple topics to match with are allowed.
			if (!skillOpt.hasOwnProperty("topics")) {
				skillOpt.topics = [];
			}
			skillOpt.topics.push(option);
		} else {
			// we should not get here
			throw "invalid yaml for cv";
		}
		if (Object.getOwnPropertyNames(skillOpt).length !== 0) {
			skill.options = skillOpt;
		}
	});
	return skill;
}

function main() {
	generateCv("cv.yml").then( cv => {
		// write payload to file
		let payload = JSON.stringify(cv);
		writeFile("cv.json", payload, 'utf-8', err => {
			if (err !== null) {
				throw "error writing file, error: "+err as string;
			} else {
				console.log("succesfully parsed yaml and generated json cv");
			}
		});
	}).catch( e => {
		console.error("ERROR:");
		if (e.name === "YAMLSyntaxError") {
			console.error(e.message);
		} else {
			console.error(e);
		}
	});
}

if (require.main === module) {
	main();
}
