class CustomerApi {
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

  getCustomers(updatedSince, kiosk_id) {
    let options = {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + this._token,
      },
    };
    console.log(kiosk_id, '-', updatedSince);
    let url = `sema/site/customers/${kiosk_id}/${updatedSince}`;
    return fetch(this._url + url, options)
      .then((response) => response.json())
      .then((responseJson) => {
        return responseJson;
      })
      .catch((error) => {
        throw error;
      });
  }

  createCustomer(customer) {
    customer.customerType = 128; // FRAGILE
    let options = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this._token,
      },
      body: JSON.stringify(customer),
    };
    return new Promise((resolve, reject) => {
      fetch(this._url + 'sema/site/customers', options)
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
  // Note that deleting a csutomer actually just deactivates the customer
  deleteCustomer(customer) {
    let options = {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this._token,
      },
      body: JSON.stringify(customer),
    };
    return new Promise((resolve, reject) => {
      fetch(this._url + 'sema/site/customers/' + customer.customerId, options)
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

  updateCustomer(customer) {
    let options = {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this._token,
      },
      body: JSON.stringify(customer),
    };
    return new Promise((resolve, reject) => {
      fetch(this._url + 'sema/site/customers/' + customer.customerId, options)
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

export default new CustomerApi();
