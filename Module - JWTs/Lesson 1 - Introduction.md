# Introduction

JWTs stand for JSON Web Tokens. Here is the official definition that we can unpack. 

"JWT is a standard for safely passing claims in space constrained environments."

Safely here means transmitted information is not tampered with. 
Space Constrained environments mean situations where resources are limited 
such as bandwidth and storage. Claims are pieces of information or assertions about 
party for the other. Such as a userID is a claim that this client has this userID. 

To further go into some depth here, when we are passing some information from a 
web server to a client and vice-versa, we are mostly passing JSONs if not HTML. 
But sometimes we want to protect the information being passed on from being 
tampered. For example a client is going to claim to be a specific user and it 
is going to send a JSON object with a userID using which the client will be able 
to manipulate the client data. 

Instead of just using a plain JSON object that comes with each request, instead 
we can have a JSON Web Token that has some extra features to make sure that 
the current client claiming to be a certain userID is infact that user. It is not 
someone who has hijacked the connection by any means. 

## Structure of a JWT
A JWT has three elements. A header, a payload, and a signature. Signature is optional. 

The header has the meta data and supporting information about what is going on. 
The payload has the claim, it is the information that is being transmit from one 
party to another. At its basic, the payload might have just a username that the front
end displays at the top right corner of the screen. 

A signature is a mechanism to ensure no third party can tamper with the data. We can further encrypt the JWT to make it so that no third party can even read the data.  

Before moving on, let's see an example use.

```javascript
const jwt = require('jsonwebtoken');

// Define payload and secret key
const payload = {
  userId: 123,
  username: 'exampleUser'
};
const secretKey = 'your-very-secure-secret';

// Generate JWT
const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });

console.log('Generated JWT:', token);


```

```text
Generated JWT: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEyMywidXNlcm5hbWUiOiJleGFtcGxlVXNlciIsImlhdCI6MTcyNTcxOTIwNiwiZXhwIjoxNzI1NzIyODA2fQ.6qPj9FuiDRE2O56WjcY2K4i47mb0wNhXT0gBiDjHOUI
```

In this generated JWT, you can see three strings of digits with dots. The first string represents the header, the second the payload, and third the signature which is the secretKey. 

This jwt is signed using the secretKey. The recipient can check to see if the key is 
valid to know that the payload has not been tampered with. 
But this jwt is not encrypted. Anyone who knows the algorithm being used can decode it to see the header and the payload. 

If we add the following to the previous code at the end. 

```javascript
const decoded = jwt.decode(token, { complete: true });

console.log('Decoded Header:', decoded.header);
console.log('Decoded Payload:', decoded.payload);
```

We get the following response.
```text
Decoded Header: { alg: 'HS256', typ: 'JWT' }
Decoded Payload: {
  userId: 123,
  username: 'exampleUser',
  iat: 1725719632,
  exp: 1725723232
}
```

Meaning that any party that intercepts a JWT if not encrypted and only signed read it and see its header and payload. But not its signature. This is because by default
the header and the payload are encoded using Base64 URL encoding. And they can be 
decoded using the same without any hassle. But the signature is not, it uses some other cryptographic algorithm that combines the header, the payload, and the secret key we provide in the code. 

If we know the secret key, we can then decode the signature to produce the payload and header back. And if the payload and header were tampered with, we would know 
because the decryption will not return a valid result. 


The mechanism to verify the JWT is the following which returns the payload if the 
secret key was successful in ensuring that the payload was not messed with. 

```javascript
const decodedVerified = jwt.verify(token, secretKey, {complete: true});

console.log('Decoded and Verified Payload:', decodedVerified);
```

```text
Decoded Payload: {
  header: { alg: 'HS256', typ: 'JWT' },
  payload: {
    userId: 123,
    username: 'exampleUser',
    iat: 1725720086,
    exp: 1725723686
  },
  signature: 'r-v2g3IQoXhfiIOly6CM-GYFQTL_cKvzvNfj728Zo68'
}
```

Let's play with the following example. Let's create a token which is then hijacked by a third party but we can catch it since we were using signature. 

```javascript
const jwt = require('jsonwebtoken');

// Define payload and secret key
const payload = {
    userId: 123,
    username: 'exampleUser'
};
const secretKey = 'your-very-secure-secret';

// Generate JWT
const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });
const tokenSignature = token.split('.').pop();
console.log('Generated JWT:', token);

const payloadMalicious = {
    userId: 456,
    username: 'maliciousUser'
};
const secretKeyMalicious = 'malicious-secret';

const tokenMalicious = jwt.sign(payloadMalicious, secretKeyMalicious, { expiresIn: '1h' });

const [maliciousHeader, maliciousPayload, maliciousSignature] = tokenMalicious.split('.');

const newToken = maliciousHeader + '.' + maliciousPayload + '.' + tokenSignature;

console.log("Malicious Token: ", newToken)

const decoded = jwt.decode(newToken, { complete: true });

console.log('Decoded Header from Malicious:', decoded.header);
console.log('Decoded Payload from Malicious:', decoded.payload);

try {
    const decodedVerified = jwt.verify(newToken, secretKey, { complete: true });
    console.log('Decoded and Verified Payload:', decodedVerified);
} catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
        console.error('Token has expired.');
    } else if (error instanceof jwt.JsonWebTokenError) {
        console.error('Invalid token.');
    } else {
        console.error('Error verifying token:', error.message);
    }
}
```

```text
Generated JWT: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEyMywidXNlcm5hbWUiOiJleGFtcGxlVXNlciIsImlhdCI6MTcyNTcyMTI4NywiZXhwIjoxNzI1NzI0ODg3fQ.ZodMVQwJ055E1OmDEoLBkbfZ5Wh98LSFPVEnBM_680c
Malicious Token:  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQ1NiwidXNlcm5hbWUiOiJtYWxpY2lvdXNVc2VyIiwiaWF0IjoxNzI1NzIxMjg3LCJleHAiOjE3MjU3MjQ4ODd9.ZodMVQwJ055E1OmDEoLBkbfZ5Wh98LSFPVEnBM_680c
Decoded Header from Malicious: { alg: 'HS256', typ: 'JWT' }
Decoded Payload from Malicious: {
  userId: 456,
  username: 'maliciousUser',
  iat: 1725721287,
  exp: 1725724887
}
Invalid token.
```
So let's see what we did here. First we generated the actual token that we might send a client with this userID. Then some third party or the client itself can view 
the web token, its payload, decode it and see that we are passing a userID and username. 

And then a malicious party thought of trying to authorize as some other user by simply changing the username or id values. So that malicious party generated a new 
token based on their own payload but they will not have access to our secret key. 
So they generate their token. They attach the original signature to their token and send it to the server. 

Looking at the Generated JWT and the Malicious Token, it seems okay. And just decoding it will properly return the impacted payload. Because header and payload were only base64 encoded. 

But if we try to verify the token, which the web server will, it will find out that 
the signature, the secret key, and the payload and the header are not a match. Basically the signature has to be decoded with the secret key to return a payload. If this decoded payload is not the same as the base64 decoded payload, we will know that there was a tampering.  

And that's what we get. We can decode the malicious payload. But if we verify it, we find that it was invalid because it was not generated by the same secret key. 

### The Header
The header has information about the JWT. Also called claims for itself. 
It has one mandatory claim which is the alg claim standing for algorithm, It represents the main algorithm used to sign and or decrypt the JWT. 

