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

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatBadgeModule } from '@angular/material/badge';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';

import { AppComponent } from './app.component';
import { ProfileComponent } from './profile/profile.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SkillsComponent } from './skills/skills.component';
import { AboutComponent } from './about/about.component';
import { SelectComponent } from './select/select.component';
import { ControlsComponent } from './controls/controls.component';
import { TimelineComponent } from './timeline/timeline.component';
import { DialogComponent } from './dialog/dialog.component';
import { DlJsonComponent } from './dl-json/dl-json.component';

@NgModule({
	declarations: [
		AppComponent,
		ProfileComponent,
		SkillsComponent,
		AboutComponent,
		SelectComponent,
		ControlsComponent,
		TimelineComponent,
		DialogComponent,
		DlJsonComponent
	],
	imports: [
		BrowserModule,
		FormsModule,
		MatButtonModule,
		MatToolbarModule,
		MatIconModule,
		MatListModule,
		MatCardModule,
		MatBadgeModule,
		MatCheckboxModule,
		MatDialogModule,
		BrowserAnimationsModule
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
