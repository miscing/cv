export class CvMask {
	mask :any[];
	add :boolean; //this tells you if you should add or remove the mask
	constructor(mask :any[], add :boolean) {
		this.mask = mask;
		this.add = add;
	}
}
