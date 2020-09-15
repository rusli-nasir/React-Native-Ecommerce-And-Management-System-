class ReminderApi {

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

	getCustomerReminder(kiosk_id, date) {
		let options = {
			method: 'GET',
			headers: {
				Authorization: 'Bearer ' + this._token
			}
		};
		let url = `sema/customer_reminders/${kiosk_id}/${date}`;

		return fetch(this._url + url, options)
			.then(response => response.json())
			.then(responseJson => {
				return responseJson;
			})
			.catch(error => {
				throw error;
			});
	}

	createCustomerReminder(CustomerReminder) {
		let options = {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + this._token
			},
			body: JSON.stringify(CustomerReminder)
		};
		return new Promise((resolve, reject) => {
			fetch(this._url + 'sema/customer_reminders/', options)
				.then(response => {

					if (response.status === 200) {
						response
							.json()
							.then(responseJson => {
								resolve(responseJson);
							})
							.catch(error => {

								reject();
							});
					} else {

						reject(response.headers.map.message);
					}
				})
				.catch(error => {
					reject();
				});
		});
	}
	// Note that deleting a CustomerReminder actually just deactivates the CustomerReminder
	deleteCustomerReminder(CustomerReminder) {
		let options = {
			method: 'DELETE',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + this._token
			},
			body: JSON.stringify({
				active: false
			})
		};
		return new Promise((resolve, reject) => {
			fetch(
				this._url + 'sema/customer_reminders/' + CustomerReminder.reminder_id,
				options
			)
				.then(response => {
					if (response.status === 200 || response.status === 404) {
						resolve();
					} else {

						reject();
					}
				})
				.catch(error => {
					reject();
				});
		});
	}

	updateCustomerReminder(CustomerReminder) {
		let options = {
			method: 'PUT',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + this._token
			},
			body: JSON.stringify(CustomerReminder)
		};
		return new Promise((resolve, reject) => {
			fetch(
				this._url + 'sema/customer_reminders/' + CustomerReminder.reminder_id,
				options
			)
				.then(response => {
					if (response.status === 200) {
						response
							.json()
							.then(responseJson => {
								resolve(responseJson);
							})
							.catch(error => {

								reject();
							});
					} else {

						reject();
					}
				})
				.catch(error => {
					reject();
				});
		});
	}


}

export default new ReminderApi();
