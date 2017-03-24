import React, { Component } from 'react'
import { render } from 'react-dom'
import { createStore } from 'redux'
import { connect, Provider } from 'react-redux'
import { uid, randomColor, perf } from './utils.js'
import { COLORS_LIST_ITEMS_COUNT } from './Constants';

const reducer = (state = [], action) => {

  if (action.type === 'REVERSE_COLORS') {
    return perf('colorsList', 'Redux', `reverse ${state.length} items`, () =>
      state.slice().reverse()
    );
  }
  if (action.type === 'REMOVE_COLORS') {
    return perf('colorsList', 'Redux', `remove ${COLORS_LIST_ITEMS_COUNT} items (from ${state.length})`, () =>
      state.slice(COLORS_LIST_ITEMS_COUNT)
    );
  }
  if (action.type === 'ADD_COLORS') {
    return perf('colorsList', 'Redux', `add ${COLORS_LIST_ITEMS_COUNT} items (to ${state.length})`, () => {
      const nextState = state.slice();
      for (let i = 0; i < COLORS_LIST_ITEMS_COUNT; i++) {
        nextState.push({
          color: randomColor(),
          id: uid(),
        })
      }
      return nextState;
    });
  }

  return state;
}


@connect(
  (state => ({
    items: state
  })),
  {
    handleAddColors: () => ({ type: 'ADD_COLORS' }),
    handleRemoveColors: () => ({ type: 'REMOVE_COLORS' }),
    handleReverseColors: () => ({ type: 'REVERSE_COLORS' }),
  }
)
class Container extends Component {
  render() {
    return (
      <div>
        <div>
          <button onClick={this.props.handleAddColors}>Add</button>
          <button onClick={this.props.handleReverseColors}>Reverse</button>
          <button onClick={this.props.handleRemoveColors}>Remove</button>
        </div>
        {this.props.items.map(item => (
          <span key={item.id} style={{ color: item.color }}>+ </span>
        ))}
      </div>
    )
  }
}

export class ColorsListRedux extends Component {

  componentWillMount() {
    this.store = createStore(reducer, []);
  }

  render() {
    return (
      <div>
        <h4>ColorsListRedux</h4>
        <Provider store={this.store}>
          <Container />
        </Provider>
      </div>
    );
  }
}