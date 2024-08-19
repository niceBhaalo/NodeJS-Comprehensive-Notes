# Error Handling Basics

In synchornous programming, dealing with errors is quite simple since you know what data is coming in
and you know how to perform operations on that data. 

But when we are using callback functions and dealing with outside data, there are a multitude of things 
that can and will go wrong. Maybe there is a connectivity issue, maybe there is an authentication issue, 
or maybe there is a corrupted data issue. In short, your code will attempt to perform some operation on 
a third party data which will throw an error and stop your execution. 

These are upstream errors meaning they happen when some expected data comes back to NodeJS. 

Let's deal with them using the trusty try catch block. 

Look at this code snippet. 

```javascript
function callbackFunction(parameter) {
	console.log(parameter.map((x)=>x*2));
}

setTimeout(()=>callbackFunction(65), 2000);
setTimeout(()=>{console.log("Reached End of Second Callback")}, 5000);


```
We have made a callbackFunction that expects an error to perform the map operation on. 
But we are only passing an integer 65 instead of an error. So the app is going to wait for 2 seconds as prescribed, 
try to call the callbackFunction. Receive a type error and crash. 

Let me be clear here, say you are reading some data from a third party website and they always send an array when 
requested and then something happens and they send some unexpected data type, if you are using this, your server
will crash and will need a restart. This is simply not feasible when there are thousands of incoming requests and 
any one of them could have some unexpected data that causes errors. Even listeners currently active like the second setTimeout will be aborted that had nothing to do with the callbackFunction. 

So when dealing with data from external sources, we use something called a try catch block like this. 

```javascript
function callbackFunction(parameter) {
	try {
		console.log(parameter.map((x)=>x*2));
	} catch (error) {
		console.log("Error at callbackFunction: ", error);
	}
}

setTimeout(()=>callbackFunction(65), 2000);
setTimeout(()=>{console.log("Reached End of Second Callback")}, 5000);

```
Now instead of the server crashing, it is just going to display the error in the console.log and keeps churning on
with the rest of the activities like completing the second setTimeout. Check it out yourself how without using the try catch the "Reached End of Second Callback" will not be executed. 
This is the essence of error handling. Whenever you are doing some operation on data that you do not own, meaning you
read the data from a database or you are reading and parsing through user submitted data, or a third party API, put all of that 
code in a try catch block to ensure that any error that happens does not crash your app. 

This is only basics though. Especially since we are just calling a callbackFunction and not expecting a response from it. More on that in the next lecture. 