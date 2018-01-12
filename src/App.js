import { upperFirst } from 'lodash/string'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { NavigationDrawer } from 'react-md'
import { withRouter } from 'react-router'
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom'
import logo from './logo.svg'
import NavItemLink from './components/nav-item-link'
import Home from './components/home-view'
import Clients from './components/client-view'
import Channels from './components/channel-view'
import Server from './components/server-view'
import Store from './components/store-view'

import './App.css'

const navItems = [
  {
    label: 'Home',
    to: '/',
    exact: true,
    icon: 'home'
  },
  {
    label: 'Clients',
    to: '/clients',
    icon: 'perm_identity'
  },
  {
    label: 'Channels',
    to: '/channels',
    icon: 'inbox'
  },
  {
    label: 'Server',
    to: '/server',
    icon: 'dns'
  },
  {
    label: 'Store',
    to: '/store',
    icon: 'store'
  }
]

const styles = {
  content: { minHeight: 'auto' }
}

class App extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props)
    this.state = { toolbarTitle: this.getCurrentTitle(props) }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ toolbarTitle: this.getCurrentTitle(nextProps) })
  }

  getCurrentTitle = props => {
    const { pathname } = props.location
    const lastSection = pathname.substring(pathname.lastIndexOf('/') + 1)
    return lastSection === ''
      ? 'Nats Streaming Console'
      : `Nats Streaming Console: ${this.toTitle(lastSection)}`
  }

  toTitle = str => {
    return str.split(/-|[A-Z]+/).reduce((s, split) => {
      const capititalized = split.match(/svg$/) ? 'SVG' : upperFirst(split)
      return `${s ? `${s} ` : ''}${capititalized}`
    }, '')
  }

  render() {
    const { toolbarTitle } = this.state
    const { location } = this.props
    return (
      <NavigationDrawer
        toolbarTitle={toolbarTitle}
        mobileDrawerType={NavigationDrawer.DrawerTypes.TEMPORARY_MINI}
        tabletDrawerType={NavigationDrawer.DrawerTypes.PERSISTENT_MINI}
        desktopDrawerType={NavigationDrawer.DrawerTypes.PERSISTENT_MINI}
        navItems={navItems.map(props => (
          <NavItemLink {...props} key={props.to} />
        ))}
        contentId="app-content"
        contentStyle={styles.content}
        contentClassName="md-grid"
      >
        <Switch key={location.pathname}>
          <Route path={navItems[0].to} exact component={Home} />
          <Route path={navItems[1].to} component={Clients} />
          <Route path={navItems[2].to} component={Channels} />
          <Route path={navItems[3].to} component={Server} />
          <Route path={navItems[4].to} component={Store} />
        </Switch>
      </NavigationDrawer>
    )
  }
}

export default withRouter(App)
