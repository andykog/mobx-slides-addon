import Vue from 'vue'
import { uid, randomColor, perf } from './utils.js';
import { COLORS_LIST_ITEMS_COUNT } from './Constants';

export const createVuePerfStore = () => ({
  items: [],

  addColors() {
    perf('colorsList', 'Vue', `add ${COLORS_LIST_ITEMS_COUNT} items (to ${this.items.length})`, () => {
      const newColors = [];
      for (let i = 0; i < COLORS_LIST_ITEMS_COUNT; i++) {
        newColors.push({
          color: randomColor(),
          id: uid(),
        })
      }
      this.items = this.items.concat(newColors);
    });
  },

  removeColors() {
    perf('colorsList', 'Vue', `remove ${COLORS_LIST_ITEMS_COUNT} items (from ${this.items.length})`, () => {
      this.items = this.items.slice(COLORS_LIST_ITEMS_COUNT);
    });
  },

  reverseColors() {
    perf('colorsList', 'Vue', `reverse ${this.items.length} items`, () => {
      this.items = this.items.reverse();
    });
  },
});

import React, { Component } from 'react';

export class ColorsListVue extends Component {

  componentDidMount() {
    const store = createVuePerfStore();
    new Vue({
      el: '#vue-colors',
      template: require('raw-loader!./ColorsListVue.html'),
      data() {
        return { store };
      },
      methods: {
        handleAddColors: () => store.addColors(),
        handleRemoveColors: () => store.removeColors(),
        handleReverseColors: () => store.reverseColors(),
      },
    });
  }

  render() {
    return (
      <div>
        <h4>ColorsListVue</h4>
        <div id="vue-colors"></div>
      </div>
    );
  }
}

