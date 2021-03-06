class CreditApi {
  constructor() {
    this._url = 'http://142.93.115.206:3002/';
    this._site = '';
    this._user = '';
    this._password = '';
    this._token = '';
    this._siteId = '';
    this.customer_account_id = '';
  }

  initialize(url, site, user, password, token, siteId) {
    if (!url.endsWith('/')) {
      url = url + '/';
    }
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

  getTopUps(kiosk_id, updatedSince) {
    let options = {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + this._token,
      },
    };
    let url = `sema/customer_credit/${kiosk_id}/${updatedSince}`;
    //let url = 'sema/customer_credit/1112/2020-05-02';
    return fetch(this._url + url, options)
      .then((response) => response.json())
      .then((responseJson) => {
        return responseJson;
      })
      .catch((error) => {
        throw error;
      });
  }

  createTopUp(topup) {
    let options = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this._token,
      },
      body: JSON.stringify(topup),
    };
    return new Promise((resolve, reject) => {
      fetch(this._url + 'sema/customer_credit', options)
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
          } else {
            reject();
          }
        })
        .catch((error) => {
          reject();
        });
    });
  }
  // Note that deleting a topup actually just deactivates the TopUp
  deleteTopUp(topup) {
    let options = {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this._token,
      },
      body: JSON.stringify({
        active: false,
      }),
    };
    return new Promise((resolve, reject) => {
      fetch(this._url + 'sema/customer_credit/' + topup.top_up_id, options)
        .then((response) => {
          if (response.status === 200 || response.status === 404) {
            resolve();
          } else {
            reject();
          }
        })
        .catch((error) => {
          reject();
        });
    });
  }

  updateCustomerCredit(topup) {
    let options = {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this._token,
      },
      body: JSON.stringify(topup),
    };
    return new Promise((resolve, reject) => {
      fetch(this._url + 'sema/customer_credit/' + topup.top_up_id, options)
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
          } else {
            reject();
          }
        })
        .catch((error) => {
          reject();
        });
    });
  }
}

export default new CreditApi();
