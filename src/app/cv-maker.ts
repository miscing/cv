import { Octokit } from "@octokit/rest"
import { Observable } from "rxjs"

import { Cv } from './cv';

import mockdata from './cv_data_dump.json';
import { saveAs } from 'file-saver';

class Repo { // holds github data dumps
	info? :any;
	files? :any;
	topics? :any;
}

export class CvMaker extends Cv {
	cache: Map<string, Repo>; //maps repo name to information (not url due to difficult characters in urls)

	constructor(data :Cv) {
		super();
		Object.assign(this, data);

		this.fromMock();

		// get repos in github got parsing
		// getUserRepos(this.getLinkUsernameByName("github")).then( (repos) => {
		// 	this.cache = repos;
		// 	this.storeCache() // save all downloaded information as file
		// 	this.cache.forEach( (v, k) => {
		// 		console.log(k);
		// 		console.log(v.info.name);
		// 		console.log(v.topics);
		// 	});
		// }).catch(checkForApiLimit); // get repo information

		this.matchGitToSkills();
	}

	storeCache() {
		// used to generate mock data, makes browser download cache as a json file
		let payload = [];
		this.cache.forEach( (v) => {
			payload.push(v);
		});
		var file = new File([JSON.stringify(payload)], "cv_data_dump.json", {type: "text/plain;charset=utf-8"});
		saveAs(file);
	}


	matchGitToSkills() {
		this.skills.forEach( (v, i) => {
			if (!v.hasOwnProperty("links")) {
				v.links = []; // avoids pushing to undefined on first push
			}
			if ("options" in v) {
				Object.getOwnPropertyNames(v.options).forEach( (option) => {
					switch (option) {
						case "topics":
							v.options.topics.forEach( (topic) => {
								this.skills[i].links = v.links.concat(this.getReposByTopic(topic));
							});
							break
						case "file":
							v.options.file.forEach( (file) => {
								this.skills[i].links = v.links.concat(this.getReposByFileName(file));
							});
							break
						case "rfile":
							v.options.rfile.forEach( (file) => {
								this.skills[i].links = v.links.concat(this.getReposByFileNameRegex(file));
							});
						case "urls":
							v.options.urls.forEach( (url) => {
								this.skills[i].links.push(new URL(url));
							});
							break
						default:
							throw "invalid option found in skill "+option;
					}
				});
			} else {
				this.skills[i].links = v.links.concat(this.getReposByTopic(v.name));
			}
		});
	}

	getReposByFileNameRegex(regex :string) :URL[] {
		let result :URL[] = [];
		let re = new RegExp(regex);
		this.cache.forEach( (v) => {
			let file = v.files.data.find( (ele :any) => {
				return re.test(ele.name);
			});
			if (file != undefined) {
				result.push(new URL(file.html_url));
			}
		});
		return result;
	}


	getReposByFileName(filename :string) :URL[] {
		let result :URL[] = [];
		this.cache.forEach( (v) => {
			let file = v.files.data.find( (ele :any) => { return ele.name === filename });
			if (file != undefined) {
				result.push(new URL(file.html_url));
			}
		});
		return result;
	}

	getReposByTopic(topic :string) :URL[] {
		let result :URL[] = [];
		this.cache.forEach( (v) => {
			if (v.topics.data.names.some( (ele :string) => { return ele === topic })) {
				result.push(new URL(v.info.html_url));
			}
		});
		return result;
	}

	fromMock() {
		this.cache = new Map();
		mockdata.forEach( repo => {
			this.cache.set(repo.info.full_name, repo);
		});
	}

	getLinkUsernameByName(name :string) :string {
		let username :string;
		this.profile.links.forEach( link => {
			if (link.name === name) {
				username = link.username as string;
				return
			}
		});
		if (typeof username !== "string" ) {
			throw "no links found for "+name;
		}
		return username;
	}
}

function getUserRepos(username :string) :Promise<Map<string, Repo>>{
	return new Promise( (resolve, reject) => {
		let github = new Octokit();
		let payload :Map<string, Repo> = new Map(); //maps repository url to list of file
		github.repos.listForUser({
			username: username,
			type: "owner"
		}).then( (uRepos :any) => {
			let promiseArr = [];
			uRepos.data.forEach( (project :any) => {
				payload.set(project.full_name, new Repo());
				payload.get(project.full_name).info = project;
				// collect all promises
				promiseArr.push(
					github.repos.getContent({
						owner: username,
						path: "",
						repo: project.name
					}).then( (input) => {
						payload.get(project.full_name).files = input;
					}).catch((e) => { reject(e) }),
					github.repos.getAllTopics({
						owner: username,
						repo: project.name
					}).then( (input) => {
						payload.get(project.full_name).topics = input;
					}).catch((e) => { reject(e) })
				)
			});
			// resolve on all promises completing
			Promise.all(promiseArr).then( () => {
				resolve(payload);
			}).catch((e) => { reject(e) });
		}).catch((e) => { reject(e) });
	});
}

function checkForApiLimit(error :any) {
	// Checks if error is caused by too many api calls, to open a dialog to use a token
	if (error.message.includes('API rate limit exceeded')) {
		console.error("api rate limit reached, use token or wait 1 hour");
		return
	}
	console.error(error.message);
}
