const newPromise = findingPharmacies(clientLocation, 'www.pharmacies.com/url/location')
	.then((pharmacy)=>{
		console.log(pharmacy);
		return openTimes(pharmacy, 'www.openTimes.com/url/pharmacy');
	})
	.catch((error)=>{
		console.log(error);
	});

newPromise
	.then((isOpen)=>{
		console.log(isOpen);
	})
	.catch((error)=>{
		console.log(error);
	});