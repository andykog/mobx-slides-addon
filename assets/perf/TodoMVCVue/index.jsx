import Vue from 'vue'
import React, { Component } from 'react';
import { perf, uid } from '../utils.js';
import { TODOS_ITEMS_COUNT } from '../Constants';

// visibility filters
var filters = {
  all: function (todos) {
    return todos
  },
  active: function (todos) {
    return todos.filter(function (todo) {
      return !todo.completed
    })
  },
  completed: function (todos) {
    return todos.filter(function (todo) {
      return todo.completed
    })
  }
}

export default class TodoMVCVue extends Component {

  componentDidMount() {
    const initialState = []

    for (var i = 0; i < TODOS_ITEMS_COUNT; i++) {
      initialState.push({
        title: 'Item' + i,
        completed: i % 2 === 0,
        id: i,
      });
    }

    new Vue({
      template: require('raw-loader!./index.html'),
      el: '#vue-colors',
      // app initial state
      data: {
        todos: initialState,
        newTodo: '',
        editedTodo: null,
        visibility: 'all'
      },

      // computed properties
      // http://vuejs.org/guide/computed.html
      computed: {
        filteredTodos: function () {
          return filters[this.visibility](this.todos)
        },
        remaining: function () {
          return filters.active(this.todos).length
        },
        allDone: {
          get: function () {
            return this.remaining === 0
          },
          set: function (value) {
            this.todos.forEach(function (todo) {
              todo.completed = value
            })
          }
        }
      },

      filters: {
        pluralize: function (n) {
          return n === 1 ? 'item' : 'items'
        }
      },

      // methods that implement data logic.
      // note there's no DOM manipulation here at all.
      methods: {
        addTodo: function () {
          perf('todos', 'Vue', `add item`, () => {
            var value = this.newTodo && this.newTodo.trim()
            if (!value) {
              return
            }
            this.todos.push({
              id: uid(),
              title: value,
              completed: false
            })
            this.newTodo = ''
          });
        },

        removeTodo: function (todo) {
          perf('todos', 'Vue', `remove item`, () => {
            this.todos.splice(this.todos.indexOf(todo), 1)
          });
        },

        editTodo: function (todo) {
          perf('todos', 'Vue', `edit item`, () => {
            this.beforeEditCache = todo.title
            this.editedTodo = todo
          });
        },

        doneEdit: function (todo) {
          if (!this.editedTodo) {
            return
          }
          this.editedTodo = null
          todo.title = todo.title.trim()
          if (!todo.title) {
            this.removeTodo(todo)
          }
        },

        cancelEdit: function (todo) {
          this.editedTodo = null
          todo.title = this.beforeEditCache
        },

        removeCompleted: function () {
          this.todos = filters.active(this.todos)
        },

        setFilter: function(filter) {
          perf('todos', 'Vue', `filter ${filter} items`, () => {
            this.visibility = filter
          });
        }

      },

      // a custom directive to wait for the DOM to be updated
      // before focusing on the input field.
      // http://vuejs.org/guide/custom-directive.html
      directives: {
        'todo-focus': function (el, value) {
          if (value) {
            el.focus()
          }
        }
      }
    })
  }

  render() {
    return (
      <div>
        <div id="vue-colors"></div>
      </div>
    );
  }
}

