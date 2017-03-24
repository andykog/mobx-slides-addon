import { SHOW_ALL } from '../constants/TodoFilters'
import { SET_FILTER } from '../constants/ActionTypes'
import { perf } from '../../utils';

export default function filter(state = SHOW_ALL, action) {
  switch (action.type) {
    case SET_FILTER:
      perf('todos', 'Redux', `filter ${action.filter} items`, () => {});
      return action.filter
    default:
      return state
  }
}
