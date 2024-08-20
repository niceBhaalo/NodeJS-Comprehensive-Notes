## Making Promises Better

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

Now, this is readable enough. It's a massive improvement from vanilla callbacks. But it could be better. 
The async await functionality is built on top of promises as syntactic sugar. Meaning under the hood 
nothing is changed. But some different keywords make the readability of the syntax.

## Introducing Async Await

First step is to encapsulate your logic that is dealing with external APIs in a function and put the word
async behind that function. Like this.
`async function myFunction() {}`

The second step is to create a try and catch block. 

The third step is to call your API within the try block with the added await keyword like this.

```javascript
async function showcaseFunction () {
	try {
		const response = await findingPharmacies(clientLocation, 'www.pharmacies.com/url/location');
		console.log(response);
	} catch (error) {
		console.log(error);
	}
}
```
This is what the await does. If the promise was going to be rejected, the rejected value is going to be 
passed into catch as the error. And if the promise was resolved, whatever value was resolved is 
stored in response and then execution continues to console.log(response); The await is going to pause the 
execution until the promise is either resolved or rejected. 

No joke, behind the scenes is exactly the same. findingPharmacies will return a promise. The value resolved 
to .then() is going to be stored in response. And until the promise is resolved and response is populated, 
the execution is not going to move forward. So this is a way to write asynchronous code as synchronous 
where we can pretend that it is working synchronously. However, behind the scenes, we are still using .catch() and
.then(), we just don't have to deal with. 

And let's see how nesting is easier with this. All we have to do is stack these await statements. 

```javascript
async function showcaseFunction () {
	try {
		const pharmacy = await findingPharmacies(clientLocation, 'www.pharmacies.com/url/location');
		const isOpen = await checkOpen(pharmacy, 'www.openTimes.com/url/pharmacy');
		const isStocked = await checkStock(medicine, pharmacy, 'www.checkStock.com/url/pharmacy/medicine');

		return ({"pharmacy": pharmacy, "isOpen": isOpen, "isStocked": isStocked});
	} catch (error) {
		console.log(error);
	}
}
showcaseFunction();
```

And that's it. No multiple .then() statements. No nesting. Let's reiterate the important points. 
You must encapsulate this logic in a larger block or module like a function so that you can put the 
async keyword telling NodeJS to know you are going to be dealing with promises and waiting on them. 

Then you must use await before calling the third party functions. Those functions have to return promise 
objects for this to work. If the API is not returning a promise, you most likely won't get an error. But 
logically it will be flawed in execution. 

So now you have enough of an understanding of Javascript and Asynchronous Programming to get your hands
dirty with the real stuff. 

Most of this was with pseudo code, understanding is more important than syntax right now. 

Let's do a quick test. What is the output of this? 

```javascript
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
```
```text
80
```