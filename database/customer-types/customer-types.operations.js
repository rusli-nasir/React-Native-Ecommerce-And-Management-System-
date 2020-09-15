import realm from '../init';
import { capitalizeWord } from '../../services/Utilities';
import SyncUtils from '../../services/sync/syncUtils';
import { parseISO, format, sub, compareAsc } from 'date-fns';
class CustomerTypeRealm {
    constructor() {
        this.customerTypes = Object.values(JSON.parse(JSON.stringify(realm.objects('CustomerType'))));
        let firstSyncDate = format(sub(new Date(), { years: 3 }), 'yyyy-MM-dd');
        realm.write(() => {
            if (Object.values(JSON.parse(JSON.stringify(realm.objects('CustomerTypesSyncDate')))).length == 0) {
                realm.create('CustomerTypesSyncDate', { lastCustomerTypesSync: firstSyncDate });
            }
        });
    }

    truncate() {
        try {
            realm.write(() => {
                realm.delete(realm.objects('CustomerType'));
                realm.delete(realm.objects('CustomerTypesSyncDate'));
            })
        } catch (e) {
        }
    }


    getLastCustomerTypesSync() {
        return JSON.parse(JSON.stringify(realm.objects('CustomerTypesSyncDate')))['0'].lastCustomerTypesSync;
    }

    setLastCustomerTypesSync() {
        realm.write(() => {
            let syncDate = realm.objects('CustomerTypesSyncDate');
            syncDate[0].lastCustomerTypesSync = new Date();
        })
    }


    getCustomerTypes() {
        return this.customerTypes = Object.values(JSON.parse(JSON.stringify(realm.objects('CustomerType'))));
    }

    getCustomerTypesById(id) {
        return this.customerTypes = Object.values(JSON.parse(JSON.stringify(realm.objects('CustomerType').filtered(`id = "${id}"`))));
    }


    getCustomerTypesByDate(date) {
        let customerTypes = Object.values(JSON.parse(JSON.stringify(realm.objects('CustomerType'))));
        return customerTypes.filter(r => {
            return compareAsc(parseISO(r.created_at), parseISO(date)) === 1 || compareAsc(parseISO(r.updated_at), parseISO(date)) === 1 || r.active === false;
        })
    }

    getCustomerTypesForDisplay(salesChannelId = 0) {
        let customerTypesForDisplay = [];
        if (salesChannelId != 0) {
            this.customerTypes.forEach(customerType => {
                if (customerType.name !== 'anonymous' && customerType.salesChannelId == salesChannelId) {
                    customerTypesForDisplay.push({
                        id: customerType.id,
                        name: customerType.name,
                        displayName: capitalizeWord(customerType.name),
                        salesChannelId: customerType.salesChannelId
                    });
                }
            });
        }
        else {
            this.customerTypes.forEach(customerType => {
                if (customerType.name !== 'anonymous' && salesChannelId == 0) {
                    customerTypesForDisplay.push({
                        id: customerType.id,
                        name: customerType.name,
                        displayName: capitalizeWord(customerType.name),
                        salesChannelId: customerType.salesChannelId
                    });
                }
            });

        }
        return customerTypesForDisplay;
    }

    getCustomerTypeByName(name) {
        for (let i = 0; i < this.customerTypes.length; i++) {
            if (this.customerTypes[i].name === name) {
                return this.getCustomerTypes()[i];
            }
        }
        return null;
    }


    initialise() {
        return this.getCustomerTypes();
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




    createManyCustomerTypes(customerTypes) {

        return new Promise((resolve, reject) => {
            try {
                let result = [];
                realm.write(() => {
                    for (i = 0; i < customerTypes.length; i++) {
                        let ischeckcustomerTypes = this.checkcustomerTypes(customerTypes[i].created_at, customerTypes[i].id).length;
                        if (ischeckcustomerTypes === 0) {
                            let value = realm.create('CustomerType', {
                                ...customerTypes[i],
                                salesChannelName: customerTypes[i].name,
                                name: customerTypes[i].name,
                                salesChannelId: customerTypes[i].sales_channel_id,
                                description: customerTypes[i].description ===null ? '' : customerTypes[i].description,
                                active: true
                            });
                            result.push({ status: 'success', data: value, message: 'Customer Type has been set' });
                        } else if (ischeckcustomerTypes > 0) {
                            result.push({ status: 'success', data: customerTypes[i], message: 'Local Customer Type has been updated' });
                            let customerTypeObj = realm.objects('CustomerType').filtered(`id = "${customerTypes[i].id}"`);
                            customerTypeObj[0].description = customerTypes[i].description === null ? '' : customerTypes[i].description;
                            customerTypeObj[0].salesChannelName = customerTypes[i].name;
                            customerTypeObj[0].name = customerTypes[i].name;
                            customerTypeObj[0].salesChannelId = customerTypes[i].sales_channel_id;
                            inventoryObj[0].updated_at = new Date(customerTypes[i].updated_at);
                        }
                    }

                });
                resolve(result);
            } catch (e) {
            }
        });
    }

    checkcustomerTypes(date, id) {
        return this.getCustomerTypes().filter(e => SyncUtils.isSimilarDay(e.created_at, date) && e.id === id)
    }

}

export default new CustomerTypeRealm();
