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

import { Component, OnInit } from '@angular/core';

import { saveAs } from 'file-saver';
import { CvMakerService } from '../cv-maker.service';

@Component({
  selector: 'app-dl-json',
  templateUrl: './dl-json.component.html',
  styleUrls: ['./dl-json.component.scss']
})
export class DlJsonComponent implements OnInit {
	payload :string;

  constructor(private cvMaker :CvMakerService) { }

  ngOnInit(): void {
		this.cvMaker.Output().subscribe( cv => {
			this.payload = JSON.stringify(cv);
		});
  }

	DlPayload() :void {
		saveAs(new File([this.payload], "cv.json", {type: "text/plain;charset=utf-8"}))
	}

}
