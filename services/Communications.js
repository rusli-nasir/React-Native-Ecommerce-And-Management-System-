import CreditApi from './api/credit.api';
import InventoryApi from './api/inventory.api';
import CustomerApi from './api/customer.api';
import ProductApi from './api/product.api';
import SalesChannelApi from './api/sales-channel.api';
import CustomerTypeApi from './api/customer-types.api';
import OrderApi from './api/order.api';
import DiscountApi from './api/discounts.api';

import RecieptPaymentTypesApi from './api/reciept-payment-types.api';
import CustomerDebtApi from './api/customer-debt.api';
import PaymentTypesApi from './api/payment-types.api';

class Communications {
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
		let produrl = 'http://142.93.115.206:3002/';
		this._url = produrl;
		this._site = site;
		this._user = user;
		this._password = password;
		this._token = token;
		this._siteId = siteId;

		CreditApi.initialize(
			produrl,
			site,
			user,
			password,
			token,
			siteId
		);


		InventoryApi.initialize(
			produrl,
			site,
			user,
			password,
			token,
			siteId
		);

		CustomerApi.initialize(
			produrl,
			site,
			user,
			password,
			token,
			siteId
		);

		ProductApi.initialize(
			produrl,
			site,
			user,
			password,
			token,
			siteId
		);

		CustomerTypeApi.initialize(
			produrl,
			site,
			user,
			password,
			token,
			siteId
		);

		SalesChannelApi.initialize(
			produrl,
			site,
			user,
			password,
			token,
			siteId
		);

		OrderApi.initialize(
			produrl,
			site,
			user,
			password,
			token,
			siteId
		);
		DiscountApi.initialize(
			produrl,
			site,
			user,
			password,
			token,
			siteId
		);
		CustomerDebtApi.initialize(
			produrl,
			site,
			user,
			password,
			token,
			siteId
		);
		PaymentTypesApi.initialize(
			produrl,
			site,
			user,
			password,
			token,
			siteId
		);
		RecieptPaymentTypesApi.initialize(
			produrl,
			site,
			user,
			password,
			token,
			siteId
		);

	}

	setToken(token) {
		this._token = token;
		SalesChannelApi.setToken(token);
		CreditApi.setToken(token);
		InventoryApi.setToken(token);
		CustomerApi.setToken(token);
		ProductApi.setToken(token);
		CustomerTypeApi.setToken(token);
		SalesChannelApi.setToken(token);
		OrderApi.setToken(token);
		DiscountApi.setToken(token);
		CustomerDebtApi.setToken(token);
		PaymentTypesApi.setToken(token);
		RecieptPaymentTypesApi.setToken(token);

	}
	setSiteId(siteId) {
		this._siteId = siteId;
		SalesChannelApi.setSiteId(siteId);
		CreditApi.setSiteId(siteId);
		InventoryApi.setSiteId(siteId);
		CustomerApi.setSiteId(siteId);
		ProductApi.setSiteId(siteId);
		CustomerTypeApi.setSiteId(siteId);
		SalesChannelApi.setSiteId(siteId);
		OrderApi.setSiteId(siteId);
		DiscountApi.setSiteId(siteId);
		CustomerDebtApi.setSiteId(siteId);
		PaymentTypesApi.setSiteId(siteId);
		RecieptPaymentTypesApi.setSiteId(siteId);
	}

	login(usernameOrEmail,password) {
		let options = {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				usernameOrEmail: usernameOrEmail,
				password: password
			})
		};
		return new Promise((resolve, reject) => {
			try {
				fetch(this._url + 'sema/login', options)
					.then(response => {
						if (response.status == 200) {
							response
								.json()
								.then(responseJson => {
									resolve({
										status: response.status,
										response: responseJson
									});
								})
								.catch(error => {
									reject({
										status: response.status,
										response: error
									});
								});
						} else {
							let reason = '';
							if (response.status === 401) {
								reason = '- Invalid credentials ';
							} else if (response.status === 404) {
								reason = '- Service URL not found ';
							}

							reject({
								status: response.status,
								response: {
									message:
										'Cannot connect to the Sema service. ' +
										reason
								}
							});
						}
					})
					.catch(error => {
						reject({
							status: 418,
							response: error
						}); // This is the "I'm a teapot error"
					});
			} catch (error) {
				reject({
					status: 418,
					response: error
				});
			}
		});
	}

	getReminders() {
		let options = {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				Authorization: 'Bearer' + this._token
			}
		};
		let urlr = 'sema/reminders?site-id=' + this._siteId;
		that = this;
		return fetch(that._url + urlr, options).then(response =>

			response.json()

		).catch(error => {});
	}

}
export default new Communications();
