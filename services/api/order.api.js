import {format, sub} from 'date-fns';
class OrderApi {
  constructor() {
    this._url = 'http://142.93.115.206:3002/';
    this._site = '';
    this._user = '';
    this._password = '';
    this._token = '';
    this._siteId = '';
  }

  initialize(url, site, user, password, token, siteId) {
    if (!url.endsWith('/')) {
      url = url + '/';
    }
    //this._url = url;
    this._url = 'http://142.93.115.206:3002/';
    this._site = site;
    this._user = user;
    this._password = password;
    this._token = token;
    this._siteId = siteId;
  }

  setToken(token) {
    this._token = token;
  }
  setSiteId(siteId) {
    this._siteId = siteId;
  }

  createOrder(receipt) {
    let options = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this._token,
      },
      body: JSON.stringify(receipt),
    };
    return new Promise((resolve, reject) => {
      fetch(this._url + 'sema/site/newreceipts', options)
        .then((response) => {
          if (response.status === 200) {
            response
              .json()
              .then((responseJson) => {
                resolve(responseJson);
              })
              .catch((error) => {
                reject();
              });
          } else if (response.status === 409) {
            // Indicates this receipt has already been added
            resolve({});
          } else {
            reject(response.status);
          }
        })
        .catch((error) => {
          reject();
        });
    });
  }

  deleteOrder(receipt, siteId) {
    //return receipt;
    let options = {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({...receipt, kiosk_id: siteId}),
    };
    return new Promise((resolve, reject) => {
      fetch(this._url + `sema/site/newreceipts/${siteId}`, options)
        .then((response) => {
          if (response.status === 200) {
            response
              .json()
              .then((responseJson) => {
                resolve(responseJson);
              })
              .catch((error) => {
                reject();
              });
          } else if (response.status === 409) {
            // Indicates this receipt has already been added
            resolve({});
          } else {
            reject(response.status);
          }
        })
        .catch((error) => {
          reject();
        });
    });
  }

  getReceipts(siteId, lastSyncDate) {
    let options = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + this._token,
      },
    };
    let url = `sema/site/newreceipts/${siteId}?date=${lastSyncDate}`;
    //let url = 'sema/site/newreceipts/1112?date=2020-05-02';
    return fetch(this._url + url, options)
      .then((response) => response.json())
      .then((responseJson) => {
        return responseJson;
      })
      .catch((error) => {
        throw error;
      });
  }

  getReceiptsBySiteIdAndDate(siteId, date) {
    date = date.toISOString();
    let options = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + this._token,
      },
    };

    let url = `sema/site/newreceipts/${siteId}?date=${date}`;

    return fetch(this._url + url, options)
      .then(async (response) => await response.json())
      .catch((error) => {
        throw error;
      });
  }
}

export default new OrderApi();
