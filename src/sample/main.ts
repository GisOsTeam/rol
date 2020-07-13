import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { SampleApp } from './SampleApp';
import { HttpEngine, BeforeSendInterceptor } from '@gisosteam/aol/HttpInterceptor';
import { IRequest, IResponse } from 'bhreq';

const ReactElement = React.createElement(SampleApp);
const httpEngine = HttpEngine.getInstance();

document.cookie = 'JSESSIONID=5nnxhe3hyvu2';
// console.log(parent.document.cookie)
const oldSend = HttpEngine.prototype.send;
HttpEngine.prototype.send = async (rawRequest: IRequest) => {
  const resp: IResponse = {
    body: {
      val: 'test',
    },
    contentType: 'JSON',
    headers: {},
    responseType: 'json',
    status: 200,
    statusText: 'OK',
    text: 'Ook',
  };
  const requestInit: RequestInit = {
    ...rawRequest,
    headers: { ...rawRequest.headers, Cookie: 'JSESSIONID=5nnxhe3hyvu2' },
    credentials: 'include',
  };
  const fetchResp = await fetch(rawRequest.url, requestInit);
  const jsonResp = await fetchResp.json();
  const headers: { [key: string]: string } = {};
  fetchResp.headers.forEach((value: any, key: string) => {
    headers[key] = value;
  });

  console.log(headers);
  const response: IResponse = {
    body: jsonResp,
    text: JSON.stringify(jsonResp),
    statusText: fetchResp.statusText,
    status: fetchResp.status,
    contentType: fetchResp.headers.get('content-type'),
    responseType: 'json',
    headers,
  };
  return response;
};

const sampleBeforeSendInterceptor: BeforeSendInterceptor = (request: IRequest) => {
  const jsession = document.cookie.split(';').find((cook) => cook.match('JSESSIONID=')) || null;
  const alteredReq: IRequest = {
    ...request,
    headers: {
      ...request.headers,
      Cookies: jsession,
    },
  };
  console.log('Intercept', request, alteredReq);
  return request;
};

httpEngine.beforeSendInterceptors.push(sampleBeforeSendInterceptor);
ReactDOM.render(ReactElement, document.getElementById('root'));
