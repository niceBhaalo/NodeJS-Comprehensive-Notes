## The HEAD Method

Sometimes in your application, you might have a need where you are first interested in the meta data 
present in the response body and you would like to see this meta data without having to get the entire 
response. 

For example, there is a URL and you want to know if it is valid or not for some reason. Or what type of 
data is present in that URL, whether it is a JSON object or text or image. 

Or let's look at the following example. Say there is a third party API that has a list of information on 
available properties for rent in a large region. The API has images, addresses, and a lot of data and the 
entire response is quite sizeable. You would not want to have to download the entire data to see whether 
there has been an update. Network bandwidth on both sides is a valuable resource. 

So the target server is going to attach a Last-Modified header which has the date time for when the list of 
rentals was last updated. 

Then you get a user in your website, you use that third party API to get a list of all the rentals. A few minutes 
lates another user comes in and asks for the list of rentals as well. How do you ensure that the new user
gets an updated list. If you fetch all of the data again, that is a solution but that is not optimum. 
That is excessive use of bandwidth for both you and the third party. 

So, you use the HEAD method. The HEAD method gets the same URL as you used in the GET method for the first 
user. This method returns only the meta data or the headers that would be sent if the method was GET instead 
of HEAD. You can check the Last-Modified header and decide whether there is new data to display or you 
can just display the cached data not needing to receive and process the list of rentals on your own again. 

To use the HEAD method, all you need is to change method to HEAD in the options. 

```javascript
const http = require('http');

const options = {
    hostname: 'www.google.com',
    path: '/',
    method: 'HEAD',
    protocol: 'http:',
};

const req = http.request(options, (res) => {
    let data = '';

    // Check if response is successful
    if (res.statusCode < 200 || res.statusCode >= 300) {
        console.error(`Request failed with status code: ${res.statusCode}`);
        return;
    }

    console.log("Headers: ", res.headers);
    // Accumulate the response data
    res.on('data', (chunk) => {
        data += chunk;
        console.log("Receiving Data");
    });

    // Handle the end of the response
    res.on('end', () => {
        console.log("Reached END of response");
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

This outputs 
```text
Reached End of File
Headers:  {
  'content-type': 'text/html; charset=ISO-8859-1',
  'content-security-policy-report-only': "object-src 'none';base-uri 'self';script-src 'nonce-l6no1s5Zsi5S9chJgvMfCQ' 'strict-dynamic' 'report-sample' 'unsafe-eval' 'unsafe-inline' https: http:;report-uri https://csp.withgoogle.com/csp/gws/other-hp",
  p3p: 'CP="This is not a P3P policy! See g.co/p3phelp for more info."',
  date: 'Sat, 24 Aug 2024 18:58:09 GMT',
  server: 'gws',
  'x-xss-protection': '0',
  'x-frame-options': 'SAMEORIGIN',
  'transfer-encoding': 'chunked',
  expires: 'Sat, 24 Aug 2024 18:58:09 GMT',
  'cache-control': 'private',
  'set-cookie': [
    'AEC=AVYB7coQbfXyBcalUrY8c9VAM_o4CaLc_RITXeE4ikRVAl4nR4BET1HYqw; expires=Thu, 20-Feb-2025 18:58:09 GMT; path=/; domain=.google.com; Secure; HttpOnly; SameSite=lax',
    'NID=517=23ptRu59XtqHqRQ4FftOJ6qivOMu-YyMccREl9MqVO2jw2cOWGGFXBUiDEXnnqGQhD88LxSYQ-Tbmrmd_JN2ttVNJUP1ySSJ2eefYQrgcmIECk1eVqwCh8ln4KWBGsB0o9MCV_vH64tFB5ZlgZpCAImI-HzPeVkP0WAG7TTzSRXcjXxtOYQxoQ; expires=Sun, 23-Feb-2025 18:58:09 GMT; path=/; domain=.google.com; HttpOnly'
  ],
  connection: 'close'
}
Reached END of response
Error parsing response: Unexpected end of JSON input
```

You can see that the data listener is simply not called even once since the method was HEAD. There was no 
listenable stream. That's it. Quite simple actually and very useful. To be clear, you don't need to add a data listener, 
I just added and logged it to show that there is no data to receive even if you use a data listener. Also no
need for an end listener either. 
