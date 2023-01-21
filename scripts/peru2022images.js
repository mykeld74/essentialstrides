import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
const writeFile = fs.createWriteStream('./src/utils/peru2022images.js');

export const peru2022Images = () => {
	cloudinary.api
		.resources_by_tag('peru2022', { max_results: 100 })
		.then((result) => console.log(result.resources));
	// .then((result) => writeFile.write(JSON.stringify(result, null, 2) + ';'));
	// setTimeout(() => {
	// 	writeFile.end();
	// }, 10000);
};

peru2022Images();
