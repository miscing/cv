import { HostBinding, Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-banner',
	templateUrl: './banner.component.html',
	styleUrls: ['./banner.component.scss']
})
export class BannerComponent implements OnInit {
	@HostBinding('hidden') hide :boolean;

	constructor() {}

	ngOnInit(): void {
	}

	toggleHide() :void {
		this.hide = !this.hide
	}

	printPdf() :void {
		this.toggleHide();
		setTimeout(() => {
			window.print();
			this.toggleHide();
		}, 500);
	}
}
