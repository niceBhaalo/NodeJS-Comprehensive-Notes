## Reviewing Promises

```javscript
function callbackFunction(parameter) {
	try {
		return(parameter.map((x)=>x*2));
	} catch (error) {
		return(null);
	}
}

const myPromise = new Promise((resolve, reject) => {
	setTimeout(() => {
		const output = callbackFunction(65);
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
```

Let me first talk about this code. Functionally, this is how asychronous code is written as. First we have 
some code that is going to run inside the promise. That is a separate code block on its own. 

And the corresponding .then() and .catch() statements are going to be in a separate block of code. Maybe even separated 
by other lines of codes and things get confusing. But our minds love how synchronous programming works. So
some very smart people worked on the promises to give it a better developer experience and make it feel like 
synchronous execution. 

Under the hood, the technology remains the same, but we use async and await to make promises more readable. 
And we do this my combining the promise and the .then() and .catch() statements in the same block. 

## Converting Promises to Async Await

```javascript
function callbackFunction(parameter) {
	return(parameter.map((x)=>x*2));
}

async function testingAsync () {
	try {
		const output = await callbackFunction([1,2,3]);
		console.log(output);
	} catch (error) {
		console.log("Callback Function Returned Null");
	}
}
testingAsync();
```

There are some changes but way more simplifications, we can see that the code is cleaner and more 
readable. Let's see how to construct a promise using async await. 
Firstly, we need the async keyword that tells NodeJS that this block of code is going to have atleast one 
asynchronous activity. And this authorizes the use of he await keyword to show which activity is 
asynchronous. 
But the async keyword goes behind a function so you will have to encapsulate your logic inside a function. 

So we created a function called testAsync and put the keyword async behind it. Then, we need to create a try catch
block to catch errors that may happen. Whatever is in the try block will try to execute and if there is an
error it will start to execute the catch block. 

In the try block, first we will include what the promise was meant to be intialized as. Earlier on, in the 
promise we were calling the callbackFunction and storing it in the output. 
Here we are doing the same. But this time with the await keyword. The await keyword tells NodeJS that this 
line is a promise. If the promise is resolved, continue on to the next line under the await line. If the 
promise is rejected, then move to the catch block. 

So, once we have the await line, we are going to put everything that would go in the .then() function in a 
promise just underneath this. No need for a separate definition. Then we close the try block and open a 
catch block and this behaves exactly as the .catch() block in a promise. 

Looking at the code, we see that the entire asynchronous fits nicely into one function with all the 
possible routes of execution encapsulated together in one block instead of multiple and different definitions. 
This also removes the margin of error with mismanaging promises. 

However, the try catch block can be a bit tricky. For example, the following code does not work. 

```javascript
function callbackFunction(parameter) {
	return(parameter.map((x)=>x*2));
}

async function testingAsync () {
	try {

		setTimeout(()=>{
			const output = await callbackFunction(65);
			console.log(output);
		}, 2000);

	} catch (error) {
		console.log("Callback Function Returned Null");
	}
}
testingAsync();
```
There are not one but multiple issues here. 
The first one is that the await keyword must be directly inside a async function. We are using 
await inside a synchronous anonymous function. 
So we will need to change the anonymous function into an async function and remove async from the main function call. 
```javascript
function callbackFunction(parameter) {
	return(parameter.map((x)=>x*2));
}

function testingAsync () {
	try {

		setTimeout(async ()=>{
			const output = await callbackFunction(65);
			console.log(output);
		}, 2000);

	} catch (error) {
		console.log("Callback Function Returned Null");
	}
}
testingAsync();
```

We now have solved one problem but now this still does not work because of the way try catch works. 
Try catch only works with synchronous code inside the block. setTimeout() is asynchronous. Any error that 
occurs inside its anonymous function will not be caught and lead to breaking the site. 

While this is a wonky scenario, but its important to understand scope of the try catch blocks and its interactions with callback 
functions. So we will shift the try catch block inside the setTimeout for this to work. 

```javascript
function callbackFunction(parameter) {
	return(parameter.map((x)=>x*2));
}

function testingAsync () {

	setTimeout(async ()=>{
		try {
			const output = await callbackFunction(65);
			console.log(output);
		} catch (error) {
			console.log("Callback Function Returned Null");
		}
	}, 2000);
} 
testingAsync();
```

So let me summarize, always have a try catch block directly around the await line. The await needs the 
async function in its immediate parent function whether that is anonymous or not. To make a function 
asynchronous simply add async behind its definition. 

And know that try catch block catches synchronous errors. Await keyword effectively makes an asycnchronous 
activity look like synchronous and hence the try catch block works without using if statements, resolve, 
and reject. 

Usually you will not be working with setTimeout, but it is a good thing to practice with to help your understanding 
of scopes, callback functions, and more. 

One last item. await works in this 