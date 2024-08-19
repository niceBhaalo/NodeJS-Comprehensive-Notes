function callbackFunction(parameter) {
	try {
		return(parameter.map((x)=>x*2));
	} catch (error) {
		return(null);
	}
}

const myPromise = new Promise((resolve, reject) => {
	setTimeout(() => {
		const output = callbackFunction([1,2,3]);
		if (output === null) {
			reject("Callback Function Returned Null");
		} else {
			resolve(output);
		}
		setTimeout(()=>{
			console.log("Waiting")
		}, 2000);
	}, 2000);
});

myPromise
	.then((resolveValue)=>{console.log(resolveValue)})
	.catch((rejectValue)=>{console.log(rejectValue)});
