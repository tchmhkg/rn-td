// import queryString from 'query-string';
import ReconnectingWebSocket from 'reconnecting-websocket';

class SocketWithPrincipals {
  constructor(principals, socket) {
    console.log('Generated socket with principals.');
    console.log('Socket: ', socket);
    this.principals = principals;
    this.socket = socket;
  }

  send(...requests) {
    let result = {
      requests: [],
    };

    let i = 0;
    requests.forEach((request) => {
      request.account = this.principals.accounts[0].accountId;
      request.source = this.principals.streamerInfo.appId;
      request.requestid = i;
      result.requests.push(request);
      i++;
    });

    console.log('Sending ' + i + ' request(s)');

    this.socket.send(JSON.stringify(result));
  }
}

const connect = function (accessToken, messageHandler) {
  return authenticate(accessToken).then((userPrincipalsResponse) => {
    return startWebSocket(userPrincipalsResponse, messageHandler);
  });
};

//Returns user principals response
const authenticate = function (accessToken) {
  console.log('Authenticating');
  const authenticationUrl =
    'https://api.tdameritrade.com/v1/userprincipals?fields=streamerSubscriptionKeys,streamerConnectionInfo';
  const params = {headers: {Authorization: 'Bearer ' + accessToken}};
  return new Promise((resolve) => {
    fetch(authenticationUrl, params).then((response) => {
      resolve(response.json());
    });
  });
};

const startWebSocket = function (userPrincipalsResponse, messageHandler) {
  // console.log('userPrincipalsResponse', userPrincipalsResponse);
  return new Promise((resolve) => {
    console.log('Starting web socket');

    let mySock = new ReconnectingWebSocket(
      'wss://' + userPrincipalsResponse.streamerInfo.streamerSocketUrl + '/ws',
    );

    //We start off with the login handler since you can't do anything without being logged in.
    //After login, set the message handler to the one passed in.

    const loginHandler = (evt) => {
      const data = JSON.parse(evt.data);
      console.log('loginHandler data', data);

      if (data.response) {
        if (data.response[0].content.code === 0) {
          mySock.onmessage = messageHandler;
          console.log('Logged in to streaming API');
          resolve(new SocketWithPrincipals(userPrincipalsResponse, mySock));
        }
      }
    };

    mySock.onmessage = loginHandler;
    mySock.onclose = (e) => {
      console.log('Socket Closed');
      console.log(e.code, e.reason);
    };

    mySock.onopen = (e) => {
      console.log('onopen');
    };

    mySock.onerror = (e) => {
      // an error occurred
      console.log('onerror');
      console.log(e.message);
    };

    const loginRequest = {
      requests: [
        {
          service: 'ADMIN',
          command: 'LOGIN',
          requestid: '1',
          account: userPrincipalsResponse.accounts[0].accountId,
          source: userPrincipalsResponse.streamerInfo.appId,
          parameters: {
            credential: jsonToQueryString(
              makeCredentials(userPrincipalsResponse),
            ),
            token: userPrincipalsResponse.streamerInfo.token,
            version: '1.0',
          },
        },
      ],
    };
    // console.log(loginRequest);

    //Wait a second for the socket to initialize;
    setTimeout(() => {
      console.log('Logging in to streaming api');
      mySock.send(JSON.stringify(loginRequest));
    }, 1000);
  });
};

function jsonToQueryString(json) {
  return Object.keys(json)
    .map(function (key) {
      return encodeURIComponent(key) + '=' + encodeURIComponent(json[key]);
    })
    .join('&');
}

function makeCredentials(userPrincipalsResponse) {
  //Converts ISO-8601 response in snapshot to ms since epoch accepted by Streamer
  const tokenTimeStampAsDateObj = new Date(
    userPrincipalsResponse.streamerInfo.tokenTimestamp,
  );
  const tokenTimeStampAsMs = tokenTimeStampAsDateObj.getTime();

  const credentials = {
    userid: userPrincipalsResponse.accounts[0].accountId,
    token: userPrincipalsResponse.streamerInfo.token,
    company: userPrincipalsResponse.accounts[0].company,
    segment: userPrincipalsResponse.accounts[0].segment,
    cddomain: userPrincipalsResponse.accounts[0].accountCdDomainId,
    usergroup: userPrincipalsResponse.streamerInfo.userGroup,
    accesslevel: userPrincipalsResponse.streamerInfo.accessLevel,
    authorized: 'Y',
    timestamp: tokenTimeStampAsMs,
    appid: userPrincipalsResponse.streamerInfo.appId,
    acl: userPrincipalsResponse.streamerInfo.acl,
  };
  return credentials;
}

export default connect;
