import realm from '../init';
import {uuidv1} from 'uuid';
// const uuidv1 = require('uuid/v1');
import SyncUtils from '../../services/sync/syncUtils';
import {parseISO, format, compareAsc} from 'date-fns';
import {CustomerTypeRealm} from '../customer-types/customer-types.operations';

class CustomerRealm {
  constructor() {
    this.customer = [];
    let firstSyncDate = format(new Date('2017-01-01'), 'yyyy-MM-dd');
    realm.write(() => {
      console.log('checking');
      if (
        Object.values(
          JSON.parse(JSON.stringify(realm.objects('CustomerSyncDate'))),
        ).length == 0
      ) {
        console.log('not sset');
        realm.create('CustomerSyncDate', {lastCustomerSync: firstSyncDate});
      }
    });
    this.lastCustomerSync = firstSyncDate;
  }

  getLastCustomerSync() {
    //console.log('realm.objects', realm.objects('CustomerSyncDate'));
    return (this.lastCustomerSync = JSON.parse(
      JSON.stringify(realm.objects('CustomerSyncDate')),
    )['0'].lastCustomerSync);
  }

  truncate() {
    try {
      realm.write(() => {
        let customers = realm.objects('Customer');
        realm.delete(realm.objects('CustomerSyncDate'));
        realm.delete(customers);
      });
    } catch (e) {}
  }

  setLastCustomerSync() {
    realm.write(() => {
      let syncDate = realm.objects('CustomerSyncDate');
      syncDate[0].lastCustomerSync = new Date();
    });
  }

  getAllCustomer() {
    let customers = Object.values(
      JSON.parse(JSON.stringify(realm.objects('Customer'))),
    );
    customers = customers.map((e) => {
      return {
        ...e,
        customerType: Object.values(
          JSON.parse(
            JSON.stringify(
              realm
                .objects('CustomerType')
                .filtered(`id = "${e.customerTypeId}"`),
            ),
          ),
        )[0].name,
      };
    });
    return customers.filter((r) => {
      return r.is_delete === null || r.is_delete === 1;
    });
  }

  selectedCustomer(customerId) {
    realm.write(() => {
      let customers = realm
        .objects('Customer')
        .filtered(`customerId = "${customerId}"`);
      customers[0].isSelected = true;
    });
  }

  getSelectedCustomer(customerId) {
    return Object.values(
      JSON.parse(
        realm.objects('Customer').filtered(`customerId = "${customerId}"`),
      ),
    );
  }

  getCustomerById(customerId) {
    let customers = Object.values(
      JSON.parse(
        JSON.stringify(
          realm.objects('Customer').filtered(`customerId = "${customerId}"`),
        ),
      ),
    );
    return customers[0];
  }

  getCustomerBycreated_at(date) {
    try {
      let orderObj = Object.values(
        JSON.parse(JSON.stringify(realm.objects('Customer'))),
      );
      return orderObj.filter((r) => {
        return (
          compareAsc(parseISO(r.created_at), parseISO(date)) === 1 ||
          compareAsc(parseISO(r.updated_at), parseISO(date)) === 1
        );
      });
    } catch (e) {}
  }

  initialise() {
    return this.getAllCustomer();
  }

  formatDay(date) {
    date = new Date(date);
    var day = date.getDate(),
      month = date.getMonth() + 1,
      year = date.getFullYear();
    if (month.toString().length == 1) {
      month = '0' + month;
    }
    if (day.toString().length == 1) {
      day = '0' + day;
    }

    return (date = year + '-' + month + '-' + day);
  }

  createCustomer(
    phone,
    name,
    address,
    siteId,
    salesChannelId,
    customerTypeId,
    frequency,
    secondPhoneNumber,
  ) {
    try {
      const now = new Date();

      const newCustomer = {
        customerId: uuidv1(),
        name: name,
        phoneNumber: phone,
        address: address,
        siteId: siteId,
        dueAmount: 0,
        salesChannelId: salesChannelId,
        customerTypeId: customerTypeId,
        created_at: now,
        updated_at: now,
        secondPhoneNumber: secondPhoneNumber,
        syncAction: 'create',
        active: false,
      };
      realm.write(() => {
        realm.create('Customer', newCustomer);
      });
    } catch (e) {
      console.log('error', e);
    }
  }

  updateCustomer(
    customer,
    phone,
    name,
    address,
    salesChannelId,
    customerTypeId,
    frequency,
    secondPhoneNumber,
  ) {
    return new Promise((resolve, reject) => {
      try {
        realm.write(() => {
          let customerObj = realm
            .objects('Customer')
            .filtered(`customerId = "${customer.customerId}"`);

          customerObj[0].name = name;
          customerObj[0].phoneNumber = phone;
          customerObj[0].address = address;
          customerObj[0].salesChannelId = salesChannelId;
          customerObj[0].customerTypeId = customerTypeId;
          customerObj[0].updated_at = new Date();
          customerObj[0].syncAction = 'update';
          // customerObj[0].frequency = frequency.toString();
          customerObj[0].secondPhoneNumber = secondPhoneNumber;
          customerObj[0].dueAmount = customer.dueAmount;
          customerObj[0].walletBalance = customer.walletBalance;

          if (customer.reminder_date) {
            customerObj[0].reminder_date = format(
              parseISO(customer.reminder_date),
              'yyyy-MM-dd',
            );
          }

          resolve(true);
        });
      } catch (e) {}
    });
  }

  updateCustomerDueAmount(customer, dueAmount) {
    try {
      realm.write(() => {
        let customerObj = realm
          .objects('Customer')
          .filtered(`customerId = "${customer.customerId}"`);
        customerObj[0].updated_at = new Date();
        customerObj[0].syncAction = 'update';
        customerObj[0].dueAmount = dueAmount;
      });
    } catch (e) {}
  }

  updateCustomerWalletBalance(customer, walletBalance) {
    try {
      realm.write(() => {
        let customerObj = realm
          .objects('Customer')
          .filtered(`customerId = "${customer.customerId}"`);
        customerObj[0].updated_at = new Date();
        customerObj[0].syncAction = 'update';
        customerObj[0].walletBalance = walletBalance;
      });
    } catch (e) {}
  }

  synched(customer) {
    try {
      realm.write(() => {
        let customerObj = realm
          .objects('Customer')
          .filtered(`customerId = "${customer.customerId}"`);
        customerObj[0].active = true;
        customerObj[0].syncAction = null;
      });
    } catch (e) {}
  }

  // Hard delete when active property is false or when active property and syncAction is delete

  hardDeleteCustomer(customer) {
    try {
      realm.write(() => {
        let customers = realm.objects('Customer');
        let deleteCustomer = customers.filtered(
          `customerId = "${customer.customerId}"`,
        );
        realm.delete(deleteCustomer);
      });
    } catch (e) {}
  }

  softDeleteCustomer(customer) {
    try {
      realm.write(() => {
        let customerObj = realm
          .objects('Customer')
          .filtered(`customerId = "${customer.customerId}"`);
        customerObj[0].syncAction = 'delete';
        customerObj[0].is_delete = 0;
        customerObj[0].updated_at = new Date();
      });
    } catch (e) {}
  }

  createManyCustomers(customers) {
    return new Promise((resolve, reject) => {
      try {
        let result = [];
        realm.write(() => {
          for (i = 0; i < customers.length; i++) {
            let ischeckCustomer = this.checkCustomer(
              customers[i].created_at,
              customers[i].customerId,
            ).length;
            if (ischeckCustomer === 0) {
              let value = realm.create('Customer', {
                ...customers[i],
                customerId: customers[i].id,
                name: customers[i].name,
                isSelected: false,
                customerTypeId: customers[i].customer_type_id,
                salesChannelId: customers[i].sales_channel_id,
                siteId: customers[i].kiosk_id,
                is_delete:
                  customers[i].is_delete === null ? 1 : customers[i].is_delete,
                reminder_date: customers[i].reminder_date,
                frequency: customers[i].frequency,
                dueAmount:
                  customers[i].due_amount === null
                    ? 0
                    : Number(customers[i].due_amount),
                walletBalance:
                  customers[i].wallet_balance === null
                    ? 0
                    : Number(customers[i].wallet_balance),
                address: customers[i].address_line1,
                gpsCoordinates: customers[i].gps_coordinates,
                phoneNumber: customers[i].phone_number,
                secondPhoneNumber: customers[i].second_phone_number,
                active: true,
                created_at: customers[i].created_at,
                updated_at: customers[i].updated_at,
              });
              result.push({
                status: 'success',
                data: value,
                message: 'Customer has been set',
              });
            } else if (ischeckCustomer > 0) {
              let customerObj = realm
                .objects('Customer')
                .filtered(`customerId = "${customers[i].id}"`);

              customerObj[0].customerId = customers[i].id;
              customerObj[0].name = customers[i].name;
              customerObj[0].customerTypeId = customers[i].customer_type_id;
              customerObj[0].salesChannelId = customers[i].sales_channel_id;
              customerObj[0].siteId = customers[i].kiosk_id;
              customerObj[0].is_delete =
                customers[i].is_delete === null ? 1 : customers[i].is_delete;
              customerObj[0].reminder_date = customers[i].reminder_date;
              customerObj[0].frequency = customers[i].frequency;
              customerObj[0].dueAmount =
                customers[i].due_amount === null
                  ? 0
                  : Number(customers[i].due_amount);
              customerObj[0].walletBalance =
                customers[i].wallet_balance === null
                  ? 0
                  : Number(customers[i].wallet_balance);
              customerObj[0].address = customers[i].address_line1;
              customerObj[0].gpsCoordinates = customers[i].gps_coordinates;
              customerObj[0].phoneNumber = customers[i].phone_number;
              customerObj[0].secondPhoneNumber =
                customers[i].second_phone_number;
              customerObj[0].active = true;
              customerObj[0].created_at = customers[i].created_at;
              customerObj[0].updated_at = customers[i].updated_at;

              result.push({
                status: 'success',
                data: customers[i],
                message: 'Local Customer has been updated',
              });
            }
          }
        });
        resolve(result);
      } catch (e) {}
    });
  }

  checkCustomer(date, customerId) {
    return this.getAllCustomer().filter(
      (e) =>
        SyncUtils.isSimilarDay(e.created_at, date) &&
        e.customerId === customerId,
    );
  }

  findCustomerById(id) {
    return realm.objects('Customer').filtered(`customerId = "${id}"`);
  }
}

export default new CustomerRealm();
