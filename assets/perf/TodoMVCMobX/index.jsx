import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {observable} from 'mobx';
import {observer} from 'mobx-react';
import DevTools from 'mobx-react-devtools';

import { render } from 'react-dom'
import AppState from './stores/appstate'
import 'todomvc-app-css/index.css'
import App from './components/App';
import { TODOS_ITEMS_COUNT } from '../Constants';

// import * as Perf from 'react-addons-perf';


export default class TodoMVCMobX extends Component {
  componentWillMount() {
    const initialState = []

    for (var i = 0; i < TODOS_ITEMS_COUNT; i++) {
      initialState.push({
        text: 'Item' + i,
        completed: i % 2 === 0,
        id: i,
      });
    }
    this.store = new AppState(initialState);
  }
  render() {
    return <App store={this.store}/>;
  }
}

// // MWE: will only work on non prod builds
// window.perfStart = function() {
//   Perf.start();
// }
//
// window.perfStop = function() {
//   Perf.stop();
//   Perf.printInclusive();
//   Perf.printWasted();
// }
