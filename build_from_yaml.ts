import YAML from 'yaml';
import { readFile } from 'fs';

function main() {
	readFile("./cv.yml", 'utf8', (err, data) => {
		console.log(data);
	});
}

main();

// if (require.main === module) {
//   main();
// }
