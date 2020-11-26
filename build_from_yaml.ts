import { parse } from 'yaml';
import { copyFile, readdir, readFile, writeFile } from 'fs';
import { Cv, Profile, Link,  Skill, SkillOption } from './src/app/cv';
import { fromFile } from 'file-type';

function readYaml(file :string) : Promise<Cv>{
	return new Promise(  async (resolve, reject) => {
		readFile(file, 'utf8', (err, data) => {
			if (err !== null) {
				return reject(err);
			}
			let cv = new Cv; // new cv for yaml data
			console.log(data); // print so input is visible in cicd logs
			let parsed = parse(data);

			// generate skills
			generateSkills(parsed.skills)
				.then( skills => {
					cv.skills = skills;
					// generate profile
					return generateProfile(parsed);
				})
				.then( prof => {
					cv.profile = prof;
					return resolve(cv);
				})
				.catch(e => { return reject(e) });
		});
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
			case "skills":
				//skip
				break;
			default:
				throw "unrecognized top level field in yaml: "+field;
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
	item[fields[0]].forEach( (option) => {
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
						skillOpt.urls = option[optName];
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
	readYaml("cv.yml").then( cv => {
		// write payload to file
		let payload = JSON.stringify(cv);
		writeFile("cv.json", payload, 'utf-8', err => {
			if (err !== null) {
				throw "error writing file, error: "+err as string;
			} else {
				console.log("succesfully parsed yaml and generated json cv");
			}
		});
	});
}

if (require.main === module) {
	main();
}
