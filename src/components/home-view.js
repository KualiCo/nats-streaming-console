import { each, get, isArray, last, size } from 'lodash'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import NumberWidget from './number-dash-widget'
import ChartWidget from './chart-dash-widget'
import { getChannels, getClients, getMessages } from '../api/nats-streaming'
import Footer from './footer'

import './style.css'

export default class Clients extends Component {
  state = {
    timeSeries: []
  }

  async componentDidMount() {
    await this.getMonitorData()
    this.refresher = setInterval(() => this.getMonitorData(), 5000)
  }

  componentWillUnmount() {
    clearInterval(this.refresher)
  }

  getMonitorData = async () => {
    try {
      const [channelSummary, clientSummary] = await Promise.all([
        getChannels(),
        getClients()
      ])
      const stats = {}
      const channels = channelSummary.channels
      const clients = clientSummary.clients
      if (channels && isArray(channels)) {
        stats.channels = channels.length
        stats.messages = channels.reduce(
          (count, channel) => (count += channel.msgs),
          0
        )
      }
      if (clients && isArray(clients)) {
        stats.clients = clients.length
        stats.subscriptions = clients.reduce((count, client) => {
          count += client.subscriptions ? size(client.subscriptions) : 0
          return count
        }, 0)
      }
      this.setState({ ...stats, timeSeries: this.getTimeSeriesData(stats) })
    } catch (err) {
      console.log({ name: err.name, message: err.message, fileName: err.fileName })
      window.location.href = '/server'
    }
  }

  getTimeSeriesData = stats => {
    const date = new Date()
    const { timeSeries: ts } = this.state
    const tsClone = ts.slice(ts.length >= 60 ? 1 : 0)
    const lastValues = last(ts)
    tsClone.push(
      Object.assign({
        name: date.toLocaleTimeString(),
        newMsgs: lastValues ? stats.messages - lastValues.messages : 0
      }, stats)
    )
    return tsClone
  }

  render() {
    const {
      clients,
      channels,
      messages,
      subscriptions,
      timeSeries
    } = this.state
    return (
      <section className="view">
        {clients !== undefined && (
          <NumberWidget number={clients} title="Clients" text="Total Clients" />
        )}
        {channels !== undefined && (
          <NumberWidget
            number={channels}
            title="Channels"
            text="Total Channels"
          />
        )}
        {subscriptions !== undefined && (
          <NumberWidget
            number={subscriptions}
            title="Subscriptions"
            text="Active Subscriptions"
          />
        )}
        {messages !== undefined && (
          <NumberWidget
            number={messages}
            title="Messages"
            text="Total Messages"
          />
        )}
        <ChartWidget data={timeSeries} title="New Messages" />
        <Footer />
      </section>
    )
  }
}
