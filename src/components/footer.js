import React, { Component } from 'react'
import PropTypes from 'prop-types'
import logo from '../img/kuali-logo.svg'
import './style.css'

export default class NumberWidget extends Component {
  render() {
    const { number, text, title } = this.props
    return (
      <div className="dashboard-footer">
        <a
          href="http://kuali.co"
          style={{ display: 'block', color: 'white', textDecoration: 'none' }}
          target="_blank"
        >
          Sponsored by{' '}
          <img style={{ width: 60, position: 'relative', top: 3 }} src={logo} />
        </a>
      </div>
    )
  }
}
