import React, { Component } from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import { uid, randomColor, perf } from './utils';

const createMobxPerfStore = () => observable({
  items: [],
  results: [],

  addColors: action(function (count) {
    perf('1', 'Mobx', `add ${count} items (to ${this.items.length})`, () => {
      const newColors = [];
      for (let i = 0; i < count; i++) {
        newColors.push({
          color: randomColor(),
          id: uid(),
        })
      }
      this.items = this.items.concat(newColors);
    });
  }),

  removeColors: action(function (count) {
    perf('1', 'Mobx', `remove ${count} items (from ${this.items.length})`, () => {
      this.items = this.items.slice(count);
    });
  }),

  reverseColors: action(function() {
    perf('1', 'Mobx', `reverse ${this.items.length} items`, () => {
      this.items = this.items.reverse();
    });
  }),
});

@observer
export class MobxPerfComponent extends Component {

  store = createMobxPerfStore();

  componentDidMount() {
    window.store = this.store;
  }

  handleAddColors = () => this.store.addColors();
  handleRemoveColors = () => this.store.removeColors();
  handleReverseColors = () => this.store.reverseColors();

  render() {
    return (
      <div>
        <div>
          <button onClick={this.handleAddColors}>Add</button>
          <button onClick={this.handleRemoveColors}>Remove</button>
          <button onClick={this.handleReverseColors}>Reverse</button>
        </div>
        {this.store.items.map(item => (
          <span key={item.id} style={{ color: item.color }}>+ </span>
        ))}
      </div>
    );
  }
}
