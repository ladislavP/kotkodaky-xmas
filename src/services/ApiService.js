/* eslint-disable */
import 'isomorphic-fetch';
import base64 from 'base-64';
import { userInfo } from 'os';

class API {
  constructor() {
    this.baseUrl = 'http://bciapi.eu-west-1.elasticbeanstalk.com';
    this.username = null;
    this.password = null;
  }

  serializeQueryParams(parameters) {
    const str = [];
    for (let p in parameters) {
      if (parameters.hasOwnProperty(p)) {
        str.push(
          `${encodeURIComponent(p)}=${encodeURIComponent(parameters[p])}`
        );
      }
    }
    return str.join('&');
  }

  paramsToObject(params) {
    let query = params.substr(1);
    let result = {};
    query.split('&').forEach(function (part) {
      let item = part.split('=');
      result[item[0]] = decodeURIComponent(item[1]);
    });
    return result;
  }

  mergeQueryParams(parameters, queryParameters) {
    if (parameters.$queryParameters) {
      Object.keys(parameters.$queryParameters).forEach(function (parameterName) {
        const parameter = parameters.$queryParameters[parameterName];
        queryParameters[parameterName] = parameter;
      });
    }
    return queryParameters;
  }

  /**
   * HTTP Request
   * @method
   * @param {string} method - http method
   * @param {string} url - url to do request
   * @param {object} body - body parameters / object
   * @param {object} headers - header parameters
   * @param {object} queryParameters - querystring parameters
   */
  request(
    method,
    url,
    body,
    headers,
    queryParameters,
    form
  ) {
    const queryParams =
      queryParameters && Object.keys(queryParameters).length
        ? this.serializeQueryParams(queryParameters)
        : null;
    const urlWithParams = url + (queryParams ? '?' + queryParams : '');

    // ugly hack, we need to delete Content-Type header with multipart/form-data
    // that way, browser will calculate form specific headers on it's own
    // contentTypeHeader[0] because nearly every header's value is set using array
    const contentTypeHeader = headers['Content-Type'];
    if (contentTypeHeader && contentTypeHeader[0] === 'multipart/form-data') {
      delete headers['Content-Type'];
    }

    if (body && !Object.keys(body).length) {
      body = undefined;
    } else {
      body = JSON.stringify(body);
    }

    if (form && Object.keys(form).length) {
      body = new FormData();
      for (let k in form) {
        body.append(k, form[k]);
      }
    }

    return fetch(urlWithParams, {
      method,
      headers,
      body,
    })
      .then(response => {
        if (response.ok) {
          if (
            response.headers.get('Content-Type').includes('application/json')
          ) {
            return response.json();
          } else if (
            response.headers.get('Content-Type').includes('application/pdf')
          ) {
            return response.blob();
          }
          return {};
        } else {
          let error = new Error(response.statusText);
          error.response = response;
          throw error;
        }
      })
      .catch(error => {
        return error.response.json().then(error_details => {
          error.details = error_details;
          throw error;
        });
      });
  }

  /**
   * Set Token
   * @method
   * @param {string} token - token's value
   */
  setLogin(username, password) {
    this.username = username;
    this.password = password;
  }

  /**
   * Set Auth headers
   * @method
   * @param {object} headerParams - headers object
   */
  setAuthHeaders(headerParams) {
    let headers = headerParams ? headerParams : {};
    if (this.username) {
      headers['Authorization'] = 'Basic ' + base64.encode(this.username + ":" + this.password);
    }
    return headers;
  }

  join(username, password) {
    this.setLogin(username, password);

    let path = '/game/players/join';
    let body = {};
    let queryParameters = {};
    let headers = {};
    let form = {};

    headers = Object.assign({}, headers, this.setAuthHeaders(headers));
    headers['Accept'] = ['application/json'];
    headers['Content-Type'] = ['application/json'];

    return this.request(
      'POST',
      `${this.baseUrl}${path}`,
      body,
      headers,
      queryParameters,
      form
    );
  }

  board() {

    let path = '/game/board';
    let body = {};
    let queryParameters = {};
    let headers = {};
    let form = {};

    headers = Object.assign({}, headers, this.setAuthHeaders(headers));
    headers['Accept'] = ['application/json'];
    headers['Content-Type'] = ['application/json'];

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      body,
      headers,
      queryParameters,
      form
    );
  }

  move({ x, y }) {
    let path = '/game/bewegen';
    let body = { x, y };
    let queryParameters = {};
    let headers = {};
    let form = {};

    headers = Object.assign({}, headers, this.setAuthHeaders(headers));
    headers['Accept'] = ['application/json'];
    headers['Content-Type'] = ['application/json'];

    return this.request(
      'POST',
      `${this.baseUrl}${path}`,
      body,
      headers,
      queryParameters,
      form
    );
  }

  akcia() {
    let path = '/game/akcija';
    let body = { };
    let queryParameters = {};
    let headers = {};
    let form = {};

    headers = Object.assign({}, headers, this.setAuthHeaders(headers));
    headers['Accept'] = ['application/json'];
    headers['Content-Type'] = ['application/json'];

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      body,
      headers,
      queryParameters,
      form
    );
  }

  odpovedaj(odpoved) {
    let path = '/game/akcija';
    let body = odpoved;
    let queryParameters = {};
    let headers = {};
    let form = {};

    headers = Object.assign({}, headers, this.setAuthHeaders(headers));
    headers['Accept'] = ['text/plain'];
    headers['Content-Type'] = ['text/plain'];

    return this.request(
      'POST',
      `${this.baseUrl}${path}`,
      body,
      headers,
      queryParameters,
      form
    );
  }

  async getMyPosition() {
    const b = await this.board();
    for (const p of b) {
      for (const pc of p.pieces) {
        if (pc.playerId === 8) {
          return p.position.data;
        }
      }
    }
    return null;
  }
}

export default new API();