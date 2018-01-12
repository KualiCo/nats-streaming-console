import { isString } from 'lodash'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { getStores } from '../api/nats-streaming'
import {
  DataTable,
  TableHeader,
  TableBody,
  TableRow,
  TableColumn
} from 'react-md'

import './style.css'

export default class Stores extends Component {
  // static propTypes = {}
  // static defaultProps = {}
  constructor(props) {
    super(props)

    this.state = {
      stores: undefined
    }
  }

  componentDidMount = async () => {
    const stores = await getStores()
    this.setState({ stores: Object.entries(stores) })
  }

  toTable = obj => {
    const array = Object.entries(obj)
    return (
      <DataTable plain>
        <TableHeader>
          <TableRow>
            <TableColumn>Key</TableColumn>
            <TableColumn>Value</TableColumn>
          </TableRow>
        </TableHeader>
        <TableBody>
          {array &&
            array.map(tuple => (
              <TableRow key={tuple[0]}>
                <TableColumn>{tuple[0]}</TableColumn>
                <TableColumn>
                  {isString ? tuple[1] : this.toTable(tuple[1])}
                </TableColumn>
              </TableRow>
            ))}
        </TableBody>
      </DataTable>
    )
  }

  render() {
    const { stores } = this.state
    return (
      <DataTable plain>
        <TableHeader>
          <TableRow>
            <TableColumn>Key</TableColumn>
            <TableColumn>Value</TableColumn>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stores &&
            stores.map(tuple => (
              <TableRow key={tuple[0]}>
                <TableColumn>{tuple[0]}</TableColumn>
                <TableColumn>
                  {isString(tuple[1]) ? tuple[1] : this.toTable(tuple[1])}
                </TableColumn>
              </TableRow>
            ))}
        </TableBody>
      </DataTable>
    )
  }
}
