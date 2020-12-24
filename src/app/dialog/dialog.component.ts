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

import { Component } from '@angular/core';

import { MatDialogRef } from '@angular/material/dialog';

@Component({
	selector: 'app-dialog',
	templateUrl: './dialog.component.html',
	styleUrls: ['./dialog.component.scss']
})
export class DialogComponent {
	token :string;

	constructor(private matDialogRef: MatDialogRef<DialogComponent>) { }

	MockData() :void {
		this.matDialogRef.close(new DialogResponse(true));
	}

	Token() :void {
		if (this.token){
			this.matDialogRef.close(new DialogResponse(this.token));
		} else {
			console.error("you must supply a token");
		}
	}

}

export class DialogResponse {
	mock? :boolean;
	token? :string;
	constructor(input :any) {
		switch( typeof input) {
			case "boolean":
				this.mock = input;
				break;
			case "string":
				this.token = input;
				break;
			default:
				throw new Error("invalid use of DialogResponse, got an input of type "+typeof input);
		}
	}
}
