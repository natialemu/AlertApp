# MobileDev

## Project Setup
Requires [npm](https://www.npmjs.com/). [Chocolatey](https://chocolatey.org/) is recomended for Windows users as well.

Run `npm install` to install dependencies
The project uses eslint which is compatiable with most js editors and it's written in es6.

### Core Dev Dependencies

- [immutable](https://facebook.github.io/immutable-js/docs/#/) Yeah! Immutable data structures!
- [lodash](https://lodash.com/docs/4.15.0) Super useful library for JS data structures.
- [chai](http://chaijs.com/api/bdd/) Testing Api.
- [react-native-push-notification](https://www.npmjs.com/package/react-native-push-notification) Library for writing react push notifications for iOS and Android.
- [react-native-router-flux](https://github.com/aksonov/react-native-router-flux) Library for firing store actions on route changes.
- [react-redux](https://github.com/reactjs/react-redux) Redux bindings for React.
- [redux](http://redux.js.org/) Low level flux library.
- [redux-saga](https://yelouafi.github.io/redux-saga/docs/api/index.html) Redux middleware that can do anything you want.
- [reselect](https://github.com/reactjs/reselect) Computed property library.
- [normalizr](https://github.com/paularmstrong/normalizr) Library for normalizing data structures.

### Recomended Readings

- [es6](https://github.com/lukehoban/es6features)
- [David Walsh's series on es6 generator functions.](https://davidwalsh.name/es6-generators) Redux-saga is generator based.
- [Dan Abramov's Getting Started With Redux course.](https://egghead.io/courses/getting-started-with-redux)

## Tests
Tests should be written using chaijs in the BDD style and run using mochajs. The architecture allows for easy test writing for business logic, store interactions, and application state management.

## React Native
Basic React Native commands:

The following link has the install and set up information: https://facebook.github.io/react-native/docs/getting-started.html#content

iOS on Windows is unsupported at the moment.

### On OSX only

To run your app on iOS:
- `cd <projectDir>`
- `react-native run-ios`
or
- Open `<projectDir>/ios/<projectName>.xcodeproj` in Xcode
- Hit the Run button

### On Windows or OSX

To run your app on Android:
- Have an Android emulator running (quickest way to get started), or a device connected
- `cd <projectDir>`
- `react-native run-android`

## Architecture Overview

A store state tree using `redux` will maintain and manage application state. A node in the store tree can be another instance of a store tree that maintains a chunk state. This can be the user's account information or an array of records. This approach is more scalable and quick to set up using the store module creation library (this is a work in progress and will be done soon).

Records will managed through a object graph, maintianed with `normalizr`. All asyncronisity will be handled with the redux-saga middleware.

`redux-saga` is a generator based middleware that allows for precise control of ansynchronous actions. The store tree nodes will only have basic actions such as merge and clear. All other actions are handled with sagas. The business logic is executed and the simple merge or clear action is called.

`reselect` will be used to create selectors that watch data in the store. Components will subscribe to relevant selectors on init and unsubscribe on willDeleteElement hooks. This is to prevent all the selectors from triggering on any change.

This architecture allows for all the business logic to be highly seperate from the view layer of the application. This means there will be minimal code duplication accross Android and iOS version of the `react-native` app.

`react-redux` is used to bind selector values to react components. `react-native-router-flux` is used to trigger actions on route loading. This is currently exploritory and may not be needed.

