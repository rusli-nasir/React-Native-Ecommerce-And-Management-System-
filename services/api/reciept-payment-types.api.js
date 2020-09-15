class RecieptPaymentTypesApi {
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

  getReceiptPaymentTypes(kiosk_id, updatedSince) {
    let options = {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + this._token,
      },
    };
    //let url = `sema/receipt_payment_type/${kiosk_id}/${updatedSince}`;

    let url = `sema/receipt_payment_type/1112/2020-05-02`;
    return fetch(this._url + url, options)
      .then((response) => response.json())
      .then((responseJson) => {
        return responseJson;
      })
      .catch((error) => {
        throw error;
      });
  }

  createReceiptPaymentType(receipt_payment_type) {
    // TODO - Resolve receipt_payment_type.... Is it needed, currently hardcoded...
    let options = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this._token,
      },
      body: JSON.stringify(receipt_payment_type),
    };
    return new Promise((resolve, reject) => {
      fetch(this._url + 'sema/receipt_payment_type', options)
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
  // Note that deleting a receipt_payment_type actually just deactivates the ReceiptPaymentType
  deleteReceiptPaymentType(receipt_payment_type) {
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
      fetch(
        this._url +
          'sema/receipt_payment_type/' +
          receipt_payment_type.receipt_payment_type_id,
        options,
      )
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

  updateReceiptPaymentType(receipt_payment_type) {
    let options = {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this._token,
      },
      body: JSON.stringify(receipt_payment_type),
    };
    return new Promise((resolve, reject) => {
      fetch(
        this._url +
          'sema/receipt_payment_type/' +
          receipt_payment_type.receipt_payment_type_id,
        options,
      )
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

export default new RecieptPaymentTypesApi();
