import React, { Component } from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import { uid, randomColor, perf } from './utils';
import { COLORS_LIST_ITEMS_COUNT } from './Constants';

@observer
export class ColorsListReact extends Component {

  state = {
    items: [],
  }

  handleAddColors = () => {
    perf('colorsList', 'React', `add ${COLORS_LIST_ITEMS_COUNT} items (to ${this.state.items.length})`, () => {
      const { items } = this.state;
      for (let i = 0; i < COLORS_LIST_ITEMS_COUNT; i++) {
        items.push({
          color: randomColor(),
          id: uid(),
        })
      }
      this.setState({ items });
    });
  };
  handleRemoveColors = () => {
    perf('colorsList', 'React', `remove ${COLORS_LIST_ITEMS_COUNT} items (from ${this.state.items.length})`, () => {
      this.setState({ items: this.state.items.slice(COLORS_LIST_ITEMS_COUNT) });
    });
  };
  handleReverseColors = () => {
    perf('colorsList', 'React', `reverse ${this.state.items.length} items`, () => {
      this.setState({ items: this.state.items.reverse() });
    });
  };

  render() {
    return (
      <div>
        <h4>ColorsListReact</h4>
        <div>
          <button onClick={this.handleAddColors}>Add</button>
          <button onClick={this.handleReverseColors}>Reverse</button>
          <button onClick={this.handleRemoveColors}>Remove</button>
        </div>
        {this.state.items.map(item => (
          <span key={item.id} style={{ color: item.color }}>+ </span>
        ))}
      </div>
    );
  }
}
