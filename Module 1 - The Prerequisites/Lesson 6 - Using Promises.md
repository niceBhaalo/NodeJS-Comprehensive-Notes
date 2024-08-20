# Why do we need promises?

Until now, we have seen how callback functions work, NodeJS attaches a function to some asynchronous event
which we are simulating with setTimeout and this function is called when the asynchronous response is 
met.  

So imagine this scenario. You called a weatherAPI to provide some data. You can't wait for the data while 
the rest of the server is stalled. So you tell weatherAPI that whenever you have a response available,
send it to this callback function. 

For example it will look like this in pseudocode. 

callingWeatherAPI((data)=>{
	console.log(data);
}, 'www.weather.com/url');

This is not correct syntax. But effectively you tell weather.com that whenever you have some data for me, 
you put that into this anonymous function which then performs some operation. This works but is not scalable.

Let's make it specific. Say your user gives you their location and a medication they want. So 
you have to find the closest pharmacy to them. And you have an API called findingPharmacy that does that. 

findingPharmacy(clientsLocation, (pharmacy)=> {
	console.log(pharmacy);
), 'www.pharmecies.com/url/location');

But then you say, well I have to check whether the pharmacy is currently open or not. You have an API for that, 
but you need to nest that request inside the previous one because only after you know which pharmacy is 
closest do you check whether that is open. So it will look like this. It's called a nested callback. 

findingPharmacy(clientsLocation, (pharmacy)=> {
	console.log(pharmacy);
	checkingIfOpen(pharmacy.id, (isOpen)=>{
		console.log(isOpen);
	}, www.openTimes.com/url/pharmacy);
), 'www.pharmecies.com/url/location');

And then you have to check whether that open pharmacy has the requested medicine or not. You have an API called 
check medicine that does that but you have to request it inside the inner most function because you will
only check whether the pharmacy has your medicine stocked after you know it is open. 

findingPharmacy(clientsLocation, (pharmacy)=> {
	console.log(pharmacy);
	checkingIfOpen(pharmacy.id, (isOpen)=>{
		console.log(isOpen);
		if (isOpen) {
			checkingStock(medicineName, (isStocked)=>{
				console.log(isStocked);
			}, 'www.medicineStock.com/url/medicine');
		}
	}, 'www.openTimes.com/url/pharmacy');
), 'www.pharmecies.com/url/location');

And if the medicine is stocked, you need to return to the user that your medicine could be found at this 
pharmacy but this pharmacy closes at this certain time. 
And since this is just the pseudo code, you can imagine how complicated this nesting can get. This is 
colloquially known as callback hell. Technically this works, but you need so many error handling attached
to even simple nesting like this that we 
need a different way that is easier, scalable, and more modular. 

## What Are Promises?

That solution requires a NodeJS object called Promise. 

But firstly promises solve an even basic problem. Which is how do you know if the data being received 
is an error or valid data without checking it yourself? Promises provide a way for API developers to inform
their users whether an API request is sending valid data or something went wrong and this is an error. 

For this, we have to construct a promise. 

Let's say we have the findingPharmacies API. Without a promise, you will have something like this. 

```javascript
function findingPharmacies (clientLocation) {
	try {
		const closestPharmacy = findSmallestDistance(clientLocation, listOfPharmacies);
		return (closestPharmacy);
	} catch (error) {
		return (error);
	}
}
```
And now it is for the user to have an if statement to know whether the response is an error or a valid pharmacy. 
An error could occur here for many reasons the simplest being incorrect formatting of client's location 
or connection issues. Instead of making the user of the API manually check for errors, the API 
developer will create a promise like this. 
### Creating A Promise

```javascript
function findingPharmacies (clientLocation) {
	const myPromise = new Promise ((resolve, reject) => {
		try {
			const closestPharmacy = findSmallestDistance(clientLocation, listOfPharmacies);
			resolve (closestPharmacy);
		} catch (error) {
			reject (error);
		}
	});
	return (myPromise);
}
```
So instead of their being two or multiple return statements, the API developer uses the keywords resolve and reject
(and there could be multiple resolves and rejects in a single promise). Only one of them is going to be 
hit during one single execution. Effectively, both resolve and reject do the function of the return 
statement while also notifying whether the returned value is a valid and useful value or it is an 
error message. The resolve value will have the valid value, and the reject value will have the error value. 

And the function itself returns the Promise object instead of the individual paths. To access the two 
possible paths, a Promise has two functions called .then() and .catch(). And we call 
both of these functions on the returned promise. 

### Receiving a Promise

```javascript
findingPharmacies(clientLocation, 'www.pharmacies.com')
	.then((data)=>{
		console.log(data);
	})
	.catch((error)=>{
		console.log(error);
	});
```

So to reiterate, `findingPharmacies()` returns a promise which has a .then() and .catch() function which 
we are calling in this example. 

The user of the API which will be you can then access separately the .then() path and the .catch(). 
If behind the scenes the API had hit the resolve(closestPharmacy) the flow of execution will continue to
the .then() function. And if there was an error and reject(error) was hit, you will continue 
the flow of execution from the .catch() function bypassing the .then() function. 

So this is the first main benefit of promises. The API does not return the data but it returns a promise. 
And then you can access the properties of a promise which are .then() and .catch(). And it is these two 
properties that are basically hiding the data or the error inside them. 

Now let's look at some working code that uses a promise that you can play with. Let's create an API 
that does the following. It receives an array of integers and then it doubles every value and returns 
the array. Without a promise, it looks like this. 

```javascript
function doublingArrayValues (inputArray) {
	try {
		return(parameter.map((x)=>x*2));
	} catch (error) {
		return("Error at callbackFunction: ", error);
	}
}

const newArray = doublingArrayValues([1,2,3]);
console.log(newArray);
sendResponseToUser(newArray);
```

You should see the problem here. Sometimes newArray would be a valid array and other times it will be an 
error string making it unusable as an array. 
You could then use an if else statement to figure out if newArray is a valid string with integers and what-not
but let's use a promise. 

```javascript
function doublingArrayValues (inputArray) {
	const myPromise = new Promise ((resolve, reject) => {
		try {
			resolve(parameter.map((x)=>x*2));
		} catch (error) {
			reject("Error at callbackFunction: ", error);
		}
	});

}

doublingArrayValues([1,2,3])
	.then((data)=>{
		const newArray = data;
		console.log(newArray);
		sendResponseToUser(newArray);
	})
	.catch((error)=> {
		console.log(error);
	);
``` 

Now you don't have to use if-else on your own and know all the fringe cases, if the response is valid
it will get sent to the user, if not, you get an error logged. There wouldn't be any confusion whether 
a certain variable has valid data or an error object because the API is not sending data or errors, instead 
it is returning an object called a promise. And you use .then() and .catch() for the two ways your data 
might be valid or invalid. 

### Linking Promises Together 
But now we get to an even better reason for using promises which is linking promises together without 
creating a nested mess. 
Check out this pseudo code.
```javascript
findingPharmacies(clientLocation, 'www.pharmacies.com/url/location')
	.then((pharmacy)=>{
		console.log(pharmacy);
	})
	.catch((error)=>{
		console.log(error);
	});
```

This is a simple and single API call. Now what we want is that if .then() was successful, call another API 
to check openTimes. Conceptually it is easy once you figure out the following. You can return things from 
inside the .then() function. But you can only return another promise. 

Now, since we know that out APIs return promises, then we can simply say
```javascript
const newPromise = findingPharmacies(clientLocation, 'www.pharmacies.com/url/location')
	.then((pharmacy)=>{
		console.log(pharmacy);
		return openTimes(pharmacy, 'www.openTimes.com/url/pharmacy');
	})
	.catch((error)=>{
		console.log(error);
	});
```
So now let's reiterate. The function findingPharmacies returned a promise and we used a .then() function on
that result and then we used that .then() function to return a new promise. So all we need to do is to attach 
a new .then() function to the result of the previous. 
```javascript
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
```

So if the findingPharmacies promise is resolved, the openTimes function returns a new promise in the `newPromise`
 object on which we call another .then() and .catch(). However, when linking promises like this, if 
 you understand Javascript better and you know that you are not going to be referring `newPromise` again, 
 then you can avoid creating a new definition like this. 

 ```javascript
findingPharmacies(clientLocation, 'www.pharmacies.com/url/location')
	.then((pharmacy)=>{
		console.log(pharmacy);
		return openTimes(pharmacy, 'www.openTimes.com/url/pharmacy');
	})
	.then((isOpen)=>{
		console.log(isOpen);
	})
	.catch((error)=>{
		console.log(error);
	});
```
Effectively this is the same as previous where you are utilizing the dot notation and recognizing 
what returns what and how to be more efficient with your code. And if you scale it up, you can add more 
promises to this linking just below the previous as long as every .then() statement returns an API that 
returns a Promise that then has a .then() function and so on. 

```javascript
findingPharmacies(clientLocation, 'www.pharmacies.com/url/location')
	.then((pharmacy)=>{
		console.log(pharmacy);
		return openTimes(pharmacy, 'www.openTimes.com/url/pharmacy');
	})
	.then((isOpen)=>{
		console.log(isOpen);
		return checkStock(medicine, pharmacy, 'www.checkStock.com/url/pharmacy/medicine');
	})
	.then((isStocked)=> {
		console.log(isStocked);
	})
	.catch((error)=>{
		console.log(error);
	});
```

So, with the help of promises, you have have much simpler error handling because whereever the error occurs, it 
gets caught into the one .catch() statement. And the logic is not nested but neatly arranged and 
order in successive .then() statements. And the code itself is so much more readable, scalable, and modular
than using simple callbacks. 

And that right there is the essence of asynchronous programming allowing you to link activities together without 
stalling the entire script. 

I will finish this off with some tests. 

What does this return?

```javascript
function customFunction () {
	const myPromise = new Promise ((resolve,reject)=>{
		resolve(10);
	});
	return myPromise;
}

function customFunction2 () {
	const myPromise = new Promise ((resolve,reject)=>{
		resolve(20);
	});
	return myPromise;
}

const number = customFunction()
	.then((data)=>{
		console.log("Data: ", data);
		return customFunction2();
	})
	.catch((error)=>{
		console.log(error);
	});

number.then((data)=>{
	console.log("Data 2: ", data);
});
```

```text
Data: 10
Data 2: 20
```

What does this return?
```javascript
function customFunction () {
	const myPromise = new Promise ((resolve,reject)=>{
		resolve(10);
	});
	return myPromise;
}

function customFunction2 () {
	const myPromise = new Promise ((resolve,reject)=>{
		resolve(20);
	});
	return myPromise;
}

customFunction()
	.then((data)=>{
		console.log("Data: ", data);
		return customFunction2();
	})
	.then((data)=>{
		console.log("Data 2: ", data);
	})
	.catch((error)=>{
		console.log(error);
	});
```

It returns the same thing. 

```text
Data: 10
Data 2: 20
```

And lastly, what does this return?
```javascript
function customFunction (input) {
	const myPromise = new Promise ((resolve,reject)=>{
		resolve(input*2);
	});
	return myPromise;
}

function customFunction2 (input) {
	const myPromise = new Promise ((resolve,reject)=>{
		resolve(input+10);
	});
	return myPromise;
}

customFunction(10)
	.then((data)=>{
		console.log("Data: ", data);
		return customFunction2(data+50);
	})
	.then((data)=>{
		console.log("Data 2: ", data);
	})
	.catch((error)=>{
		console.log(error);
	});
```
```text
Data: 20
Data 2: 80
```

And just for the fun of it. Let's also parse through a callback hell example. 

```javascript
function customFunction (input) {
	return input + 5;
}

function customFunction2 (input) {
	return input + 10;
}

function customFunction3 (input) {
	return input + 15;
}

setTimeout(()=>{
	const output = customFunction(10);
	setTimeout(()=>{
		const output2 = customFunction2(output);
		setTimeout(()=>{
			const output3 = customFunction3(output2);
			console.log(output3);
		}, 1000);
	}, 1000);
}, 1000);
```
```text
40
```