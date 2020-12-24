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
