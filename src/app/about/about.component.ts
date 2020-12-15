import { Input, Component, OnInit } from '@angular/core';

import { About  } from '../cv';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
	@Input() about :About;

  constructor() { }

  ngOnInit(): void {
  }

	capitalize(input: string): string {
		if (input.includes(" ")) {
			// capitalize each item seperated by '/'
			return input.split(' ').map( str => this.simpleCapitalize(str)).join(" ");
		} else {
			return this.simpleCapitalize(input);
		}
	}

	simpleCapitalize(input :string) :string {
		return input.charAt(0).toUpperCase() + input.slice(1);
	}

}
