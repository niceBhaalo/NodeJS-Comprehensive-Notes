function customFunction (input) {
	const myPromise = new Promise ((resolve,reject)=>{
		resolve(input + 10);
	});
	return myPromise;
}

function customFunction2 (input) {
	const myPromise = new Promise ((resolve,reject)=>{
		resolve(input + 20);
	});
	return myPromise;
}

async function showcaseFunction () {
	try {
		const output1 = await customFunction(50);
		const output2 = await customFunction2(output1);

		console.log(output2);
	} catch (error) {
		console.log(error);
	}
}
showcaseFunction();