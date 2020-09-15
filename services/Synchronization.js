import CreditRealm from '../database/credit/credit.operations';
import InventroyRealm from '../database/inventory/inventory.operations';
import SettingRealm from '../database/settings/settings.operations';
import Communications from '../services/Communications';

import * as _ from 'lodash';
import InventorySync from './sync/inventory.sync';
import CreditSync from './sync/credit.sync';
import MeterReadingSync from './sync/meter-reading.sync';
import ReminderSync from './sync/reminders.sync';
import CustomerSync from './sync/customer.sync';
import ProductSync from './sync/product.sync';
import ProductMRPSync from './sync/productmrp.sync';
import SalesChannelSync from './sync/sales-channel.sync';
import CustomerTypeSync from './sync/customer-types.sync';
import OrderSync from './sync/orders.sync';
import DiscountSync from './sync/discounts.sync';
import PaymentTypeSync from './sync/payment-type.sync';

import RecieptPaymentTypesSync from './sync/reciept-payment-types.sync';
import CustomerDebtsSync from './sync/customer-debt.sync';

class Synchronization {

	constructor() {
	}

	initialize(lastCustomerSync, lastProductSync, lastSalesSync, lastCreditSync, lastInventorySync) {
		this.lastCustomerSync = lastCustomerSync;
		this.lastProductSync = lastProductSync;
		this.lastSalesSync = lastSalesSync;
		this.intervalId = null;
		this.firstSyncId = null;
		this.isConnected = false;
		this.lastCreditSync = lastCreditSync;
		this.lastInventorySync = lastInventorySync;
	}

	setConnected(isConnected) {
		this.isConnected = isConnected;
	}


	updateLastCustomerSync() {
		this.lastCustomerSync = new Date();
	}
	updateLastProductSync() {
		this.lastProductSync = new Date();
	}
	updateLastSalesSync() {
		this.lastSalesSync = new Date();
	}

	updateLastTopUpSync() {
		this.lastCreditSync = new Date();
		CreditRealm.setLastCreditSync(this.lastCreditSync);
	}


	updateInventorySync() {
		this.lastInventorySync = new Date();
		InventroyRealm.setLastInventorySync(this.lastInventorySync);
	}

	doSynchronize() {
		if (this.isConnected) {
			//this.synchronize();
			//Sync customers
			CustomerSync.synchronizeCustomers();

			//Synchronize receipts
			//this.synchReceipts();
		} else {

		}
	}


	synchronize() {
		console.log("Start synching ...");
		let syncResult = { status: 'success', error: '' };
		return this._refreshToken()
			.then(async result => {
				try {
					console.log("Start synching for real now ...", result);
					let settings = SettingRealm.getAllSetting();
					const promiseSalesChannels = await SalesChannelSync.synchronizeSalesChannels();
					console.log("promiseSalesChannels ...", promiseSalesChannels);
					const promiseCustomerTypes = await CustomerTypeSync.synchronizeCustomerTypes();
					console.log("promiseCustomerTypes ...", promiseCustomerTypes);
					const promisePaymentTypes = await PaymentTypeSync.synchronizePaymentTypes();
					console.log("promisePaymentTypes ...", promisePaymentTypes);
					const promiseDiscounts = await DiscountSync.synchronizeDiscount(settings.siteId);
					console.log("promiseDiscounts ...", promiseDiscounts);
					const promiseProductMrps = await ProductMRPSync.synchronizeProductMrps(settings.regionId);
					console.log("promiseProductMrps ...", promiseProductMrps);
					const promiseProducts = await ProductSync.synchronizeProducts();
					console.log("promiseProducts ...", promiseProducts);
					const promiseMeterReading = await MeterReadingSync.synchronizeMeterReading(settings.siteId);
					console.log("promiseMeterReading ...", promiseMeterReading);
					const promiseReminder = await ReminderSync.synchronizeCustomerReminders(settings.siteId);
					console.log("promiseReminder ...", promiseReminder);
					const promiseInventory = await InventorySync.synchronizeInventory(settings.siteId);
					console.log("promiseInventory ...", promiseInventory);

					const promiseCustomers = await CustomerSync.synchronizeCustomers(settings.siteId);
					console.log("promiseCustomers ...", promiseCustomers);
					const promiseTopUps = await CreditSync.synchronizeCredits(settings.siteId);
					console.log("promiseTopUps ...", promiseTopUps);
					const promiseCustomerDebts = await CustomerDebtsSync.synchronizeCustomerDebts(settings.siteId);
					console.log("promiseCustomerDebts ...", promiseCustomerDebts);
					const promiseRecieptPaymentTypes = await RecieptPaymentTypesSync.synchronizeRecieptPaymentTypes(settings.siteId);
					console.log("promiseRecieptPaymentTypes ...", promiseRecieptPaymentTypes);
					const promiseOrders = await OrderSync.synchronizeSales(settings.siteId);
					console.log("promiseOrders ...", promiseOrders);

					syncResult.salesChannels = promiseSalesChannels;
					syncResult.customerTypes = promiseCustomerTypes;
					syncResult.paymentTypes = promisePaymentTypes;
					syncResult.discounts = promiseDiscounts;
					syncResult.productMrps = promiseProductMrps;
					syncResult.products = promiseProducts;
					syncResult.meterReading = promiseMeterReading;
					syncResult.wastageReport = promiseInventory;
					syncResult.debt = promiseCustomerDebts;
					syncResult.recieptPayments = promiseRecieptPaymentTypes;
					syncResult.topups = promiseTopUps;
					syncResult.customers = promiseCustomers;
					syncResult.orders = promiseOrders;
					syncResult.customerReminder = promiseReminder;

					console.log("Ending synching end  ...", syncResult);
					return syncResult;
				} catch (error) {
					return error;
				}
			})
			.catch(error => {
				syncResult.error = error;
				syncResult.status = 'failure';
				resolve(syncResult);
			});

	}



	synchronize2() {
		console.log("Start synching ...");
		let syncResult = { status: 'success', error: '' };
		return new Promise(resolve => {
			try {
				console.log("Start synching for real ...");
				this._refreshToken()
					.then(() => {
						console.log("Start synching for real now ...");
						let settings = SettingRealm.getAllSetting();
						const promiseSalesChannels = SalesChannelSync.synchronizeSalesChannels();
						const promiseCustomerTypes = CustomerTypeSync.synchronizeCustomerTypes();
						const promisePaymentTypes = PaymentTypeSync.synchronizePaymentTypes();
						const promiseDiscounts = DiscountSync.synchronizeDiscount(settings.siteId);
						const promiseProductMrps = ProductMRPSync.synchronizeProductMrps(settings.regionId);
						const promiseProducts = ProductSync.synchronizeProducts();
						const promiseMeterReading = MeterReadingSync.synchronizeMeterReading(settings.siteId);

						const promiseReminder = ReminderSync.synchronizeCustomerReminders(settings.siteId);

						const promiseInventory = InventorySync.synchronizeInventory(settings.siteId);


						const promiseCustomers = CustomerSync.synchronizeCustomers(settings.siteId);
						const promiseTopUps = CreditSync.synchronizeCredits(settings.siteId);

						const promiseCustomerDebts = CustomerDebtsSync.synchronizeCustomerDebts(settings.siteId);
						const promiseRecieptPaymentTypes = RecieptPaymentTypesSync.synchronizeRecieptPaymentTypes(settings.siteId);
						const promiseOrders = OrderSync.synchronizeSales(settings.siteId);

						console.log("Start synching end 1 ...");

						Promise.all([
							promiseSalesChannels,
							promiseCustomerTypes,
							promisePaymentTypes,
							promiseDiscounts,
							promiseProductMrps,
							promiseProducts,
							promiseMeterReading,
							promiseInventory,
							promiseCustomerDebts,
							promiseRecieptPaymentTypes,
							promiseTopUps,
							promiseCustomers,
							promiseOrders,
							promiseReminder

						])
							.then(values => {
								console.log("Mayday values " + JSON.stringify(values));
								syncResult.salesChannels = values[0];
								syncResult.customerTypes = values[1];
								syncResult.paymentTypes = values[2];
								syncResult.discounts = values[3];
								syncResult.productMrps = values[4];
								syncResult.products = values[5];
								syncResult.meterReading = values[6];
								syncResult.wastageReport = values[7];
								syncResult.debt = values[8];
								syncResult.recieptPayments = values[9];
								syncResult.topups = values[10];
								syncResult.customers = values[11];
								syncResult.orders = values[12];
								syncResult.customerReminder = values[13];

								resolve(syncResult);
							}).
							catch(error => {
								console.log("Mayday end final error " + JSON.stringify(error));
							});
					})
					.catch(error => {
						syncResult.error = error;
						syncResult.status = 'failure';
						console.log("Mayday error " + JSON.stringify(syncResult));
						resolve(syncResult);
					});
			} catch (error) {
				syncResult.error = error;
				syncResult.status = 'failure';
				resolve(syncResult);
				console.log("Mayday error2 " + JSON.stringify(syncResult));
			}
		});
	}

	_refreshToken() {
		// Check if token exists or has expired
		return new Promise((resolve, reject) => {
			let settings = SettingRealm.getAllSetting();
			let tokenExpirationDate = SettingRealm.getTokenExpiration();
			let currentDateTime = new Date();

			if (
				settings.token.length === 0 ||
				currentDateTime > tokenExpirationDate
			) {
				Communications.login(settings.user, settings.password)
					.then(result => {
						if (result.status === 200) {
							SettingRealm.saveSettings(
								settings.semaUrl,
								settings.site,
								settings.user,
								settings.password,
								settings.uiLanguage,
								result.response.token,
								settings.siteId,
								false,
								settings.currency
							);
							Communications.setToken(result.response.token);
							SettingRealm.setTokenExpiration();
						}
						resolve();
					})
					.catch(result => {
						reject(result.response);
					});
			} else {
				resolve('Token still available');
			}
		});
	}


}
export default new Synchronization();
