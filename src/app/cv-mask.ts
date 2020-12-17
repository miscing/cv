import { Cv} from "./cv";

export class CvMask {
	mask :any[];
	add :boolean; //this tells you if you should add or remove the mask
	constructor(mask :any[], add :boolean) {
		this.mask = mask;
		this.add = add;
	}
}

export class MaskApplier {
	cv :Cv;
	seenMasks :Map<string, number>;

	constructor(cv :Cv) {
		this.cv = cv;
		this.seenMasks = new Map();
	}

	ApplyMask(mask :any[]) {
		switch (mask.length) {
			case 1:
				delete this.cv[mask[0]];
				break;
			case 2:
				this.cv[mask[0]].splice(mask[1]-this.correction(mask[0]), 1);
				this.setCorrection(mask[0]);
				break;
			case 3:
				this.cv[mask[0]][mask[1]].splice(mask[2]-this.correction(mask[1]), 1);
				this.setCorrection(mask[1]);
				break;
			default:
				console.error("Received mask of invalid length, must be between 1-3. Got: ", mask.length, "\nmask: ",mask);
				break;
		}
	}

	setCorrection(key :string) :void {
		if( this.seenMasks.has(key)) {
			this.seenMasks.set(key, this.seenMasks.get(key)+1)
		} else {
			this.seenMasks.set(key, 1)
		}
	}

	correction(key :string) :number {
		let res :number;
		if( this.seenMasks.has(key)) {
			res = this.seenMasks.get(key);
		} else {
			return 0;
		}
		if( res >= 0) {
			return res;
		}
		return 0;
	}
}
