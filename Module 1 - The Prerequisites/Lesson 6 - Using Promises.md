# Why do we need promises?

Until now, we have seen how callback functions work, NodeJS attaches a function to some listener like setTimeout
and which calls the attached function when some conditions meet. 

But, what if instead of just calling the function, we then also need to perform another operation after the previous one. 

The pseudo code is this. 
1. We create and attach a callback function to a listener. 
2. The listener at its own pace calls the callback function. 
3. And if the callback function is successful, NodeJS has to do something else like a Function 2. 

One way would be to simply nest Function 2 inside the main callback function but that is not ideal for three reasons. 
Nested callbacks if you recall from an example is Lesson 4 get very unreadable very fast. Second, maybe sometimes 
you need to call Function 3 after the same callback function in another instance and you will have to create an entire new callback function which has now Function 3 nested. 
Lastly, the reason why that is not ideal is because of a principle called Single Priority Functions. This is just a 
recommended way of writing code that a single function should only do one single thing. Nesting one into another may sometimes 
be fine but mostly it will be violating this principle. 

So, then. If we shouldn't use nested callback functions, what should we use? 

Promises. 

## What are Promises? 

A promise is a javascript object which allows you to listen to some asynchronous activity and allow you to connect 
and link multiple asynchronous activities. 

So let's take the following example. 

```javascript
function callbackFunction(parameter) {
	try {
		return(parameter.map((x)=>x*2));
	} catch (error) {
		return(null);
	}
}

const myPromise = new Promise(() => {
	setTimeout(()=>{
		const output = callbackFunction([1,2,3]);
		console.log(output);
	}, 2000);
});
```

Right now, this is what happens. When you initialize a promise like this, whatever code you wrote inside it is executed. 
When you run this code, you will see that it returns an array in the console.log(output) statement. 

Let's create a context for this code. You had to wait 2 seconds and then call the callback function and log its output. 
The callbackFunction either returns a proper array or it returns null if there was an error. Now you want the following. 
If you got the array, let's just display it. And if you had an error, you display a dummy array. 

This is called resolving or rejecting a promise. So when you have the ideal situation, that is resolving the 
promise. And when there is an error, you reject the promise. 

## Resolving and Rejecting Promises

And this resolve and reject is done exactly how you would return a value from a function. We change the promise like this.
```javascript
const myPromise = new Promise((resolve, reject) => {
	setTimeout(()=>{
		const output = callbackFunction(65);
		if (output === null) {
			reject();
		} else {
			resolve();
		}
	}, 2000);
});
```
Now running this on its own will throw an error because of a different reason. But I just want to explain this 
chunk of code. A promise takes not just any anonymous function as an input, instead it takes an anonymous function
with the two optional parameters that you can name, the first refers to resolve and the other to reject. These 
are just listener names.
Functionally the code is equivalent to. 
```javascript
const myPromise = new Promise((banana, apple) => {
	setTimeout(()=>{
		const output = callbackFunction([1,2,3]);
		console.log(output);
		if (output === null) {
			apple();
		} else {
			banana();
		}
	}, 2000);
});
```
Just remember that the first is for resolving, and the other is for rejecting and these are just placeholder listeners. 
So what are they listeners for exactly? 

## .then() function

A promise is a javascript object with an in-built function called then function. 
The resolve listener is tied to the then function. 

We describe the then function like.

```javascript
myPromise.then(()=>{console.log("I am resolved"));
```
So, for this code. 

```javascript
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
		console.log(output);
		if (output === null) {
			reject();
		} else {
			resolve();
		}
	}, 2000);
});

myPromise.then(()=>{console.log("I am Resolved")});
```
We will get the following output. 
```text
[ 2, 4, 6 ]
I am Resolved
```
When the code reached the resolve code, it looked for a .then() invocation for the myPromise. Since it was 
present and defined, the anonymous function inside the .then() is then executed. Obviously you will be including a .then() for any 
promise but if for some reason you forgot to do it, you won't get an error. 

But say you had this code where the promise was going to be rejected. 

```javascript
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
		console.log(output);
		if (output === null) {
			reject();
		} else {
			resolve();
		}
	}, 2000);
});

myPromise.then(()=>{console.log("I am Resolved")});
```

This is going to throw an error because the reject listener is looking for a .catch() invocation. And unlike .then(), if 
it doesn't find one, it is going to throw an error and break your script. 

So you would provide this .catch() function like this. Basically a promise object also has a .catch() function for 
this purpose. 

```javascript
myPromise.catch(()=>{console.log("I am Rejected")});
```

So there is a world where you can only provide a catch function without a then function but you must never 
provide a then function alone without a catch function. 

However, now things get confusing. What if you want to provide both a then and catch function? You can't 
just combine the two paths like 

```javascript
myPromise.then(()=>{console.log("I am Resolved")});
myPromise.catch(()=>{console.log("I am Rejected")});
```
This is not going to work. It is going to throw an error. Instead you have to do it in one line, first calling .then() and then calling .catch() on its output.

```javascript
myPromise.then().catch()
```
The reverse doesn't work. It won't give you an error. But if you write `.catch()` first and then write `.then()`, the resolve will work fine, but for rejection, 
first the `.catch()` function will be called and then the `.then()` function will be called. So both will be called in case of a rejection of a promise. That is a different can of worms. I won't go into the why of that right now.  
So you will write the `.then()` and `.catch()` like this for out example. 

```javascript
myPromise.then(()=>{console.log("I am Resolved")}).catch(()=>{console.log("I am Rejected")});
```
Or, structured like this for better understanding.

```javascript
myPromise
	.then(()=>{console.log("I am Resolved")})
	.catch(()=>{console.log("I am Rejected")});
```

Let's look at the complete code. 
```javascript
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
		console.log(output);
		if (output === null) {
			reject();
		} else {
			resolve();
		}
		setTimeout(()=>{
			console.log("Waiting")
		}, 2000);
	}, 2000);
});

myPromise
	.then(()=>{console.log("I am Resolved")})
	.catch(()=>{console.log("I am Rejected")});
```

Let's Summarize what we have so far. 
We created a promise that runs some business logic. Based on the result of that business logic, we had 
to perform a different function. So we created a resolve path and a reject path. You must have a reject path
setup using catch but then is optional but usually you will have both .then() and .catch(). 

I have added the second setTimeout to test and show that not providing a catch statement when a reject is received breaks the script and your server. 

## Passing Values using Resolve and Reject

Now the main purpose of promises is not going to be simply having two different paths, but actually returning 
some values from the asynchronous processes that were going on in the promise. Returning values is quite simple. 

Instead of just using `resolve()`, you use `resolve(value)` and its the same for reject. 

We can change our code to the following. 

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

Play around with this to be fully comfortable with parsing the syntax of a promise. 