## What is HTTP

Hypertext Transfer Protocol. It is the way to transfer HTML (HyperText Markup Language) over the web. 
Hypertext refers to content that connects different parts of the web together like anchor tags in HTML. 
And HTTP is the way to send and receive HTML files among other data types. 

## What is TCP/IP

TCP/IP is Transmission Control Protocol/Internet Protocol which in short creates a connection between two 
IPs that can then request and send data to each other. 

## What is an HTTP Request

An HTTP request is one such type of request of the TCP/IP where instead of sending some other 
data, specifically an HTTP request is made which usually demands that a server sends the appropriate 
HTML file back in response. So HTTP utilizes the common and very useful TCP/IP.

## Application Layer Protocol vs Transport Layer Protocol

TCP/IP is a Transport Layer Protocol which establishes how data should be packed, how it should have 
headers to identify each packet, and ensure that all packets are received properly. Basically TCP/IP
has two main features, first the connection is established before sending data, and second the sender
must receive confirmation that data was received to ensure no information is lost. 

HTTP is an Application Layer Protocol built on top of TCP/IP. Underneath TCP/IP is happening but on 
the outside you are not sending individual packets but instead you are sending Headers, Data, URLs and 
they are automatically packaged into appropriate sized packets by the underlying TCP/IP. 

An HTTP request is not tied with sending HTML only. You can send JSON etc. HTTP is just an application 
layer that abstracts the lower level details away from the developer who does not have to mess with TCP/IP 
directly. 

## What is the http module in NodeJS

NodeJS has a built in http module that you can import that allows you to send http requests as well as creating 
an http server of your own. 

## http vs https

The extra S stands for Secure. It essentially means that the data will be encrypted by the server using 
some technique mostly SSL and TSL and the client will be able to decrypt it without the data being exposed 
over the network for others to see. An HTTPS request has then added perks because of this level of security
for example. If you have seen the "Copy to Clipboard" buttons in various websites. They only work 
if the website is using HTTPS. Basically modern browsers limit what you can do with a simple HTTP 
website. For a developer, using HTTPS means dealing with an SSL or TSL certificate which is not that difficult. 
Otherwise using http vs https is the same. Using http is fine for learning and practice but eventually 
you will have to use https for production. 

And the indirect benefits of successful encryption and decryption is that we are sure of data integrity. 

NodeJS has http and https module both with almost a complete overlap of functionality. 

```javascript
const http = require('http');
const https = require('https');

console.log("HTTP: ", Object.getOwnPropertyNames(http));
console.log("HTTPS: ", Object.getOwnPropertyNames(https));
```

Running this you get the following output. 
```text
HTTP:  [
  '_connectionListener',
  'METHODS',
  'STATUS_CODES',
  'Agent',
  'ClientRequest',
  'IncomingMessage',
  'OutgoingMessage',
  'Server',
  'ServerResponse',
  'createServer',
  'validateHeaderName',
  'validateHeaderValue',
  'get',
  'request',
  'setMaxIdleHTTPParsers',
  'maxHeaderSize',
  'globalAgent'
]
HTTPS:  [ 'Agent', 'globalAgent', 'Server', 'createServer', 'get', 'request' ]
```
https is wrapped around the http module with some extra security capabilities while using the same
fundamentals. 