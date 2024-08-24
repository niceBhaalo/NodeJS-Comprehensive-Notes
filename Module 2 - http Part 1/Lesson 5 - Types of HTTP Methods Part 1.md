## What are HTTP Methods?

During setting the options for a HTTP Request, each request must have a valid method. 
```javascript
const options = {
    hostname: 'api.example.com',
    path: '/data',
    method: 'GET',
};
```

In this, we see that the method is GET. The other methods are, GET, HEAD, POST, PUT, DELETE, CONNECT,
OPTIONS, TRACE, and PATCH. Each method is optimized for its specific purpose. So it is important to understand
when to use which method. 

### GET Method

As the name suggests, GET is used to just get some data at a URL and it does so without passing a request
body. A request body is usually some custom JSON object that you send with other request methods but 
not for GET. All you can pass is the URL, any headers, and any query parameters. 

In some sense, when you enter any URL on the browser, you send a GET request because you are not attaching any
sort of added information. 

`Idempotent` is a new term here. Idempotent means whether this operation changes the target server. And 
since a GET request does not make any change in the target server, all GET requests at that URL 
produce the same result, GET requests are Idempotent. 

`Safe` is a new term here. Safe in this context means that on top of idempotency, the server knows that 
this request should not and does not trigger actions like database updates, or any other sever side 
operations. Meaning, you can expose a server to GET requests and in principle you will be safe since 
GET requests alone will not be able to modify your server state, corrupt your data or cause any other 
malicious damage. 

However GET requests are not safe from unintentionally exposing sensitive data. It is your job to make 
sure no query exposes your sensitive information. 

Another benefit of GET request is that it is cacheable since there is an expectation that the resource 
is not going to be changed frequently. 

### http.get()

Since GET method is probably the most common method, http module has a .get() method to make a simplified 
request without having to specify some of the extra boilerplate. 

```javascript 
const http = require('http');

const options = {
  hostname: 'www.google.com',
  path: '/',
};

const url = 'http://www.google.com';
// Make the HTTP request
const req = http.get(options, (res) => {
  console.log('Status Code:', res.statusCode);
  console.log('Headers:', res.headers);

  res.on('data', (chunk) => {
    console.log("HI");

    //console.log('Body Chunk:', chunk.toString());
  });

  res.on('end', () => {
    console.log('Response ended.');
  });
});
console.log(req);
// Handle request errors
req.on('error', (e) => {
  console.error('Request error:', e);
});
```

So the boiler plate that you can avoid is that req.end() does not need to be called. `req.end()` is used 
to tell http that this was the entire request body and please send that to the URL. But since a GET method
does not have a request body, http.get() understands that we are only sending the url or the options 
object with data about headers and stuff. Nothing else. 

Also you don't need to specify `method: 'GET'` in the options object. 