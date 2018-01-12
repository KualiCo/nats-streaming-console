import { assignIn, pick } from 'lodash'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { getServers } from '../api/nats-streaming'
import { getServerConfig, updateServerConfig } from '../api/server-config'
import {
  Button,
  Card,
  CardActions,
  CardTitle,
  CardText,
  DataTable,
  Media,
  MediaOverlay,
  Snackbar,
  TableHeader,
  TableBody,
  TableRow,
  TableColumn,
  TextField,
  Toolbar
} from 'react-md'
import logo from '../img/nats-logo.png'
import './style.css'
import SnackbarContainer from 'react-md/lib/Snackbars/SnackbarContainer'

export default class Servers extends Component {
  constructor(props) {
    super(props)

    this.state = {
      host: 'localhost',
      port: '4222',
      monitoringPort: '8222',
      connected: false,
      config: undefined,
      servers: undefined
    }
  }

  componentDidMount = async () => {
    try {
      const [config, servers] = await Promise.all([
        getServerConfig(),
        getServers()
      ])
      console.log({ config, servers })
      this.setState({ connected: true, config, servers })
    } catch (err) {
      if (err.message === 'Request failed with status code 504') {
        this.setState({ connected: false })
      }
    }
  }

  configure = () => {
    this.setState({ connected: false })
  }

  changeHost = value => {
    this.setState({ host: value })
  }

  changePort = value => {
    this.setState({ port: value })
  }

  changeMonitoringPort = value => {
    this.setState({ monitoringPort: value })
  }

  submit = async () => {
    const data = pick(this.state, ['host', 'port', 'monitoringPort'])
    try {
      const { options: config, data: servers } = await updateServerConfig(data)
      console.log({ config, servers })
      this.setState({ connected: true, config, servers })
    } catch (err) {
      this.setState({
        error: `Could not connect. Check that your Nats Streaming Server is configured to allow monitoring at http://${
          data.host
        }:${data.monitoringPort}`
      })
    }
  }

  clearErrors = () => {
    this.setState({ error: undefined })
  }

  render() {
    const { connected } = this.state
    return connected ? this.renderServerInfo() : this.renderUpdate()
  }

  renderServerInfo() {
    const { configure } = this
    const { config, servers } = this.state

    const configEntries = Object.entries(config)
    const serversEntries = Object.entries(servers)

    return (
      <section>
        <Button floating fixed primary onClick={configure}>
          settings
        </Button>
        {configEntries &&
          configEntries.length && (
            <DataTable plain>
              <TableHeader>
                <TableRow style={{ backgroundColor: '#111' }}>
                  <TableColumn>Key</TableColumn>
                  <TableColumn>Value</TableColumn>
                </TableRow>
              </TableHeader>
              <TableBody>
                {configEntries.map(tuple => (
                  <TableRow key={tuple[0]}>
                    <TableColumn>{tuple[0]}</TableColumn>
                    <TableColumn>{tuple[1]}</TableColumn>
                  </TableRow>
                ))}
              </TableBody>
            </DataTable>
          )}
        {serversEntries &&
          serversEntries.length && (
            <DataTable plain>
              <TableHeader>
                <TableRow style={{ backgroundColor: '#111' }}>
                  <TableColumn>Key</TableColumn>
                  <TableColumn>Value</TableColumn>
                </TableRow>
              </TableHeader>
              <TableBody>
                {serversEntries.map(tuple => (
                  <TableRow key={tuple[0]}>
                    <TableColumn>{tuple[0]}</TableColumn>
                    <TableColumn>{tuple[1]}</TableColumn>
                  </TableRow>
                ))}
              </TableBody>
            </DataTable>
          )}
      </section>
    )
  }

  renderUpdate() {
    const { error, host, port, monitoringPort } = this.state
    const {
      changeHost,
      changePort,
      changeMonitoringPort,
      clearErrors,
      submit
    } = this
    return (
      <section>
        <Card style={{ maxWidth: 600 }}>
          <Toolbar themed title="Connect to Nats Streaming Server">
            <img src={logo} style={{ width: '162.5px', height: '55px' }} />
          </Toolbar>
          <div style={{ minHeight: 260, margin: 19 }}>
            <TextField
              id="host"
              label="Host"
              value={host}
              placeholder="localhost"
              onChange={changeHost}
            />
            <TextField
              id="port"
              label="Port"
              value={port}
              placeholder="4222"
              onChange={changePort}
            />
            <TextField
              id="monitoring-port"
              label="Monitoring Port"
              value={monitoringPort}
              placeholder="8222"
              onChange={changeMonitoringPort}
            />
          </div>
          <CardActions centered>
            <Button flat primary swapTheming onClick={submit}>
              Connect
            </Button>
          </CardActions>
        </Card>
        {error && (
          <Snackbar
            id="errors"
            toasts={[{ text: error, action: 'Ok' }]}
            autohide={false}
            onDismiss={clearErrors}
          />
        )}
      </section>
    )
  }
}
