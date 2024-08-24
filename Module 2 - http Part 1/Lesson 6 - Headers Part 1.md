## What are Headers

When sending or receiving a request, there are two different things called headers and a body. 
When we use GET method on google.com, all the visual things we see are in the body, such as the 
search bar, the buttons, and the logo. But there is also multiple headers with some important information about the 
request as well about the body. 

Look at this


```javascript
const http = require('http');

const options = {
    hostname: 'www.google.com',
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

We know that the response object has the following properties attached to it.

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

Let's log the rawHeaders of this response using  `console.log("Headers: ", res.rawHeaders);`
and we get a list of strings like this which is not the easiest to parse. 
```text
Headers:  [
  'Date',
  'Sat, 24 Aug 2024 15:13:58 GMT',
  'Expires',
  '-1',
  'Cache-Control',
  'private, max-age=0',
  'Content-Type',
  'text/html; charset=ISO-8859-1',
  'Content-Security-Policy-Report-Only',
  "object-src 'none';base-uri 'self';script-src 'nonce-rxrrC4TjbJoqt5tNasNYUA' 'strict-dynamic' 'report-sample' 'unsafe-eval' 'unsafe-inline' https: http:;report-uri https://csp.withgoogle.com/csp/gws/other-hp",
  'P3P',
  'CP="This is not a P3P policy! See g.co/p3phelp for more info."',
  'Server',
  'gws',
  'X-XSS-Protection',
  '0',
  'X-Frame-Options',
  'SAMEORIGIN',
  'Set-Cookie',
  'AEC=AVYB7cpr_M-43Znm6RsJq3Jh7kAQf_mQl16P4HzVnvPj3ErxUK_sDFKV3vc; expires=Thu, 20-Feb-2025 15:13:58 GMT; path=/; domain=.google.com; Secure; HttpOnly; SameSite=lax',
  'Set-Cookie',
  'NID=516=fV4quIoqq9IOpr1WMa9TVb1sdTMhNeNJzHsmfIeullDMWudSg30jw4Lt3uS7yhIGaGwDIZ6BDNtRnCgBOcMwmgHbDnTr1UmdymHwePQ1vcUIhQaFYB7snjgr6wcMJBUbX3MEz1QQ1gDr3fXpqptmsNw5NZPL2MNeWSO1smEr4JcbOcu5_-2a6tHVsg; expires=Sun, 23-Feb-2025 15:13:58 GMT; path=/; domain=.google.com; HttpOnly',
  'Accept-Ranges',
  'none',
  'Vary',
  'Accept-Encoding',
  'Connection',
  'close',
  'Transfer-Encoding',
  'chunked'
]
```

Now I don't know how this happens exactly, but through NodeJS, response object also has access to a 
headers function that parses the rawHeaders output to convert it into a JSON object for better access and 
readability. Using `console.log("Headers: ", res.headers);` gives us

```text
Headers:  {
  date: 'Sat, 24 Aug 2024 15:17:14 GMT',
  expires: '-1',
  'cache-control': 'private, max-age=0',
  'content-type': 'text/html; charset=ISO-8859-1',
  'content-security-policy-report-only': "object-src 'none';base-uri 'self';script-src 'nonce-XdtgBfEqlMnBcdwFFMmJ5Q' 'strict-dynamic' 'report-sample' 'unsafe-eval' 'unsafe-inline' https: http:;report-uri https://csp.withgoogle.com/csp/gws/other-hp",
  p3p: 'CP="This is not a P3P policy! See g.co/p3phelp for more info."',
  server: 'gws',
  'x-xss-protection': '0',
  'x-frame-options': 'SAMEORIGIN',
  'set-cookie': [
    'AEC=AVYB7crdu1Ob0tTeU68Uj5KstTmJQ3Zj3Njy99wMvSCIBjU4MxYSSOVCdg; expires=Thu, 20-Feb-2025 15:17:14 GMT; path=/; domain=.google.com; Secure; HttpOnly; SameSite=lax',
    'NID=516=iyzAyfJTyY_m2ChV8lBtXrABjNXP-4DstiGjLQ4TtTJZJrPUUIWEeP2Jg1o2P_Hgqi-Ff_dllZWulCmtE0eQ8a_AsGdc6waepDneybudJsO_X0UGlxLWTNXghUdMKNBOW14zTmhTtNf-vYxzq_kbTQUpfvlT4ujCrwM9rWlZEJ0hqKo564ZbqVZM_Q; expires=Sun, 23-Feb-2025 15:17:14 GMT; path=/; domain=.google.com; HttpOnly'
  ],
  'accept-ranges': 'none',
  vary: 'Accept-Encoding',
  connection: 'close',
  'transfer-encoding': 'chunked'
}
```

In a simple request like www.google.com, all of this extra information comes along with it. Most of these 
headers will become useful to you at some point in your journey. Let's look at one of them.

The `content-type` header has important information such as whether the response body is going to have 
html, a JSON object, or something else entirely and the valid characters inside the response. Knowing this
we should know why our JSON.parse(data) will fail in this case since we are receiving an text/html. 

Headers are not only a part of responses, but also request. When you will use some other method type 
where you are sending some request body, it is nicer and sometimes necessary to include appropriate 
headers for the target to know what to expect in the request body. 