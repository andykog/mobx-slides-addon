import React from 'react'
import { render } from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import reducer from './reducers'
import generateTree from './generateTree'
import Node from './containers/Node'


export default class TreeRedux extends React.Component {

  componentWillMount() {
    const tree = generateTree();
    this.store = createStore(reducer, tree);
  }

  render() {
    return (
      <div>
        <h4>TreeRedux</h4>
        <Provider store={this.store}>
          <Node id={0} />
        </Provider>
      </div>
    );
  }
}
