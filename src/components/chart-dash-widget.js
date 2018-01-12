import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Toolbar } from 'react-md'
import { Area, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts'

import './style.css'

export default class ChartWidget extends Component {
  static propTypes = {
    data: PropTypes.any.isRequired,
    title: PropTypes.string
  }

  getClientDimensions = () => {
    const w = window
    const d = document
    const e = d.documentElement
    const g = d.getElementsByTagName('body')[0]
    const width = w.innerWidth || e.clientWidth || g.clientWidth
    const height = w.innerHeight || e.clientHeight || g.clientHeight
    return { width, height }
  }

  render() {
    const { data, title } = this.props
    const { width, height } = this.getClientDimensions()
    console.log({ width, height })
    return (
      <div className="dashboard-widget-four-by-one">
        <Toolbar title={title} themed />
        <AreaChart
          width={width - 100}
          height={260}
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorNewMsgs" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00acf1" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#00acf1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="name" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip
            wrapperStyle={{
              backgroundColor: 'rgba(255, 255, 255, .1)',
              border: 'none',
              borderRadius: '2px'
            }}
          />
          <Area
            type="monotone"
            dataKey="newMsgs"
            stroke="#00acf1"
            fillOpacity={1}
            fill="url(#colorNewMsgs)"
          />
        </AreaChart>
      </div>
    )
  }
}
