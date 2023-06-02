# Look Around You: photos from nearby

* Let the browser tell you where it thinks you are
* With one click of a button, fetch six, or more, recent images taken near your location from the millions of photos available on [Unsplash](http://unsplash.com).

## Requirements
* NodeJS

## Installation and starting up
```console
$ cd look-around
$ npm i
```
You will have to supply your own API keys for [Unsplash](https://unsplash.com/oauth/applications) and for [ZIPcodebase](https://zipcodebase.com/).

Once you have that, copy `public/modules/keys-template.js`, and 
replace `TODO: Replace with your own API key` with the keys. 

Rename the file to `public/modules/keys.js`.

```console
$ cp public/modules/keys-template.js public/modules/keys.js
```
To start the application [locally](http://localhost:3467), type this command from the project directory:

```console
$ npm start
```


## Acknowledgements