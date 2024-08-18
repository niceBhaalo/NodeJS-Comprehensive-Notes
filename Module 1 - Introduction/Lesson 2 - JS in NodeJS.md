It is most important to have a strong grasp over the Javascript language to be comfortable with NodeJS. 

There is the simple JS that beginners are exposed to. These are the loops, the functions, the arrays, and other basic implementations of these things. The problem is that the basic JS is very similar to other languages like Python and even C++.

But as soon as you get 10 lines into a NodeJS code, the language starts to feel different. For example look at this code. 

# First Prequisite - Anonymous Functions

```
const customFunctionName = function (req, res) {
    res.property(200);
    res.property(`Some Text`);
};
```
These are called anonymous functions or function expressions. Most of NodeJS code is going to have function definitions like this. Get used to them before also trying to learn NodeJS simultaneously. 

# Second Prerequisite - JSON

```
const client = new someClass(uri, 
{ 
	useNewUrlParser: true, 
	useUnifiedTopology: true,
	auth: {
		username: process.env.MONGO_INITDB_ROOT_USERNAME || 'admin',
		password: process.env.MONGO_INITDB_ROOT_PASSWORD || 'password'
	}
});
```
There is going to be a lot of JSON object floating around in your code. There are two aspects to learn here. First is to understand them and be able to quickly parse them, know how different key value pairs can be accessed, assigned etc. Second aspect is to know to package your information into your own custom JSON objects when and where suited.

