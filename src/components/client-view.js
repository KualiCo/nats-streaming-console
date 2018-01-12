import { find, keyBy, map, reduce, size } from 'lodash'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { getChannels, getClients, getMessages } from '../api/nats-streaming'
import { subscribeToChannel } from '../api/web-socket'
import JSONTree from 'react-json-tree'
import {
  Avatar,
  Button,
  DataTable,
  DialogContainer,
  Divider,
  FontIcon,
  List,
  ListItem,
  TableBody,
  TableColumn,
  TableHeader,
  TableRow,
  TextField,
  Toolbar,
  Subheader
} from 'react-md'

import './style.css'

export default class ClientView extends Component {
  // static propTypes = {}
  // static defaultProps = {}
  // state = {}

  constructor(props) {
    super(props)

    this.state = {
      channelSummary: undefined,
      channelMap: undefined,
      channelFilter: undefined,
      clientSummary: undefined,
      clientMap: undefined,
      clientFilter: undefined,
      detail: undefined,
      loading: true,
      focusedClient: undefined,
      focusedSubscription: undefined,
      width: '0',
      height: '0'
    }
  }

  componentDidMount() {
    this.getMonitorData()
    this.updateWindowDimensions()
    window.addEventListener('resize', this.updateWindowDimensions)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions)
  }

  updateWindowDimensions = () => {
    this.setState({ width: window.innerWidth, height: window.innerHeight })
  }

  getMonitorData = async () => {
    this.setState({ loading: true })
    const [channelSummary, clientSummary] = await Promise.all([
      getChannels(),
      getClients()
    ])
    const channelMap = keyBy(channelSummary.channels, 'name')
    const clientMap = keyBy(clientSummary.clients, 'id')
    this.setState({
      channelSummary,
      channelMap,
      clientSummary,
      clientMap,
      loading: false,
      focusedClient: this.state.focusedClient
        ? this.state.focusedClient
        : find(clientMap, () => true),
      focusedSubscription: undefined
    })
  }

  focusClient = client => {
    this.setState({ focusedClient: client, focusedSubscription: undefined })
  }

  focusSubscription = async subscription => {
    const { _channel, last_sent } = subscription
    this.setState({
      focusedSubscription: subscription,
      focusedSubscriptionMessages: undefined
    })
    const opts = last_sent
      ? { startAtSequence: Math.max(last_sent - 30, 0) }
      : { startAtTimeDelta: 300000 }
    const messages = []
    subscribeToChannel(subscription._channel, opts, msg => {
      if (messages.length === 30) messages.pop()
      messages.unshift(msg)
      this.setState({ focusedSubscriptionMessages: messages })
    })
  }

  render() {
    const {
      channelSummary,
      channelMap,
      channelFilter,
      clientSummary,
      clientMap,
      clientFilter,
      detail,
      detailFormat,
      focusedClient,
      focusedSubscription,
      focusedSubscriptionMessages,
      loading,
      height,
      width
    } = this.state

    console.log('render Home.js')

    if (loading) {
      return (
        <div>
          <h1>Loading...</h1>
        </div>
      )
    }
    return (
      <section className="column-view">
        <div className="menu-wrapper">
          <Toolbar title="Clients" themed />
          <div className="menu-input">
            <TextField
              id="client-filter"
              label="Filter"
              value={clientFilter}
              inlineIndicator={<Button icon>search</Button>}
              onChange={value => this.setState({ clientFilter: value })}
            />
          </div>
          <List className="menu-list">{this.renderClients()}</List>
        </div>
        {focusedClient &&
          focusedClient.subscriptions && (
            <div className="menu-wrapper">
              <Toolbar title="Subscriptions" themed />
              <div className="menu-input">
                <TextField
                  id="subscription-filter"
                  label="Filter"
                  value={channelFilter}
                  inlineIndicator={<Button icon>search</Button>}
                  onChange={value => this.setState({ channelFilter: value })}
                />
              </div>
              <List className="menu-list">{this.renderSubscriptions()}</List>
            </div>
          )}
        {focusedSubscription && (
          <div className="menu-wrapper">
            <Toolbar title="Messages" themed />
            <List className="menu-list">{this.renderMessages()}</List>
          </div>
        )}
        {detail && detailFormat === 'json'
          ? this.renderJsonDialog()
          : this.renderDatatableDialog()}
      </section>
    )
  }

  renderClients = () => {
    const { clientMap, clientFilter, focusedClient } = this.state
    let filtered = clientMap
    if (clientFilter) {
      filtered = reduce(
        clientMap,
        (map, client, name) => {
          if (name.includes(clientFilter)) {
            map[name] = client
          }
          return map
        },
        {}
      )
    }
    return map(filtered, (client, name) => {
      const expander = client.subscriptions ? (
        <FontIcon>chevron_right</FontIcon>
      ) : (
        undefined
      )

      return (
        <ListItem
          key={name}
          primaryText={name}
          secondaryText={
            <span>Subscriptions: {size(client.subscriptions)}</span>
          }
          secondaryTextStyle={{ fontSize: '.8em', color: '#bbb' }}
          leftIcon={
            <FontIcon
              onClick={e => {
                e.preventDefault()
                e.stopPropagation()
                this.setState({ detail: client, detailFormat: 'datatable' })
              }}
            >
              info
            </FontIcon>
          }
          rightIcon={expander}
          active={name === focusedClient.id}
          onClick={() => this.focusClient(client)}
        />
      )
    })
  }

  renderSubscriptions = () => {
    const { channelFilter, focusedClient, focusedSubscription } = this.state
    let filtered = focusedClient.subscriptions
    if (channelFilter) {
      filtered = reduce(
        focusedClient.subscriptions,
        (map, client, name) => {
          if (name.includes(channelFilter)) {
            map[name] = client
          }
          return map
        },
        {}
      )
    }
    return map(filtered, (sub, name) => {
      const subscription = sub[0]
      const { queue_name, last_sent } = subscription
      const [_client, _durableName] = subscription.queue_name 
        ? subscription.queue_name.split(':')
        : [subscription.client_id, '-not durable-']
      console.log({ subscription, x: subscription.queue_name, _client, _durableName })
      Object.assign(subscription, { _channel: name, _client, _durableName })

      const expander = last_sent ? (
        <FontIcon>chevron_right</FontIcon>
      ) : (
        undefined
      )

      return (
        <ListItem
          key={name}
          primaryText={name}
          secondaryText={
            <span>
              Durable Name: {_durableName}
              <br />
              Message Count: {last_sent}
            </span>
          }
          secondaryTextStyle={{ fontSize: '.8em', color: '#bbb' }}
          threeLines
          leftIcon={
            <FontIcon
              onClick={e => {
                e.preventDefault()
                e.stopPropagation()
                this.setState({
                  detail: subscription,
                  detailFormat: 'datatable'
                })
              }}
            >
              info
            </FontIcon>
          }
          rightIcon={expander}
          active={focusedSubscription && name === focusedSubscription._channel}
          onClick={
            last_sent ? () => this.focusSubscription(subscription) : () => {}
          }
        />
      )
    })
  }

  renderMessages = () => {
    const { focusedSubscription, focusedSubscriptionMessages } = this.state
    if (!focusedSubscriptionMessages) {
      return <ListItem primaryText="Loading..." />
    }
    return map(focusedSubscriptionMessages, msg => {
      const { sequence, timestamp, subject, data } = msg
      return (
        <ListItem
          key={`${focusedSubscription.client_id}:${sequence}:${timestamp}`}
          primaryText={
            <span>
              <span
                style={{
                  padding: '3px 4px 2px',
                  borderRadius: '2px',
                  backgroundColor: '#333',
                  marginRight: '7px'
                }}
              >
                {sequence}
              </span>
              <em
                style={{
                  fontSize: '.9em',
                  fontWeight: 'normal',
                  color: '#bbb'
                }}
              >
                {new Date(timestamp).toLocaleString()}
              </em>
            </span>
          }
          onClick={() => {
            this.setState({
              detail: JSON.parse(data),
              detailFormat: 'json'
            })
          }}
        />
      )
    })
  }

  renderJsonDialog = () => {
    const { detail } = this.state
    const actions = [
      {
        children: 'ok',
        onClick: () => this.setState({ detail: null, detailFormat: null }),
        primary: true
      }
    ]
    return (
      <DialogContainer
        id="detail"
        aria-describedby="detail-content"
        title="Detail"
        visible={!!detail}
        onHide={() => this.setState({ detail: null })}
        actions={actions}
        dialogClassName="detail-dialog"
      >
        <JSONTree
          data={detail}
          theme="monokai"
          invertTheme={false}
          shouldExpandNode={(path, branch, level) => level <= 1}
        />
      </DialogContainer>
    )
  }

  renderDatatableDialog = () => {
    const { detail } = this.state
    const details = detail ? Object.entries(detail) : []
    const actions = [
      {
        children: 'ok',
        onClick: () => this.setState({ detail: null }),
        primary: true
      }
    ]
    return (
      <DialogContainer
        id="detail"
        aria-describedby="detail-content"
        title="Detail"
        visible={!!detail}
        onHide={() => this.setState({ detail: null })}
        actions={actions}
        dialogClassName="detail-dialog"
      >
        <DataTable plain>
          <TableHeader>
            <TableRow>
              <TableColumn>Key</TableColumn>
              <TableColumn>Value</TableColumn>
            </TableRow>
          </TableHeader>
          <TableBody>
            {details.map(tuple => (
              <TableRow key={tuple[0]}>
                <TableColumn>{tuple[0]}</TableColumn>
                <TableColumn>{JSON.stringify(tuple[1])}</TableColumn>
              </TableRow>
            ))}
          </TableBody>
        </DataTable>
      </DialogContainer>
    )
  }
}
