import { timeParse, ascending } from 'd3'

const parseDate = timeParse('%m/%d/%Y')

function flattenData(data) {
  let flattenedData = []
  let keys = []
  data.forEach(function(dataArray) {
    dataArray.forEach(function(row) {
      if (keys.indexOf(row.name) < 0) {
        keys.push(row.name)
      }
      let thisDate = row.date
      row.date = parseDate(row.date)
      let metricName = row.name
      row[metricName] = +row.count
      delete row.name
      delete row.count
    })
    flattenedData = flattenedData.concat(dataArray)
  })
  return {
    data: flattenedData,
    keys: keys
  }
}

function combineData(data) {
  let combinedData = []
  data.forEach(function(row) {
    let thisDate = row.date
    let index = combinedData.findIndex(x => +x.date === +thisDate)
    if (index > 0) {
      combinedData[index] = Object.assign(combinedData[index], row)
    } else {
      combinedData.push(row)
    }
  })
  return combinedData
}

function fillZeros(data, keys) {
  data.forEach(function(row) {
    keys.forEach(function(key) {
      if (!row[key]) {
        row[key] = 0
      }
    })
  })
  return data
}

function sortData(data) {
  data.sort(function(x, y) {
    return ascending(x.date, y.date)
  })
  return data
}

function roundDate(date) {
  if (date && date.setHours) {
    date.setHours(0)
    date.setMinutes(0)
    date.setSeconds(0)
    date.setMilliseconds(0)
    return date
  }
}

function findValue(data, date, metric) {
  let myVal
  data.forEach(function(row) {
    if (+row.data.date == +date) {
      myVal = row.data[metric]
    }
  })
  return myVal
}

export { flattenData, combineData, fillZeros, sortData, roundDate, findValue }
