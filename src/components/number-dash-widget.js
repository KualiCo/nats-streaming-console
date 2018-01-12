import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Toolbar } from 'react-md'

import './style.css'

export default class NumberWidget extends Component {
  static propTypes = {
    number: PropTypes.number.isRequired,
    text: PropTypes.string,
    title: PropTypes.string
  }

  render() {
    const { number, text, title } = this.props
    return (
      <div className="dashboard-widget-one-by-one">
        <Toolbar title={title} themed />
        <div className="dashboard-widget-content">
          <span className="number">{number}</span>
          <span className="text">{text}</span>
        </div>
      </div>
    )
  }
}
