import config from '../../config';
import events from './events';
import fs  from 'fs';

const isProduct = config.env === 'production' || process.env.NODE_ENV === 'production';

const wrap = fn => (...args) => fn(...args).catch(args[2]);

const renderError = err => {
  const softTab = '&#32;&#32;&#32;&#32;';
  const errTrace = process.env.NODE_ENV !== 'production' ?
    `:<br><br><pre style="color:red">${softTab}${err.stack.replace(/\n/g, `<br>${softTab}`)}</pre>` : '';
  return renderFullPage(`Server Error${errTrace}`, {});
};

const renderFullPage = (html = '', initialState = {}) => {
  // Import Manifests
  const assetsManifest = process.env.webpackAssets && JSON.parse(process.env.webpackAssets);
  const chunkManifest = process.env.webpackChunkAssets && JSON.parse(process.env.webpackChunkAssets);

  return `
<!doctype html>
<html>
  <head>
    ${isProduct ? `<link rel='stylesheet' href='${assetsManifest['/app.css']}' />` : ''}
    <link href='https://fonts.googleapis.com/css?family=Lato:400,300,700' rel='stylesheet' type='text/css'/>
    <link rel="shortcut icon" href="http://res.cloudinary.com/hashnode/image/upload/v1455629445/static_imgs/mern/mern-favicon-circle-fill.png" type="image/png" />
  </head>
  <body>
    <div id="root">${html}</div>
    <script>
      window.__INITIAL_STATE__ = ${JSON.stringify(initialState)};
      ${isProduct ?
      `//<![CDATA[
      window.webpackManifest = ${JSON.stringify(chunkManifest)};
      //]]>` : ''}
    </script>
    <script src='${isProduct ? assetsManifest['/static/vendor.js'] : '/static/vendor.js'}'></script>
    <script src='${isProduct ? assetsManifest['/static/app.js'] : '/static/app.js'}'></script>
  </body>
</html>
  `;
};

const readFile = path => new Promise((res, rej) => fs.readFile(path, (err, data) => err ? rej(err) : res(data)));

const writeFile = (path, data) => new Promise((res, rej) => fs.writeFile(path, data, (err) => err ? rej(err) : res(path)));

const pipe = (...fns) => {
    if (fns.length < 1) {
        throw Error('pipe requires at least one argument')
    }

    fns.forEach((fn, i) => {
        if (typeof fn !== 'function') {
            throw Error(`pipe requires each argument to be a function. Argument #${i+1} is of type "${typeof fn}"`)
        }
    })

    // https://github.com/kriskowal/q/wiki/API-Reference#qpromisedfunc
    const promised = fn => (...args) => Promise.all(args).then(_args => fn.apply(null, _args))
    return (...args) => fns.map(promised).reduce((acc, cur) => [cur.apply(null, acc)], args)[0]
};
const promisify = (fn, receiver) => {
  return function() {
    // for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    //   args[_key] = arguments[_key];
    // }
    var args = [].slice.call(arguments);

    return new Promise(function(resolve, reject) {
      fn.apply(receiver, [].concat(args, [function(err, res) {
        return err ? reject(err) : resolve(res);
      }]));
    });
  };
};

const $$ = {},
  toString = Object.prototype.toString,
  forEach = Function.prototype.call.bind(Array.prototype.forEach);
forEach(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function(name) {
     $$['is'+name] = function(obj) {
        return toString.call(obj) === '[object ' + name + ']' || false;
    }
})

function isType(obj) {
  return Object.prototype.toString.call(obj).replace(/^\[object (.+)\]$/, '$1').toLowerCase();
}

function dateFormat(date, format) {
  var o = {
    "M+": date.getMonth() + 1, //month
    "d+": date.getDate(), //day
    "h+": date.getHours(), //hour
    "m+": date.getMinutes(), //minute
    "s+": date.getSeconds(), //second
    "q+": Math.floor((date.getMonth() + 3) / 3), //quarter
    "S": date.getMilliseconds() //millisecond
  }
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
    }
  }
  return format;
}
function isFalsy(obj) {
  return obj instanceof Object ?
      Object.keys(obj).length < 1 :
        (obj instanceof Array ? obj.length < 1 : (obj === null) || isNaN(obj) || (obj === void 0) || obj.length < 1 || !~~obj || false);
}

var qs2obj = (str) => {
  return (str || document.location.search)
    .replace(/(^\?)/, '')
    .split("&")
    .reduce(function(p, n) {
      return n = n.split("="), p[n[0]] = decodeURIComponent(n[1]), p;
    }, {});
}
export {
  wrap,
  renderError,
  renderFullPage,
  readFile,
  writeFile,
  pipe,
  events,
}
