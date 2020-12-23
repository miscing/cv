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

import { Octokit } from "@octokit/rest"

import { Observable, BehaviorSubject } from "rxjs"

import { Cv } from './cv';
import { CvMask } from './cv-mask';

import mockdata from './cv_data_dump.json';
import { saveAs } from 'file-saver';

export class CvMaker {
	cv :Cv;
	sub$ :BehaviorSubject<Cv>;
	cache: Map<string, Repo>; //maps repo name to information (not url due to difficult characters in urls)
	maskCache: Map<string, any[][]>; //maps repo name to information (not url due to difficult characters in urls)

	constructor(data :Cv, mock? :boolean, store? :boolean) {
		this.cv = data;
		this.maskCache = new Map();
		this.sub$ = new BehaviorSubject<Cv>(data);
		if (mock) {
			console.log("using mock data");
			this.fromMock();
			this.matchGitToSkills();
			this.removeDuplicates();
		} else {
			// get repos in github got parsing
			getUserRepos(this.getLinkUsernameByName("github")).then( (repos) => {
				this.cache = repos;
				if (store) {
					this.storeCache() // save all downloaded information as file
				}
				this.matchGitToSkills();
				this.removeDuplicates();
			}).catch(checkForApiLimit); // get repo information
		}
	}

	Output() :Observable<Cv> {
		return this.sub$;
	}

	Mask(mask :CvMask) {
		let key = mask.mask.slice(0, mask.mask.length-1).join();
		if (mask.add) {
			if (this.maskCache.has(key)) {
				this.maskCache.get(key).push(mask.mask);
			} else {
				this.maskCache.set(key, [mask.mask]);
			}
		} else {
			this.maskCache.set(key, this.maskCache.get(key).filter( fmask => fmask.join() !== mask.mask.join()));
		}
		this.applyMasks();
	}

	applyMasks() :void {
		// TODO: ASYNC this? What will happen if multiple delete get called in async?
		let newCv = JSON.parse(JSON.stringify(this.cv)); //What a disgusting hack. Jesus
		for(const entry of this.maskCache) {
			entry[1].sort( (a :any[], b :any[]) => b[b.length-1] -a[a.length-1] );
			entry[1].forEach( mask => this.applyMask(mask, newCv));
		}
		this.sub$.next(newCv);
	}

	applyMask(mask :any[], cv) :void {
		try {
			switch (mask.length) {
				case 1:
					delete cv[mask[0]];
					break;
				case 2:
					cv[mask[0]].splice(mask[1], 1);
					break;
				case 3:
					cv[mask[0]][mask[1]].splice(mask[2], 1);
					break;
				default:
					console.error("Received mask of invalid length, must be between 1-3. Got: ", mask.length, "\nmask: ",mask);
					break;
			}
		} catch (e) {
				// TODO: better solution would be to make sure parent masks are evaluated last, or prevent child masks from being evaluated
			const re = /Cannot read property '\w*' of undefined/;
			if (re.test(e.message)) {
				// probably caused by a parent mask, ignore as a easy solution
				return;
			} else {
				console.error(e);
			}
		}
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

	removeDuplicates() {
		this.cv.skills.forEach( (skill, skillI) => {
			for (let i=0; i<skill.links.length; i++) {
				for (let j=i+1; j<skill.links.length; j++) {
					if (skill.links[i].toString() === skill.links[j].toString()) {
						this.cv.skills[skillI].links.splice(j, 1);
					}
				}
			}
		});
	}

	matchGitToSkills() {
		this.cv.skills.forEach( (v, i) => {
			if (!v.hasOwnProperty("links")) {
				v.links = []; // avoids pushing to undefined on first push
			}
			if ("options" in v) {
				Object.getOwnPropertyNames(v.options).forEach( (option) => {
					switch (option) {
						case "topics":
							v.options.topics.forEach( (topic) => {
								this.cv.skills[i].links.push(...this.getReposByTopic(topic));
							});
							break
						case "file":
							v.options.file.forEach( (file) => {
								this.cv.skills[i].links.push(...this.getReposByFileName(file));
							});
							break
						case "rfile":
							v.options.rfile.forEach( (file) => {
								this.cv.skills[i].links.push(...this.getReposByFileNameRegex(file));
							});
						default:
							throw new Error("invalid option found in skill "+option);
					}
				});
				// if topics is not an option, use skill name to get repo urls
				if (! ("topics" in v.options)) {
					this.cv.skills[i].links.push(...this.getReposByTopic(v.name));
				}
			} else {
				this.cv.skills[i].links.push(...this.getReposByTopic(v.name));
			}
		});
	}

	getReposByFileNameRegex(regex :string) :string[] {
		let result :string[] = [];
		let re = new RegExp(regex);
		this.cache.forEach( (v) => {
			let file = v.files.data.find( (ele :any) => {
				return re.test(ele.name);
			});
			if (file != undefined) {
				result.push(file.html_url);
			}
		});
		return result;
	}


	getReposByFileName(filename :string) :string[] {
		let result :string[] = [];
		this.cache.forEach( (v) => {
			let file = v.files.data.find( (ele :any) => { return ele.name === filename });
			if (file != undefined) {
				result.push(file.html_url);
			}
		});
		return result;
	}

	getReposByTopic(topic :string) :string[] {
		let result :string[] = [];
		this.cache.forEach( (v) => {
			if (v.topics.data.names.some( (ele :string) => { return ele === topic })) {
				result.push(v.info.html_url);
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
		this.cv.profile.links.forEach( link => {
			if (link.name === name) {
				username = link.username as string;
				return
			}
		});
		if (typeof username !== "string" ) {
			throw new Error("no links found for "+name);
		}
		return username;
	}
}

class Repo { // holds github data dumps
	info? :any;
	files? :any;
	topics? :any;
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
