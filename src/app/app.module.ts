import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';

import { AppComponent } from './app.component';
import { ProfileComponent } from './profile/profile.component';
import { BannerComponent } from './banner/banner.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SkillsComponent } from './skills/skills.component';

@NgModule({
	declarations: [
		AppComponent,
		ProfileComponent,
		BannerComponent,
		SkillsComponent
	],
	imports: [
		BrowserModule,
		MatButtonModule,
		MatToolbarModule,
		MatIconModule,
		BrowserAnimationsModule
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
