# Using Callback Functions 

We have discussed the pseudo code of a callback function. Now we shall look at the various 
examples of using callback functions without going into NodeJS itself. 

The see the working of a callback function, we need one activity that takes some time to complete. 

Let's use the setTimeout function.

```javascript
function callbackFunction1() {
	console.log("Callback Function Called");
}

console.log("Calling SetTimeOut");

setTimeout(callbackFunction1, 2000);

console.log("SetTimeOutCalled");
console.log("Reached End of File");
```
Running this snippet returns the following. 
```text
Calling SetTimeOut
SetTimeOutCalled
Reached End of File
Callback Function Called
```

Short and simplified explanation: since this script was run using node filename.js, this is using NodeJS. When the setTimout
function is called, the NodeJS in the backend creates a listener to call the callbackFunction1 when the timer 
is complete. 

## Passing Parameters to the callback function

`setTimout(callbackFunction1(parameter), 2000);` returns an error because `callbackFunction1` is a function
and `callbackFunction1(parameter)` is a function call. They are two different things. And whenever we are 
specifying a function as a callback function, we have to provide a function and not call it. 

So we need to create an anonymous function to ensure that the type requirement is met.

To pass an anonymous function, this is how we do it. 

`setTimeout(()=>callbackFunction1(parameter), 2000);`

## Using an anonymous callback function  

While it may be more readable to define and then assign callback functions where needed, this is cumbersome 
when the callback functions logic is small and does not need to be repeated. Then it is more common to 
define the function within the anonymous function directly. 

Such as 

`setTimeout(()=>{console.log("Callback Function 1 Called")}, 2000);`
Usually this same thing is written like this.

```javascript
setTimeout(()=>{
	console.log("Callback Function 1 Called")
}, 2000);
```
All we are doing is the following.
1. We have some function that is designed to take a callback function, in this case the function is setTimeout. It 
could be anything else. 
2. This function has two parameters, the first has to be a function, not a function call, just a function. The other
parameter is time in milliseconds. 
3. The function can be referenced directly or as an anonoymous function. 
But as you can see the syntax gets very different from normal beginner level syntax. 

You should practice with some callback functions of your own to ensure you understand their delayed operation. 

## Nested Callbacks

I am going to write something confusing here on purpose. The objective is to ensure you can parse JS syntax. 

```javascript
setTimeout(()=>{
	setTimeout(()=>{
		console.log("This is the inner callback function")
	}, 2000);
	console.log("This is the outer callback function");
}, 2000);
```

The output of this snippet is 
```text
This is the outer callback function
This is the inner callback function
```

It is your job to make sure you understand how these nested callbacks worked. Generally we are going to be 
using better practices than nesting callback functions but it is important to have a solid understanding of 
callbacks. 