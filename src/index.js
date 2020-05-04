import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import * as serviceWorker from './serviceWorker';
import { createStore } from 'redux';
import rootReducer from './reducers/index';
import { Provider } from 'react-redux';
import InitialState from './initialState';
import { ReactReduxFirebaseProvider } from 'react-redux-firebase';
import { createFirestoreInstance } from 'redux-firestore';
import firebase from "./firebase";
import 'firebase/auth';

// const store = createStore(rootreducer, InitialState);
const store = createStore(
  rootReducer,
  InitialState,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );

// just for testing! Do not include this "production" code!
store.subscribe(() =>
  console.log(store.getState())
);  

const rrfProps = {
  firebase,
  config: {
      userProfile: "users",
      useFirestoreForProfile: true,
    },
  dispatch: store.dispatch,
  createFirestoreInstance
}

ReactDOM.render(
  <Provider store={store}>
     <ReactReduxFirebaseProvider { ...rrfProps }>
      <App />
    </ReactReduxFirebaseProvider>
  </Provider>,
  document.getElementById('root')
);

serviceWorker.unregister();
