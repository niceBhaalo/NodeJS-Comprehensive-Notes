## What is a Stream in http

We figured out that response object from the callback of a .http request returns an object that among 
other things inherits properties from a Stream Class. So what exactly is a Stream Class. 

When it comes to reading or writing data online, TCP works with packets that then make up chunks of data. 
When I request data from any website, it does not come in one step directly but it comes in multiple chunks 
with some delays. 

To handle data that is not going to be read or written in one step but instead will be 'streamed', http has 
a class called Stream to handle it. 

Generally we have Readable Streams, Writable Streams, Duplex Streams and Transform Streams. This stream 
concept does not have to be over the internet, any data transfer including reading local files could 
be done through streams. We will go into more details on them later on. Stream is more general purpose 
than just reading data from the internet. But we are mostly going to be using streams for this purpose. 

But let's look at the common methods and events. 

First we have a .on() method which is inherited from an EventEmitter Class. This is essentially a listener 
function where you can setup which event are you listening to. 

And then we have a few events such as 'data', and 'end' for a readable stream. 

```javascript
const http = require('http');
const { Readable } = require('stream');

// Define options
const options = {
    hostname: 'www.google.com',
    path: '/',
    method: 'GET',
};

// Make an HTTP request
const req = http.request(options, (res) => {
    
    res.on('end', ()=>{
        console.log("All Data is Received.")
    });
    res.on('data', ()=>{
        console.log("Receiving New Data");
    });

}).end();
```
This code returns the following for me.
```
Receiving New Data
...
Receiving New Data
Receiving New Data
Receiving New Data
All Data is Received.
```
res inherits the properties of a Stream. It has a 'data' event that we can access through the `.on()` 
method. The data event is triggered everytime a new chunk is received from the stream. The callback 
function is hit again and again. The 'end' event is similarly accessed that is only called once 
per request when there is no more data to receive. 

To read the data that is sent in a chunk, you just need to access it in the anonymous function as 
```javascript
res.on('data', (chunk)=>{
    console.log(chunk);
});
```
chunk itself is a Buffer object that is a sequence of hexadecimal numbers or simple binary data. 
You have to use `chunk.toString()` to convert it to text data if it is a valid HTML or JSON object. 

The rest of the implementation of Stream will come later. This is enough for now. 