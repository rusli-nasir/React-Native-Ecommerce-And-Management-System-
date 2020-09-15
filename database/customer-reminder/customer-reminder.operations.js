import realm from '../init';
import { uuidv1 } from 'uuid';
// const uuidv1 = require('uuid/v1');
import { parseISO, format, sub, add, isValid, compareAsc } from 'date-fns';
import CustomerRealm from '../customers/customer.operations';
import SyncUtils from '../../services/sync/syncUtils';
class CustomerReminderRealm {
    constructor() {
        this.customerReminder = [];
        let firstSyncDate = format(sub(new Date(), { days: 30 }), 'yyyy-MM-dd');
        realm.write(() => {
            if (Object.values(JSON.parse(JSON.stringify(realm.objects('CustomerReminderSyncDate')))).length == 0) {
                realm.create('CustomerReminderSyncDate', { lastCustomerReminderSync: firstSyncDate });
            }
        });
    }

    truncate() {
        try {
            realm.write(() => {
                let customerReminders = realm.objects('CustomerReminder');
                let customerRemindersSync = realm.objects('CustomerReminderSyncDate');
                realm.delete(customerReminders);
                realm.delete(customerRemindersSync);
            })
        } catch (e) {
        }
    }


    synchedCustomerReminder(customerReminder) {
        try {
            realm.write(() => {
                let customerReminderObj = realm.objects('CustomerReminder').filtered(`reminder_id = "${customerReminder.reminder_id}"`);
                customerReminderObj[0].active = true;
                customerReminderObj[0].syncAction = null;
            })

        } catch (e) {
        }
    }


    setLastCustomerReminderSync() {
        realm.write(() => {
            let syncDate = realm.objects('CustomerReminderSyncDate');
            syncDate[0].lastCustomerReminderSync = new Date();
        })
    }


    deleteCustomerReminder(reminder_id) {
        try {
            realm.write(() => {
                let customerReminderObj = realm.objects('CustomerReminder').filtered(`reminder_id = "${reminder_id}"`);
                realm.delete(customerReminderObj);
            })
        } catch (e) {
        }
    }


    getLastCustomerReminderSync() {
        return JSON.parse(JSON.stringify(realm.objects('CustomerReminderSyncDate')))['0'].lastCustomerReminderSync;
    }


    getAllCustomerReminderByDate(date) {
        let customerReminder = Object.values(JSON.parse(JSON.stringify(realm.objects('CustomerReminder'))));
        return customerReminder.filter(r => {
            return compareAsc(parseISO(r.created_at), parseISO(date)) === 1 || compareAsc(parseISO(r.updated_at), parseISO(date)) === 1 || r.active === false;
        })
    }

    getCustomerReminders() {
        return Object.values(JSON.parse(JSON.stringify(realm.objects('CustomerReminder')))).map(e=>{
            return {...e, customer: CustomerRealm.getCustomerById(e.customer_account_id) }
        });
    }

    initialise() {
        return this.getCustomerReminders();
    }

    formatDay(date) {
        date = new Date(date);
        var day = date.getDate(),
            month = date.getMonth() + 1,
            year = date.getFullYear();
        if (month.toString().length == 1) {
            month = "0" + month;
        }
        if (day.toString().length == 1) {
            day = "0" + day;
        }

        return date = year + '-' + month + '-' + day;
    }


    createCustomerReminder(customerReminder, kiosk_id) {
        try {
            realm.write(() => {
                let customerReminderObj = Object.values(JSON.parse(JSON.stringify(realm.objects('CustomerReminder').filtered(`customer_account_id = "${customerReminder.customer_account_id}"`))));

                if (customerReminderObj.length > 0) {
                    let customerReminderUpdateObj = realm.objects('CustomerReminder').filtered(`customer_account_id = "${customerReminder.customer_account_id}"`);
                    customerReminderUpdateObj[0].frequency = customerReminder.avg;
                    customerReminderUpdateObj[0].kiosk_id = customerReminder.kiosk_id;
                    customerReminderUpdateObj[0].reminder_date = isValid(new Date(customerReminder.reminder)) ? new Date(customerReminder.reminder) : add(new Date(), { days: 10 });
                    customerReminderUpdateObj[0].last_purchase_date = new Date(customerReminder.last_purchase_date);
                    customerReminderUpdateObj[0].syncAction = 'update';
                    customerReminderUpdateObj[0].updated_at = new Date();
                } else {
                    const ObjSave = {
                        reminder_id: uuidv1(),
                        kiosk_id,
                        customer_account_id: customerReminder.customer_account_id,
                        frequency: customerReminder.avg,
                        phone_number: customerReminder.phoneNumber,
                        address: customerReminder.address,
                        name: customerReminder.name,
                        reminder_date: isValid(new Date(customerReminder.reminder)) ? new Date(customerReminder.reminder) : add(new Date(), { days: 10 }),
                        active: false,
                        last_purchase_date: new Date(customerReminder.last_purchase_date),
                        syncAction: 'create',
                        created_at: new Date(),
                    };
                    realm.create('CustomerReminder', ObjSave);
                }
            });
        } catch (e) {
        }
    }

    setCustomReminder(customer_account_id, custom_reminder_date) {
        try {
            realm.write(() => {
                let customerReminderObj = Object.values(JSON.parse(JSON.stringify(realm.objects('CustomerReminder').filtered(`customer_account_id = "${customer_account_id}"`))));
                if (customerReminderObj.length > 0) {
                    let customerReminderUpdateObj = realm.objects('CustomerReminder').filtered(`customer_account_id = "${customer_account_id}"`);
                    customerReminderUpdateObj[0].custom_reminder_date = custom_reminder_date;
                    customerReminderUpdateObj[0].syncAction = 'update';
                    customerReminderUpdateObj[0].updated_at = new Date();
                }
            });
        } catch (e) {
        }
    }

    getCustomerReminderById(customer_account_id) {
        let reminder = Object.values(JSON.parse(JSON.stringify(realm.objects('CustomerReminder').filtered(`customer_account_id = "${customer_account_id}"`))));

        if (reminder.length > 0) {
            reminder = reminder.map(element => {
                return {
                    ...element,
                    last_purchase_date: format(parseISO(element.last_purchase_date), 'iiii d MMM yyyy'),
                    reminder_date: format(parseISO(element.reminder_date), 'iiii d MMM yyyy')
                }
            });
            return reminder[0];
        } else {
            return 'N/A';
        }

    }

    updateCustomerReminder(customerReminder) {
        try {
            realm.write(() => {
                let customerReminderObj = realm.objects('CustomerReminder').filtered(`id = "${customerReminder.customerReminderId}"`);
                customerReminderObj[0].customerReminderId = customerReminder.customerReminderId;
                customerReminderObj[0].name = customerReminder.name;
                customerReminderObj[0].active = customerReminder.active;
                customerReminderObj[0].description = customerReminder.description;
                customerReminderObj[0].syncAction = customerReminder.syncAction;
                customerReminderObj[0].created_at = customerReminder.created_at;
                customerReminderObj[0].updated_at = customerReminder.updated_at;

            })
        } catch (e) {
        }
    }

    resetSelected() {
        try {
            realm.write(() => {
                let customerReminderObj = realm.objects('CustomerReminder');
                customerReminderObj.forEach(element => {
                    element.isSelected = false;
                })
            })
        } catch (e) {
        }
    }

    isSelected(customerReminder, isSelected) {
        try {
            realm.write(() => {
                let customerReminderObj = realm.objects('CustomerReminder').filtered(`id = "${customerReminder.customerReminderId}"`);
                customerReminderObj[0].isSelected = isSelected;

            })
        } catch (e) {
        }

    }

    synched(customerReminder) {
        try {
            realm.write(() => {
                let customerReminderObj = realm.objects('CustomerReminder').filtered(`id = "${customerReminder.customerReminderId}"`);
                customerReminderObj[0].active = true;
                customerReminderObj[0].syncAction = null;
            })
        } catch (e) {
        }
    }


    // Hard delete when active property is false or when active property and syncAction is delete
    hardDeleteCustomerReminder(customerReminder) {
        try {
            realm.write(() => {
                let customerReminders = realm.objects('CustomerReminder');
                let deleteCustomerReminder = customerReminders.filtered(`id = "${customerReminder.customerReminderId}"`);
                realm.delete(deleteCustomerReminder);
            })

        } catch (e) {
        }
    }

    softDeleteCustomerReminder(customerReminder) {
        try {
            realm.write(() => {
                realm.write(() => {
                    let customerReminderObj = realm.objects('CustomerReminder').filtered(`id = "${customerReminder.customerReminderId}"`);
                    customerReminderObj[0].syncAction = 'delete';
                })
            })
        } catch (e) {
        }
    }

    createManyCustomerReminder3(customerReminders, customer_account_id) {
        try {
            realm.write(() => {
                if (customer_account_id) {
                    customerReminders.forEach(obj => {
                        realm.create('CustomerReminder', {
                            customer_account_id: customer_account_id ? customer_account_id : null,
                            customerReminderId: uuidv1(),
                            due_amount: obj.amount,
                            syncAction: obj.syncAction ? obj.syncAction : 'CREATE',
                            created_at: format(new Date(), 'yyyy-MM-dd'),
                            updated_at: obj.updated_at ? obj.updated_at : null,
                        });
                    });
                }
                if (!customer_account_id) {
                    customerReminders.forEach(obj => {
                        realm.create('CustomerReminder', obj);
                    });
                }
            });
        } catch (e) {
        }
    }

    createManyCustomerReminder(customerReminders) {
        return new Promise((resolve, reject) => {
            try {
                let result = [];
                realm.write(() => {
                    for (i = 0; i < customerReminders.length; i++) {
                        if (this.checkCustomerReminderDate(customerReminders[i].created_at).length === 0) {
                            let value = realm.create('CustomerReminder', { ...customerReminders[i], active: true });
                            result.push({ status: 'success', data: value, message: 'Customer Reminder has been set' });
                        } else if (this.checkCustomerReminderDate(customerReminders[i].created_at).length > 0) {
                            result.push({ status: 'fail', data: customerReminders[i], message: 'Local Customer Reminder has already been set' });
                        }
                    }
                });
                resolve(result);
            } catch (e) {
            }
        });
    }

    checkCustomerReminderDate(date) {
        return this.getCustomerReminders().filter(e => SyncUtils.isSimilarDay(e.created_at, date))
    }


}

export default new CustomerReminderRealm();
