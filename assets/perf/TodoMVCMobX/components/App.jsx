import React, { Component, PropTypes } from 'react'
import { observer } from 'mobx-react'
import Header from './Header'
import MainSection from './MainSection'

@observer
class App extends Component {
  render() {
    // could use context, but let's keep it explicit
    const { store } = this.props
    return (
      <section className="todoapp" style={{ fontSize: '15px' }}>
        <Header store={store} />
        <MainSection store={store} />
      </section>
    )
  }
}

App.propTypes = {
  store: PropTypes.object.isRequired
}

export default App