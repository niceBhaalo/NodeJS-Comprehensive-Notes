function callbackFunction(parameter) {
	console.log(parameter.map((x)=>x*2));
}

setTimeout(()=>callbackFunction(65), 2000);
setTimeout(()=>{console.log("Reached End of Second Callback")}, 5000);
