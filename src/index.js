import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';  //need to update App route
import { createStore } from 'redux';  //need to import 
//import reducer from './reducers/ticket-list-reducer';  //need to import 
import rootReducer from './reducers/index';
import { Provider } from 'react-redux';   //need to import 
import * as serviceWorker from './serviceWorker';

// const store = createStore(reducer, InitialState);
const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );

// just for testing! Do not include this "production" code!
store.subscribe(() =>
  console.log(store.getState())
);  

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
