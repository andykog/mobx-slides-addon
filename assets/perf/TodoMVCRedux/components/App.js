import React, { PropTypes } from 'react'
import Header from '../components/Header'
import MainSection from '../components/MainSection'
import * as TodoActions from '../actions'

const App = () => (
  <section className="todoapp" style={{ fontSize: '15px' }}>
    <Header />
    <MainSection />
  </section>
)

export default App
