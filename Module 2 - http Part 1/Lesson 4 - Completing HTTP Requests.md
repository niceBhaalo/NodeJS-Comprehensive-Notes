## Finalizing an HTTP Request

```javascript
const http = require('http');

const options = {
    hostname: 'api.example.com',
    path: '/data',
    method: 'GET',
    headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer your_access_token'
    }
};

const req = http.request(options, (res) => {
    let data = '';

    if (res.statusCode < 200 || res.statusCode >= 300) {
        console.error(`Request failed with status code: ${res.statusCode}`);
        return;
    }

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        try {
            const parsedData = JSON.parse(data);
            console.log('Response Data:', parsedData);
        } catch (err) {
            console.error('Error parsing response:', err.message);
        }
    });
});

req.on('error', (err) => {
    console.error(`Request error: ${err.message}`);
});

// End the request
req.end();
```

Let's go through such a request. First let's look at the `req` object itself. It is an instance of the 
ClientRequest class that manages the data that will be sent in a request. Say if something is wrong 
with the request itself, an error will be thrown which will be caught by the listener `req.on('error', ());`

To check that, we can simulate it here. 

```javascript
const http = require('http');

const options = {
    hostname: 'www.googleIncorrectURL.com',
    path: '/',
    method: 'GET',
    protocol: 'http:',
};

const req = http.request(options, (res) => {
    let data = '';

    // Check if response is successful
    if (res.statusCode < 200 || res.statusCode >= 300) {
        console.error(`Request failed with status code: ${res.statusCode}`);
        return;
    }

    // Accumulate the response data
    res.on('data', (chunk) => {
        data += chunk;
    });

    // Handle the end of the response
    res.on('end', () => {
        try {
            const parsedData = JSON.parse(data);
            console.log('Response Data:', parsedData);
        } catch (err) {
            console.error('Error parsing response:', err.message);
        }
    });
});

req.on('error', (err) => {
    console.error(`Request error: ${err.message}`);
});

// End the request
req.end();

console.log("Reached End of File");
```

Here the output would be
```text
Reached End of File
Request error: getaddrinfo ENOTFOUND www.googleIncorrectURL.com
```
The ClientRequest class was actively waiting for a connection. But after sometime the underlying NodeJS
is going to emit an error because of a failure of DNS resolution because the given address can't be resolved. 
That error is then forwarded to req.on() which logs the error as asked to. 

Otherwise, if a connection is successfully made, the callback function receives a response 
object which would be an instance of the IncomingMessage Class. 

We then use the properties of the IncomingMessage class `res.statusCode` to see the category of
response. You can check out this URL for the different response types and their respective status code.
<a href = "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status" target="_blank"> HTTP Response Status Codes</a>

Then we use the .on() as listeners for different events that are possible for an IncomingMessage instance. 
The .on() listener is inherited from an EventEmitter Class. The listener can listen to 'data' event which
triggers its respective callback when receiving a new chunk of data. The listener can also listen to the 
'end' event which is triggered when all the data has been sent. We use both of these events to compile 
the data into one JSON object for ease. 

And we use error handling where we can. We use it with the status codes to exit the connection using the 
return statement in case of an error. We also use it anywhere we are performing some operations on external 
data such as using JSON.parse(data) where we hope data is a valid JSON string, but it might not 
be due to some error and we wouldn't want a parsing error to break the server. 
So we set up a try catch block for this purpose. 

For example we should be receiving an HTML file here which would not be successfully parsed as JSON and throw 
an error. 

With this, we complete a good enough understanding of what happens behind the scenes. 