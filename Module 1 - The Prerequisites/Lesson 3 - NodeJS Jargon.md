# NodeJS Technical Definition

Node.js is a server-side JavaScript runtime environment built on Chrome's V8 engine, 
leveraging an event-driven, non-blocking I/O model to achieve high concurrency and scalability. 
It utilizes the single-threaded event loop paradigm, asynchronous callbacks, 
and promises to handle multiple simultaneous network requests efficiently. 
Node.js employs the CommonJS module system for modularization and integrates 
with npm for package management, facilitating rapid development of scalable 
network applications and microservices.

Let's go over all the jargons. 

## Server-side
This means that the NodeJS is used to run your application logic on the server side instead of the client side 
which is on the user's device. Apart from that, this jargon is useless.

## V8 Engine
Chrome's V8 engine is developed by Google to execute Javascript code used by both browsers and Node.js itself. It
is the entity that compiles JS into machine code among other things like garbage collection. 

## Event-Driven
First let's talk about what is the opposite of Event-Driven. The opposite of event driven is synchronous or blocking 
execution. Like any other pieces of code in a function.
```
const a = 5;
const b = 2;
console.log(a+b);
```
These are synchronous and blocking because no line can be executed without executing the previous one. 

Event-driven means that some code is attached to a listener or handler. A pseudo code can be something like
```
1. Create Event Listener on Incoming HTTP requests. 
2. If request is valid send valid response
3. Else send error response.
```

A NodeJS application is littered with such listeners that are waiting on various other services, routes and stuff. 
Such as.
``` 
app.listen(3000, () => {
    console.log('Server is listening on port 3000');
});
```
This code is not executed at runtime. Instead the app waits and listens on port 3000. 
If it gets a hit, whatever is inside the code block is run. The code block is called a callback function 
in this example as upon receiving a hit on port 3000, the code will call the anonymous function defined as a parameter. 

## Single-Threaded
NodeJS can only perform only one operation at a time just like humans. Do not judge. You do not have to manage multiple threads or try to separate executions by dividing logic into multiple threads. 

## Non Blocking I/O Model
I/O stands for Input Output. A NodeJS application is always going to be doing reading and writing operations. And 
naturally it will have to wait. For example, when reading items from an external API like a weather API, the NodeJS 
is going to send a request to receive data for the city of London. Instead of waiting for a response, NodeJS creates a listener. 
The pseudo code looks like this. 

``` 
Sending Request Part
1. Send Request to External Weather API. 
2. When and if receive a response, call this function (also an example of a callback function). 

Callback Function
1. If data is valid, perform this operation on weather data. 
2. If data is invalid, return this error.
``` 

So NodeJS being single threaded cannot wait for the external resources to respond. It simply trusts the 
created listeners and callback functions to come back to that part of the code when the data is received. 


This also applies to write mechanisms. Say we have to save some data in the database. The user sends some data
to the NodeJS. NodeJS then sends that data to the correct database. And then NodeJS has to wait for database to 
confirm that the data was safely and properly written. 
The pseudo code looks like this. 

```
Send Data Part
1. Send user data to database. 
2. Create a listener to receive feedback from database using a callback function. 

Callback Function
1. If database returns success, notify user of success.
2. If database returns error, notify user that there was an error.
```

NodeJS does not wait and cannot wait for the database to either return a success or failure message. It is 
going to trust its listeners to inform him when there is a response. Meanwhile NodeJS is itself free to do other 
stuff it needs to do. 

Mainly this means that the same NodeJS can receive thousands of read and write requests and all are passed 
to the various end points without waiting on fully completing the previous ones. To clarify. 

Say every second a different user wants to store some data in a database and then receive confirmation. 
And that every database operation takes 10 seconds to complete. 

So every second NodeJS creates a new listener for each new user. And mathematically for this scenario, we will 
have 10 listeners active waiting for confirmation messages, each user is going to get a response in 10 seconds
and no user will have to wait for a different user's completion without getting their own. 

## High Concurrency

The above mentioned paragraph is what we call high concurrency. That a lot of different users can simultaneously 
send requests to the server and all the users get their responses without losing too much performance. 

Obviously there is a limit to this because NodeJS has to per second create these listeners and maintain these listeners 
in its memory until the listener is resolved. But this limit is in tens of thousands and depends on the workload for each listener and event. 

## High Scalability

The difference between Concurrency and Scalability is that concurrency refers to the ability to handle multiple 
operations at once using callback functions. Scalability refers to the ability to handle increasing workloads 
and user demands when they grow beyond a certain stage. 

There are many ways to handle scaling your app. 

1. Method 1: Micro Services. You can break up your app into multiple micro services if applicable to your application
so that the load on any one service doesn't affect others and each service is given its separate resources. This 
means you have multiple NodeJS applications that communicate with each other instead of one application communicating 
with its modules. 

2. Method 2: Clustering. NodeJS has a built in cluster module allowing the NodeJS to spawn multiple instances of the same
application over separate CPU cores. Everything is connected to the same port but you get more resources if you
have more CPU cores. 

3. Method 3: Load Balancer And Stateless Design. Load Balancers are external to NodeJS but if your design is 
stateless, then you can have multiple (as many as you want) NodeJS servers and a load balancer that knows 
how many resources each NodeJS is consuming and directing traffic to the appropriate server. And with docker,
kubernetes, and a little magic, you can set it up that new instances of NodeJS server are intialized based on
increasing loads and then taking down extra servers when traffic goes down a bit. But this requires that your 
design is stateless. 

## Stateless Design

When a user logs in to your application, it is usually the NodeJS server instance that manages session management
for a user. In simpler terms, there is some short to medium term data that is stored in the NodeJS application itself. 
This is not stateless. Stateless means that no user record of any form is directly stored in NodeJS memory but instead some
other solutions are used including databases and caching to ensure that the user gets the same experience and data
regardless of whichever NodeJS instance the user connects to. 

## CommonJS Module System

Any NodeJS application is going to be composed of multiple modules. These modules are separate files and packages
that have to be exported and imported. CommonJS Module System refers to the syntax structure that NodeJS uses
as a default to import and export these modules. These use the `require` and `module.exports` keyword among other. 

There is also the ES Module system, where `require` is replaced with `import`.

## npm Package Manager

I hope I don't have to go into more details on this one. Use npm to create and initialize projects, use it to 
install and uninstall dependencies instead of manually editting package.json file unless necessary. 

