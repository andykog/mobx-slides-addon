import { ADD_TODO, DELETE_TODO, EDIT_TODO, COMPLETE_TODO, COMPLETE_ALL, CLEAR_COMPLETED } from '../constants/ActionTypes'
import { combineReducers } from 'redux'
import { TODOS_ITEMS_COUNT } from '../../Constants';
import { perf } from '../../utils';

let initialById = {};
let initialListedIds = [];

for (let i = 0; i < TODOS_ITEMS_COUNT; i++) {
  let nextId = 'prefilled-' + i
  initialListedIds.push(nextId)
  initialById[nextId] = {
    text: 'Item' + i,
    id: nextId,
    relatedId: i > 0 ? 'prefilled-' + (i - 1) : null,
    isCompleted: i % 2 === 0
  };
}

function todo(state, action) {
  switch (action.type) {
    case ADD_TODO:
      return {
        text: action.text,
        id: action.id,
        relatedId: null,
        isCompleted: false
      }
    case EDIT_TODO:
      perf('todos', 'Redux', `edit item`, () => {});
      return {
        ...state,
        text: action.text
      }
    case COMPLETE_TODO:
      return {
        ...state,
        isCompleted: !state.isCompleted
      }
  }
}

function byId(state = initialById, action, {listedIds}) {
  switch (action.type) {
    case ADD_TODO:
    case EDIT_TODO:
    case COMPLETE_TODO:
      return {
        ...state,
        [action.id]: todo(state[action.id], action)
      }
    case COMPLETE_ALL:
      const areSomeActive = listedIds.some(id => !state[id].isCompleted)
      return Object.keys(state).reduce((nextState, id) => {
        nextState[id] = {
          ...state[id],
          isCompleted: areSomeActive
        }
        return nextState
      }, {})
    default:
      return state
  }
}

function listedIds(state = initialListedIds, action, {byId}) {
  switch (action.type) {
    case ADD_TODO:
      perf('todos', 'Redux', `add item`, () => {});
      return [action.id, ...state]
    case DELETE_TODO:
      perf('todos', 'Redux', `remove item`, () => {});
      return state.filter(id => id !== action.id)
    case CLEAR_COMPLETED:
      return state.filter(id => !byId[id].isCompleted)
    default:
      return state
  }
}

export default function todos(state = {}, action) {
  return {
    byId: byId(state.byId, action, state),
    listedIds: listedIds(state.listedIds, action, state)
  }
}
