import { Octokit } from "@octokit/rest"

import { Cv } from './cv';

// import mockData from './mock-data.json';
// import mockcv from '../../../mock-data/cv.json';
// import mockembed from '../../../mock-data/embed.json';
// import mockfilecense from '../../../mock-data/filecense.json'; import cv from '../../../mock-data/miscing_cv.json';
import cv from '../../../mock-data/miscing_cv.json';
import dft from '../../../mock-data/miscing_dft.json';
import embed from '../../../mock-data/miscing_embed.json';
import filecense from '../../../mock-data/miscing_filecense.json';
import go from '../../../mock-data/miscing_go-neuralnetwork.json';
import govim from '../../../mock-data/miscing_govim-highlighting-issue.json';
import kvm from '../../../mock-data/miscing_kvm-scripts.json';
import reversetls from '../../../mock-data/miscing_reversetls.json';

import { saveAs } from 'file-saver';

const mockdata =  [
	cv, dft, embed, filecense, go, govim, kvm, reversetls,
]

class Repo { // holds github data dumps
	info? :any;
	files? :any;
	topics? :any;
}

export class CvMaker extends Cv {

	cache: Map<string, Repo>; //maps repository url to list of file

	constructor(data) {
		super();
		Object.assign(this, data);
		this.cache = new Map();
		// this.fromGithub().then( () => {
		// 	this.storeCache() // save all downloaded information as files
		// 	this.cache.forEach( (v, k) => {
		// 		console.log(v.info.name);
		// 		console.log(v.topics);
		// 	});
		// }); // get repo information
		this.fromMock();
	}

	storeCache() {
		this.cache.forEach( (v, k) => {
			var file = new File([JSON.stringify(v)], k+".json", {type: "text/plain;charset=utf-8"});
			saveAs(file);
		});
	}

	generate() {
	}

	fromGithub() {
		return new Promise( resolve => {
			const github = new Octokit();
			let username = this.getLinkUsernameByName("github");
			github.repos.listForUser({
				username: username,
				type: "owner"
			}).then( (uRepos :any) => {
				uRepos.data.forEach( (project :any) => {
					let counter = 0;
					this.cache.set(project.full_name, new Repo);
					this.cache.get(project.full_name).info = project;
					github.repos.getContent({
						owner: username,
						path: "",
						repo: project.name
					}).then( ({data} :any) => {
						this.cache.get(project.full_name).files = data;
						if (counter++ == 2) {
							resolve();
						}
					});
					github.repos.getAllTopics({
						owner: username,
						repo: project.name
					}).then( ({data} :any) => {
						this.cache.get(project.full_name).topics = data;
						if (counter++ >= 2) {
							resolve();
						}
					});
				});
			});
		});
	}

	fromMock() {
		mockdata.forEach( repo => {
			this.cache.set(repo.info.full_name, repo);
		});
	}

	getTopics() {
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
