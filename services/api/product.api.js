class ProductApi {
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

	getProducts(date) {
		let options = {
			method: 'GET',
			headers: {
				Authorization: 'Bearer ' + this._token
			}
		};
	     let url = `sema/products/${date}`;
		return fetch(this._url + url, options)
			.then(response => response.json())
			.then(responseJson => {
				return responseJson;
			})
			.catch(error => {
				throw error;
			});
	}

	// getAll will determine whether to get all product mappings or not, if it's true,
	// it will send a site/kiosk ID of -1 to the server
	getProductMrps(regionId, date) {
		let options = {
			method: 'GET',
			headers: {
				Authorization: 'Bearer ' + this._token
			}
		};
		let url = `sema/sema_pricing/${regionId}/${date}`;
		return fetch(this._url + url, options)
			.then(response => response.json())
			.then(responseJson => {
				return responseJson;
			})
			.catch(error => {
				throw error;
			});
	}

	getProductMrpsBySiteId(siteId) {
		let options = {
			method: 'GET',
			headers: {
				Authorization: 'Bearer ' + this._token
			}
		};
		let url = `sema/site/product-mrps?site-id=${siteId}`;
		return fetch(this._url + url, options)
			.then(response => response.json())
			.then(responseJson => {
				return responseJson;
			})
			.catch(error => {
				throw error;
			});
	}


}

export default new ProductApi();
