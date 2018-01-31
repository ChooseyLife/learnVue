import originJsonp from 'jsonp'

export default function jsonp(url, data, options) {
  url += (url.indexOf('?') < 0 ? '?' : '&') + param(data)

  return new Promise((resolve, reject) => {
    originJsonp(url, options, (error, data) => {
      if (!error) {
        resolve(data)
      } else {
        reject(error)
      }
    })
  })
}

// 将data转化为ajax发送数据格式

export function param (data) {
  let url = ''
  for (var k in data) {
    let value = data[k] !== undefined ? data[k] : ''
    url += '&' + k + '=' + encodeURIComponent(value)
  }
  return url ? url.substring(1) : ''
}
