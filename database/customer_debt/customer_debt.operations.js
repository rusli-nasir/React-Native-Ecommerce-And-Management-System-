import realm from '../init';
import { uuidv1 } from 'uuid';
// const uuidv1 = require('uuid/v1');
import SyncUtils from '../../services/sync/syncUtils';
import { parseISO,  format, sub,  compareAsc } from 'date-fns';

class CustomerDebtRealm {

    constructor() {
        this.customerDebt = [];
        let firstSyncDate = format(sub(new Date(), { days: 30 }), 'yyyy-MM-dd');
        realm.write(() => {
            if (Object.values(JSON.parse(JSON.stringify(realm.objects('CustomerDebtSyncDate')))).length == 0) {
                realm.create('CustomerDebtSyncDate', { lastCustomerDebtSync: firstSyncDate });
            }
        });
        this.lastCustomerDebtSync = firstSyncDate;
    }

    getLastCustomerDebtSync() {
        return JSON.parse(JSON.stringify(realm.objects('CustomerDebtSyncDate')))['0'].lastCustomerDebtSync;
    }

    setLastCustomerDebtSync() {
        realm.write(() => {
            let syncDate = realm.objects('CustomerDebtSyncDate');
            syncDate[0].lastCustomerDebtSync = new Date();
        })
    }

    truncate() {
        try {
            realm.write(() => {
                let customerDebts = realm.objects('CustomerDebt');
                realm.delete(customerDebts);
            })
        } catch (e) {
        }
    }

    getCustomerDebts() {
        return Object.values(JSON.parse(JSON.stringify(realm.objects('CustomerDebt'))));
    }


    getCustomerDebtsTransactions() {
        return Object.values(JSON.parse(JSON.stringify(realm.objects('CustomerDebt').filtered(`receipt_id = ${null}`))));
    }


    getCustomerDebtsByDate(date) {
        let customerDebt = Object.values(JSON.parse(JSON.stringify(realm.objects('CustomerDebt'))));
        return customerDebt.filter(r => {
            return compareAsc(parseISO(r.created_at), parseISO(date)) === 1 || compareAsc(parseISO(r.updated_at), parseISO(date)) === 1;
        }
        );
    }

    initialise() {
        return this.getCustomerDebts();
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


    updateCustomerDebt(customerDebt) {
        try {
            realm.write(() => {
                let customerDebtObj = realm.objects('CustomerDebt').filtered(`id = "${customerDebt.customer_debt_id}"`);
                customerDebtObj[0].customer_debt_id = customerDebt.customer_debt_id;
                customerDebtObj[0].name = customerDebt.name;
                customerDebtObj[0].synched = customerDebt.synched;
                customerDebtObj[0].description = customerDebt.description;
                customerDebtObj[0].syncAction = customerDebt.syncAction;
                customerDebtObj[0].created_at = customerDebt.created_at;
                customerDebtObj[0].updated_at = new Date();

            })
        } catch (e) {
        }
    }

    resetSelected() {
        try {
            realm.write(() => {
                let customerDebtObj = realm.objects('CustomerDebt');
                customerDebtObj.forEach(element => {
                    element.isSelected = false;
                })
            })
        } catch (e) {
        }
    }

    isSelected(customerDebt, isSelected) {
        try {
            realm.write(() => {
                let customerDebtObj = realm.objects('CustomerDebt').filtered(`customer_debt_id = "${customerDebt.customer_debt_id}"`);
                customerDebtObj[0].isSelected = isSelected;

            })
        } catch (e) {
        }

    }

    synched(customerDebt) {
        try {
            realm.write(() => {
                let customerDebtObj = realm.objects('CustomerDebt').filtered(`customer_debt_id = "${customerDebt.customer_debt_id}"`);
                customerDebtObj[0].synched = true;
                customerDebtObj[0].syncAction = null;
            })
        } catch (e) {
        }
    }


    // Hard delete when synched property is false or when synched property and syncAction is delete
    hardDeleteCustomerDebt(customerDebt) {
        try {
            realm.write(() => {
                let customerDebts = realm.objects('CustomerDebt');
                let deleteCustomerDebt = customerDebts.filtered(`customer_debt_id = "${customerDebt.customer_debt_id}"`);
                realm.delete(deleteCustomerDebt);
            })

        } catch (e) {
        }
    }

    getCustomerDebtByRecieptId(receipt_id) {
        let customerDebt = Object.values(JSON.parse(JSON.stringify(realm.objects('CustomerDebt').filtered(`receipt_id = "${receipt_id}"`))));
        return customerDebt[0]
    }

    softDeleteCustomerDebt(customerDebt) {
        try {
            realm.write(() => {
                    let customerDebtObj = realm.objects('CustomerDebt').filtered(`customer_debt_id = "${customerDebt.customer_debt_id}"`);
                    customerDebtObj[0].syncAction = 'delete';
                    customerDebtObj[0].active = false;
                    customerDebtObj[0].updated_at = new Date();
                })

        } catch (e) {
        }
    }

    createManyCustomerDebt(customerDebts, customer_account_id) {
        try {
            realm.write(() => {
                if (customer_account_id) {
                    customerDebts.forEach(obj => {
                        realm.create('CustomerDebt', {
                            customer_account_id: customer_account_id ? customer_account_id : null,
                            customer_debt_id: uuidv1(),
                            due_amount: obj.due_amount ? Number(obj.due_amount) : Number(obj.amount),
                            balance: Number(obj.balance),
                            synched: false,
                            syncAction: obj.syncAction ? obj.syncAction : 'create',
                            created_at: new Date(),
                        });
                    });
                }
                if (!customer_account_id) {
                    customerDebts.forEach(obj => {
                        realm.create('CustomerDebt', { ...obj, due_amount: obj.due_amount ? Number(obj.due_amount) : Number(obj.amount), });
                    });
                }
            });
        } catch (e) {
        }
    }



    syncManyCustomerDebt(customerDebts) {
        return new Promise((resolve, reject) => {
            try {
                let result = [];
                realm.write(() => {
                    for (i = 0; i < customerDebts.length; i++) {
                        let ischeckCustomerDebt = this.checkCustomerDebt(customerDebts[i].created_at, customerDebts[i].customer_debt_id).length;
                        if (ischeckCustomerDebt === 0) {
                            let value = realm.create('CustomerDebt', {
                                ...customerDebts[i],
                                synched: true,
                                due_amount: customerDebts[i].due_amount ? Number(customerDebts[i].due_amount) : Number(customerDebts[i].amount),
                                balance: Number(customerDebts[i].balance)
                            });

                            result.push({ status: 'success', data: value, message: 'Customer Debt has been set' });
                        } else if (ischeckCustomerDebt > 0) {
                            let customerDebtUpdate = realm.objects('CustomerDebt').filtered(`customer_debt_id = "${customerDebts[i].customer_debt_id}"`);

                            customerDebtUpdate[0].customer_account_id = customerDebts[i].customer_account_id;
                            customerDebtUpdate[0].due_amount = customerDebts[i].due_amount ? Number(customerDebts[i].due_amount) : Number(customerDebts[i].amount);
                            customerDebtUpdate[0].updated_at = customerDebts[i].updated_at;
                            customerDebtUpdate[0].balance = Number(customerDebts[i].balance);


                            result.push({ status: 'success', data: customerDebts[i], message: 'Local Customer Debt has been updated' });


                        }
                    }

                });
                resolve(result);
            } catch (e) {
            }
        });
    }

    checkCustomerDebt(date, customer_debt_id) {
        return this.getCustomerDebts().filter(e => SyncUtils.isSimilarDay(e.created_at, date) && e.customer_debt_id === customer_debt_id)
    }

    createCustomerDebt(due_amount, customer_account_id, balance, receipt_id, notes) {
        try {
            realm.write(() => {
                realm.create('CustomerDebt', {
                    customer_account_id,
                    customer_debt_id: uuidv1(),
                    balance,
                    due_amount: Number(due_amount),
                    notes,
                    receipt_id,
                    synched: false,
                    active: true,
                    syncAction: 'create',
                    created_at: new Date(),
                });
            });
        } catch (e) {
        }
    }

}

export default new CustomerDebtRealm();
