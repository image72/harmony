export class HttpClient {
  constructor(defaults) {
    this.defaults = defaults;
    this.interceptors = [];
    this.activeRequestCount = 0;
    this.isRequesting = false;
  }

  addInterceptor(interceptor) {
    this.interceptors.push(interceptor);
  }

  fetch(input, init) {
    let request = buildRequest(input, init, this.defaults);
    this._trackRequestStart();

    let promise = processRequest(request, this.interceptors)
      .then(result => {
        let response = null;

        if (result instanceof Response) {
          response = result;
        } else if (result instanceof Request) {
          response = fetch(result);
        } else {
          throw new Error(`An invalid result was returned by the interceptor chain. Expected a Request or Response instance, but got [${result}]`);
        }

        return processResponse(response, this.interceptors);
      });

    return this._trackRequestEndWith(promise);
  }

  jsonp(uri, jsonpCallbackParamName = 'callback') {
    this.trackRequestStart();

    let promise = new Promise((resolve, reject) => {
      reject('Not yet implemented');
    });

    return this._trackRequestEndWith(promise);
  }

  _trackRequestStart() {
    this.isRequesting = !!(++this.activeRequestCount);
  }

  _trackRequestEnd() {
    this.isRequesting = !!(--this.activeRequestCount);
  }

  _trackRequestEndWith(promise) {
    let handle = this._trackRequestEnd.bind(this);
    promise.then(handle, handle);
    return promise;
  }
}

export function json(body) {
  return new Blob([JSON.stringify(body)], {
    type: 'application/json'
  });
}

function buildRequest(input, init, defaults) {
  let config = defaults || {};

  let initRequest;
  let url;
  let body;

  if (input instanceof Request) {
    if (!defaults) {
      return input;
    }

    initRequest = input;
    url = input.url;
    body = input.blob();
  } else {
    initRequest = init;
    url = input;
    body = init.body;
  }

  let headers = new Headers(config.headers || {});
  for (let [name, value] of new Headers(initRequest.headers || {})) {
    headers.append(name, value);
  }

  return new Request((config.baseUrl || '') + url, {
    method: initRequest.method,
    headers: headers,
    body: body,
    mode: initRequest.mode,
    credentials: initRequest.credentials,
    cache: initRequest.cache
  });
}

function processRequest(request, interceptors) {
  return applyInterceptors(request, interceptors, 'request', 'requestError');
}

function processResponse(response, interceptors) {
  return applyInterceptors(response, interceptors, 'response', 'responseError');
}

function applyInterceptors(input, interceptors, successName, errorName) {
  let promise = Promise.resolve(input);

  for (let interceptor of interceptors) {
    let successHandler = interceptor[successName];
    let errorHandler = interceptor[errorName];

    promise = promise.then(successHandler && successHandler.bind(interceptor), errorHandler && errorHandler.bind(interceptor));
  }

  return promise;
}

```js
import {HttpClient, json} from 'fetch-client';

let client = new HttpClient({ baseUrl: 'http://www.example.com/', headers: { 'x-foo': 'bar' } });

client.addInterceptor({
	responseError(response) {
		if (response.status === 401) {
			// TODO: handle unauthenticated
		} else {
			throw response;
		}
	}
});

client.fetch('api?baz=bat', {
		method: 'post',
		body: json({ some: 'content' })
	})
	.then(response => console.log(response.json()))
	.catch(response => console.error(response.statusText));
```
