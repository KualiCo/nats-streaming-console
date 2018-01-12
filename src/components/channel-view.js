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

export default class ChannelView extends Component {
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
      focusedChannel: undefined,
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
      focusedChannel: undefined,
      focusedChannelMessages: undefined
    })
  }

  focusChannel = async channel => {
    console.log({ channel })
    const { name, last_seq } = channel
    this.setState({
      focusedChannel: channel,
      focusedChannelMessages: undefined
    })
    const opts = (last_seq)
      ? { startAtSequence: Math.max(last_seq - 30, 0) }
      : { startAtTimeDelta: 300000 }
    const messages = []
    console.log({ name, opts, messages })
    subscribeToChannel(name, opts, msg => {
      console.log({ msg })
      if (messages.length === 30) messages.pop()
      messages.unshift(msg)
      this.setState({ focusedChannelMessages: messages })
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
      focusedChannel,
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
          <Toolbar title="Channels" themed />
          <div className="menu-input">
            <TextField
              id="channel-filter"
              label="Filter"
              value={channelFilter}
              inlineIndicator={<Button icon>search</Button>}
              onChange={value => this.setState({ channelFilter: value })}
            />
          </div>
          <List>{this.renderChannels()}</List>
        </div>
        {focusedChannel && (
          <div className="menu-wrapper">
            <Toolbar title="Channel Messages" themed />
            <List>{this.renderMessages()}</List>
          </div>
        )}
        {detail && detailFormat === 'json'
          ? this.renderJsonDialog()
          : this.renderDatatableDialog()}
      </section>
    )
  }

  renderChannels = () => {
    const { channelMap, channelFilter, focusedChannel } = this.state
    let filtered = channelMap
    if (channelFilter) {
      filtered = reduce(
        channelMap,
        (map, channel, name) => {
          if (name.includes(channelFilter)) {
            map[name] = channel
          }
          return map
        },
        {}
      )
    }
    return map(filtered, (channel, name) => {
      const expander = channel.msgs ? (
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
              Messages: {channel.msgs}
              <br />
              Bytes: {channel.bytes}
            </span>
          }
          secondaryTextStyle={{ fontSize: '.8em', color: '#bbb' }}
          threeLines
          leftIcon={
            <FontIcon
              onClick={e => {
                e.preventDefault()
                e.stopPropagation()
                this.setState({ detail: channel, detailFormat: 'datatable' })
              }}
            >
              info
            </FontIcon>
          }
          rightIcon={expander}
          active={focusedChannel ? name === focusedChannel.name : false}
          onClick={() => this.focusChannel(channel)}
        />
      )
    })
  }

  renderMessages = () => {
    const { focusedChannelMessages } = this.state
    if (!focusedChannelMessages) {
      return <ListItem primaryText="Loading..." />
    }
    return map(focusedChannelMessages, msg => {
      const { sequence, timestamp, subject, data } = msg
      return (
        <ListItem
          key={`${sequence}-${timestamp}`}
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
