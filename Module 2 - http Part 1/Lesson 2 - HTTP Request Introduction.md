## Making an HTTP Request

http.request is a function with the following parameters. 
```
http.request(options[, callback])
http.request(url[, options][, callback])
```
Meaning you can pass a URL as the first parameter with options and callback being optional. 
Or you can just pass the options object which will hold the URL inside it and the callback is again optional. 

In JS documentation, having a comma behind a parameter shows that this is optional. 

If you provide both url and options, they are both combined together with options information taking precedence. 

```javascript
const http = require('http');

const url = 'http://www.google.com';
http.request(url);
```

Effectively this does nothing because we are not asking it to do anything. 
If we do `console.log(http.request(url));`. We should see an output like 
```
ClientRequest {
  _events: [Object: null prototype] {},
  _eventsCount: 0,
  _maxListeners: undefined,
  outputData: [],
  outputSize: 0,
  writable: true,
  destroyed: false,
  _last: true,
  chunkedEncoding: false,
  shouldKeepAlive: false,
  maxRequestsOnConnectionReached: false,
  _defaultKeepAlive: true,
  useChunkedEncodingByDefault: false,
  sendDate: false,
  _removedConnection: false,
  _removedContLen: false,
  _removedTE: false,
  strictContentLength: false,
  _contentLength: null,
  _hasBody: true,
  _trailer: '',
  finished: false,
  _headerSent: false,
  _closed: false,
  socket: null,
  _header: null,
  _keepAliveTimeout: 0,
  _onPendingData: [Function: nop],
  agent: Agent {
    _events: [Object: null prototype] {
      free: [Function (anonymous)],
      newListener: [Function: maybeEnableKeylog]
    },
    _eventsCount: 2,
    _maxListeners: undefined,
    defaultPort: 80,
    protocol: 'http:',
    options: [Object: null prototype] { noDelay: true, path: null },
    requests: [Object: null prototype] {},
    sockets: [Object: null prototype] { 'www.google.com:80:': [Array] },
    freeSockets: [Object: null prototype] {},
    keepAliveMsecs: 1000,
    keepAlive: false,
    maxSockets: Infinity,
    maxFreeSockets: 256,
    scheduling: 'lifo',
    maxTotalSockets: Infinity,
    totalSocketCount: 1,
    [Symbol(kCapture)]: false
  },
  socketPath: undefined,
  method: 'GET',
  maxHeaderSize: undefined,
  insecureHTTPParser: undefined,
  joinDuplicateHeaders: undefined,
  path: '/',
  _ended: false,
  res: null,
  aborted: false,
  timeoutCb: null,
  upgradeOrConnect: false,
  parser: null,
  maxHeadersCount: null,
  reusedSocket: false,
  host: 'www.google.com',
  protocol: 'http:',
  [Symbol(kCapture)]: false,
  [Symbol(kBytesWritten)]: 0,
  [Symbol(kNeedDrain)]: false,
  [Symbol(corked)]: 0,
  [Symbol(kOutHeaders)]: [Object: null prototype] { host: [ 'Host', 'www.google.com' ] },
  [Symbol(errored)]: null,
  [Symbol(kHighWaterMark)]: 16384,
  [Symbol(kRejectNonStandardBodyWrites)]: false,
  [Symbol(kUniqueHeaders)]: null
}
```

This means that http.request actually returns a class called Client.Request with all of these 
properties. You can populate some of these properties by yourself using the options object most 
commonly host, method, headers, path, protocol, and more. 

So instead of passing url directory, let's use an options object. 

```javascript
const http = require('http');

const options = {
    hostname: 'www.google.com',
    path: '/',
    method: 'POST',
    protocol: 'http:',
    port: 1241,
    keepAlive: true,
};

console.log(http.request(options));
```

You can try logging this yourself and see how the options object populates the ClientRequest class. 
Now this doesn't work because the method is POST. I changed it from GET to see it change. Also the port 
is wrong. 

But let's be very clear about it, so far you haven't actually sent a request. You have only returned 
a ClientRequest class. 

So send a request, you do the following. 

```javascript
const http = require('http');

const options = {
    hostname: 'www.google.com',
    path: '/',
    method: 'GET',
};

const req = http.request(options, (res) =>{
    console.log("Control Here");
    console.log(res);
});

req.end();
```
So in first step you create a ClientRequest class using http.request. And to send the request you have to 
then use .end() on the created class. The request is not send unless .end() is called. 
I am not going to print the hundreds of lines of response that `console.log(res)` will print. 
So let's figure out what res returns. 

Using `console.log(typeof(res));`, we get that it returns an object. So let's see its properties using
`console.log(Object.getOwnPropertyNames(res));`
```text
[
  '_readableState',   '_events',
  '_eventsCount',     '_maxListeners',
  'socket',           'httpVersionMajor',
  'httpVersionMinor', 'httpVersion',
  'complete',         'rawHeaders',
  'rawTrailers',      'joinDuplicateHeaders',
  'aborted',          'upgrade',
  'url',              'method',
  'statusCode',       'statusMessage',
  'client',           '_consuming',
  '_dumped',          'req'
]
```
These are all the properties that are in the response, but this is not a simple JSON object. These 
are only some of the properties that you can and will need to request. You can log these different properties
and see what happens, search what these are. 

But more importantly, res is an object of a certain class which we can find by calling
`console.log('Constructor of res:', res.constructor);`

This returns 
`Constructor of res: [Function: IncomingMessage]`. Meaning that res is an instance of the IncomingMessage 
class from http. But the story doesn't end here. Where does this IncomingMessage class comes from? 
`console.log("Prototype: ", Object.getPrototypeOf(res));` and we get the response 
```text
Prototype:  Readable {
  setTimeout: [Function: setTimeout],
  _read: [Function: _read],
  _destroy: [Function: _destroy],
  _addHeaderLines: [Function: _addHeaderLines],
  _addHeaderLine: [Function: _addHeaderLine],
  _addHeaderLineDistinct: [Function: _addHeaderLineDistinct],
  _dump: [Function: _dump]
}
```
Meaning that IncomingMessage inherits properties from a Readable Class from http. And checking further we 
can see if Readable inherits things from somewhere else. 
```javascript
    console.log("Prototype's Prototype: ", Object.getPrototypeOf(Object.getPrototypeOf(res)));
```
This gives.
```text
Prototype's Prototype:  Stream {
  destroy: [Function: destroy],
  _undestroy: [Function: undestroy],
  _destroy: [Function (anonymous)],
  push: [Function (anonymous)],
  unshift: [Function (anonymous)],
  isPaused: [Function (anonymous)],
  setEncoding: [Function (anonymous)],
  read: [Function (anonymous)],
  _read: [Function (anonymous)],
  pipe: [Function (anonymous)],
  unpipe: [Function (anonymous)],
  on: [Function (anonymous)],
  addListener: [Function (anonymous)],
  removeListener: [Function (anonymous)],
  off: [Function (anonymous)],
  removeAllListeners: [Function (anonymous)],
  resume: [Function (anonymous)],
  pause: [Function (anonymous)],
  wrap: [Function (anonymous)],
  iterator: [Function (anonymous)],
  [Symbol(nodejs.rejection)]: [Function (anonymous)],
  [Symbol(Symbol.asyncIterator)]: [Function (anonymous)]
}
```
And we get a Stream class. 
So on the res object, you can access all of these different properties that it has firstly from 
IncomingMessage like `statusCode`, then other properties inherited from Readable and also some 
inherited from Stream. And Stream itself inherits some properties such as inheriting `.on()` from 
EventEmitter Class. 

The reason I am talking about all of this is that you need to know that these things exist so that when 
you get into some complex problem and things don't work as expected, you have an idea where to look. And 
also because you need to apply the .on() property on the res object which is inherited. You won't just 
stumble into these properties. Down the line you should know where this .on() property actually comes from. 

You will only be using a few of these properties but it pays to know what else is out there. 
