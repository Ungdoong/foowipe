import { combineReducers } from 'redux'
import {
LOCATION
} from '../actionTypes'

const initialLocation = {

}

export function location(state = {}, action) {
  switch (action.type) {
    case LOCATION:
      return action.location
    default:
      return state
  }
}
