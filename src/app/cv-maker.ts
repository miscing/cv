import { Octokit } from "@octokit/rest"

import { Cv } from './cv';

import mockData from './mock-data.json';
import mockcv from '../../../mock-data/cv.json';
import mockembed from '../../../mock-data/embed.json';
import mockfilecense from '../../../mock-data/filecense.json';
// import { saveAs } from 'file-saver';

const mockdata =  {
		cv : mockcv,
		embed : mockembed,
		filecense : mockfilecense,
}

export class Repo {
	constructor() {
	}
}



export class CvMaker extends Cv {

	generateCv() {
		this.fromGithub().then( x => {
			console.log(x);
			// x.forEach( item => {
			// 	console.log(item)
			// })
		})
	}

	fromGithub() : Promise<void | Repo[]>{
		return new Promise<void | Repo[]>( (resolve) => {
			// const github = new Octokit();
			let username = this.getLinkUsernameByName("github");
			// github.repos.listForUser({
			// 	username: username,
			// 	type: "all"
			// }).then( (uRepos :any) => {
			let uRepos = mockData;
			// var repos :Repo[] = [];
			// uRepos.data.forEach( (project :any) => {
			uRepos.forEach( (project :any) => {
				// github.repos.getContent({
				// 	owner: username,
				// 	path: "",
				// 	repo: project.name
				// }).then( ({data} :any) => {
				// let repo = new Repo(data);
				let data =  mockdata[project.name];
				if (data === undefined) {
					console.log(project.name);
				}
				let payload = JSON.stringify(data);
				console.log(payload);
				// var file = new File([payload], "test.txt", {type: "text/plain;charset=utf-8"});
				// saveAs(file);
				// repos.push(repo);
				// })
			});
			// });
			// resolve(repos);
			resolve(null);
		}).catch( (e :Error) => {
			console.error(e);
		});
		// });
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
