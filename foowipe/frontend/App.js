import React from 'react'
import {Provider} from 'react-redux'
import Root from './src/Root'
import {store} from './src/store'

class App extends React.Component {
  render () {
    return (
      <Provider store={store}>
        <Root />
      </Provider>
    )
  }
}

export default App
