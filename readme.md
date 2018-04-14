# Gistx

A better way to manage your snippets / gists.

### [Go to app](https://danielmeneses.github.io/gistx/)

![Alt Text](https://image.ibb.co/cfke47/gistx_2.gif)

## Main libs used

Any tool needs some boost, this one is no different, here is a list of the main libs used:

* [React.js](https://github.com/facebook/react) & [Redux](https://redux.js.org/introduction)
* [Redux Saga](https://github.com/redux-saga/redux-saga)
* [React universal component](https://github.com/faceyspacey/react-universal-component)
* [Monaco editor](https://github.com/Microsoft/monaco-editor) & [React monaco editor](https://github.com/superRaytin/react-monaco-editor)
* [Semantic UI React](https://react.semantic-ui.com)
* [Github base](https://github.com/jonschlinkert/github-base)
* [React toastify](https://github.com/fkhadra/react-toastify)


## What is?

It's a easy and faster way to manage your snippets. In fact the applications uses gists (Github) so that also means that you need a Github account.

## How to use?

You can use directly from [here](https://danielmeneses.github.io/gistx/), but it's important to note that this application doesn't use Github's Oauth system because it requires to create an application ID & Secret and that would involve the need of a 24/7 server handling the authentication communication. That said, you should generate a developer token from your Github account.

To get/generate a token, in your Github account you should go to: `Settings -> Developer settings -> Personal tokens` and create a new token allowing access only to `Gists`. Once you have the token place it in the app (it will be required, is the first thing the app requests). The token will be then saved to your browsers `localStorage`.

Note: We don't have access to any of the generated tokens. None of those are saved, read or use in any way. Take a look at the code if any concern still prevails.

## Use it on your own server

Clone this repo and then once in the project run the following commands:

```sh
# install packages
$ npm i

# Run universal production version
$ npm run universal

# Run universal DEV version
$ npm run dev-universal

# Build client only version
$ npm run build-client

# Serve client version
$ npm run serve
```

### Next steps

* Manage gists in local and session storage
* Support tagging gists
* Considering projects auto-docs integration

## Contributions

Contributions are very welcome. There's a lot of room for improvements so feel free to fork the repo and get into it. Also, let me know of any bugs you come across, any help on bug fixing is also a plus!


