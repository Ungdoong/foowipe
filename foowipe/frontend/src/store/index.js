import { createStore } from 'redux'
import myApp from '../reducers'

export const store = createStore(myApp)