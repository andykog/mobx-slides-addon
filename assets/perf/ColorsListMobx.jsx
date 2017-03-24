import React, { Component } from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import { uid, randomColor, perf } from './utils';
import { COLORS_LIST_ITEMS_COUNT } from './Constants';

const createMobxPerfStore = () => observable({
  items: [],
  results: [],

  addColors: action(function () {
    perf('colorsList', 'Mobx', `add ${COLORS_LIST_ITEMS_COUNT} items (to ${this.items.length})`, () => {
      const newColors = [];
      for (let i = 0; i < COLORS_LIST_ITEMS_COUNT; i++) {
        newColors.push({
          color: randomColor(),
          id: uid(),
        })
      }
      this.items = this.items.concat(newColors);
    });
  }),

  removeColors: action(function () {
    perf('colorsList', 'Mobx', `remove ${COLORS_LIST_ITEMS_COUNT} items (from ${this.items.length})`, () => {
      this.items = this.items.slice(COLORS_LIST_ITEMS_COUNT);
    });
  }),

  reverseColors: action(function() {
    perf('colorsList', 'Mobx', `reverse ${this.items.length} items`, () => {
      this.items = this.items.reverse();
    });
  }),
});

@observer
export class ColorsListMobx extends Component {

  store = createMobxPerfStore();

  handleAddColors = () => this.store.addColors();
  handleRemoveColors = () => this.store.removeColors();
  handleReverseColors = () => this.store.reverseColors();

  render() {
    return (
      <div>
        <h4>ColorsListMobx</h4>
        <div>
          <button onClick={this.handleAddColors}>Add</button>
          <button onClick={this.handleReverseColors}>Reverse</button>
          <button onClick={this.handleRemoveColors}>Remove</button>
        </div>
        {this.store.items.map(item => (
          <span key={item.id} style={{ color: item.color }}>+ </span>
        ))}
      </div>
    );
  }
}
