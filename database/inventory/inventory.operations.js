import realm from '../init';
import { uuidv1 } from 'uuid';
// const uuidv1 = require('uuid/v1');
import SyncUtils from '../../services/sync/syncUtils';

import { parseISO,  format, sub, set,  getSeconds, getMinutes, getHours, compareAsc, compareDesc } from 'date-fns';
class InventroyRealm {
    constructor() {
        this.inventory = [];
        let firstSyncDate = format(sub(new Date(), { days: 30 }), 'yyyy-MM-dd');
        realm.write(() => {
            if (Object.values(JSON.parse(JSON.stringify(realm.objects('InventorySyncDate')))).length == 0) {
                realm.create('InventorySyncDate', { lastInventorySync: firstSyncDate });
            }
        });

        realm.write(() => {
            if (Object.values(JSON.parse(JSON.stringify(realm.objects('MeterReadingSyncDate')))).length == 0) {
                realm.create('MeterReadingSyncDate', { lastMeterReadingSync: firstSyncDate });
            }
        });
        this.lastInventorySync = firstSyncDate;
    }

    getLastInventorySync() {
        return this.lastInventorySync = JSON.parse(JSON.stringify(realm.objects('InventorySyncDate')))['0'].lastInventorySync;
    }

    getLastMeterReadingSync() {
        return JSON.parse(JSON.stringify(realm.objects('MeterReadingSyncDate')))['0'].lastMeterReadingSync;
    }

    truncate() {
        try {
            realm.write(() => {
                let inventories = realm.objects('Inventory');
                let meterReading = realm.objects('MeterReading');
                let meterSync = realm.objects('MeterReadingSyncDate');
                let invSync = realm.objects('InventorySyncDate');
                realm.delete(meterReading);
                realm.delete(meterSync);
                realm.delete(inventories);
                realm.delete(invSync);
            })
        } catch (e) {
        }
    }

    setLastInventorySync() {
        realm.write(() => {
            let syncDate = realm.objects('InventorySyncDate');
            syncDate[0].lastInventorySync = new Date();
        })
    }

    setLastMeterReadingSync() {
        realm.write(() => {
            let syncDate = realm.objects('MeterReadingSyncDate');
            syncDate[0].lastMeterReadingSync = new Date();
        })
    }

    getAllInventory() {
        return this.inventory = Object.values(JSON.parse(JSON.stringify(realm.objects('Inventory'))));
    }

    getAllInventoryByDate(date) {
        let inventory = this.inventory = Object.values(JSON.parse(JSON.stringify(realm.objects('Inventory'))));
        return inventory.filter(r => {
            return compareAsc(parseISO(r.created_at), parseISO(date)) === 1 || compareAsc(parseISO(r.updated_at), parseISO(date)) === 1 || r.active === false;
        })
    }

    getAllMeterReading() {
        return Object.values(JSON.parse(JSON.stringify(realm.objects('MeterReading'))));
    }

    getMeterReadingLessDate(date) {
        let meterReding = Object.values(JSON.parse(JSON.stringify(realm.objects('MeterReading'))));
        let filtered = meterReding.filter(r => {
           return compareAsc(parseISO(r.created_at), parseISO(SyncUtils.convertDate(date))) === -1;
        })
        let datesArrays = filtered.map(e => {
            return parseISO(e.created_at)
		}).sort(compareDesc)

        let checkExistingMeter = Object.values(JSON.parse(JSON.stringify(realm.objects('MeterReading'))));
        const filteredReading = checkExistingMeter.filter(element => SyncUtils.isSimilarDay(element.created_at, datesArrays[0]));

        return filteredReading;
    }

    getAllMeterReadingByDate(date) {
        let meterReding = Object.values(JSON.parse(JSON.stringify(realm.objects('MeterReading'))));
        return meterReding.filter(r => {
            return compareAsc(parseISO(r.created_at), parseISO(date)) === 1 || compareAsc(parseISO(r.updated_at), parseISO(date)) === 1 || r.active === false;
        })
    }

    initialise() {
        return this.getAllInventory();
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

    addDays = (theDate, days) => {
        return new Date(theDate.getTime() + days * 24 * 60 * 60 * 1000);
    };

    getWastageReportByDate(date) {
        return new Promise(resolve => {
            try {
                if (!date) {
                    resolve({
                        currentMeter: 0,
                        currentProductSkus: []
                    });
                }
                let checkExistingMeter = Object.values(JSON.parse(JSON.stringify(realm.objects('MeterReading'))));
                const filteredReading = checkExistingMeter.filter(element => SyncUtils.isSimilarDay(element.created_at, date));
                let checkExistingWastage = Object.values(JSON.parse(JSON.stringify(realm.objects('Inventory'))));
                const filteredWastage = checkExistingWastage.filter(element => SyncUtils.isSimilarDay(element.created_at, date));
                if (filteredReading.length > 0 || filteredWastage.length > 0) {
                    resolve({
                        currentMeter: filteredReading.length > 0 ? filteredReading[0].meter_value : 0,
                        currentProductSkus: filteredWastage.length > 0 ? filteredWastage : []
                    })
                } else {
                    resolve({
                        currentMeter: 0,
                        currentProductSkus: []
                    });
                }
            } catch (e) {
            }
        })
    }

    createMeterReading(meter_value, date, kiosk_id) {
        let current_date = set(new Date(date), {
            hours: getHours(new Date()),
            minutes: getMinutes(new Date()),
            seconds: getSeconds(new Date())
        });
        let update_date = new Date();
        try {
            realm.write(() => {
                let checkExistingMeter = Object.values(JSON.parse(JSON.stringify(realm.objects('MeterReading'))));
                const filteredReading = checkExistingMeter.filter(element => SyncUtils.isSimilarDay(element.created_at, date)
                );
                if (filteredReading.length > 0) {
                    let meterUpdateObj = realm.objects('MeterReading').filtered(`meter_reading_id = "${filteredReading[0].meter_reading_id}"`);
                    meterUpdateObj[0].meter_value = meter_value;
                    meterUpdateObj[0].syncAction = 'update';
                    meterUpdateObj[0].updated_at = update_date;
                } else {
                    realm.create('MeterReading', {
                        meter_reading_id: uuidv1(),
                        kiosk_id,
                        created_at: current_date,
                        meter_value: meter_value ? meter_value : 0,
                        syncAction: 'create',
                        active: false
                    });
                }
            });
        } catch (e) {
        }
    }

    deleteByMeterId(meter_reading_id) {
        try {
            realm.write(() => {
                let meterUpdateObj = realm.objects('MeterReading').filtered(`meter_reading_id = "${meter_reading_id}"`);

                realm.delete(meterUpdateObj);
            })
        } catch (e) {
        }
    }

    deleteByClosingStockId(closingStockId) {
        try {
            realm.write(() => {
                let inventoryUpdateObj = realm.objects('Inventory').filtered(`closingStockId = "${closingStockId}"`);

                realm.delete(inventoryUpdateObj);
            })
        } catch (e) {
        }
    }

    createInventory(inventory, date) {
        let current_date = set(new Date(date), {
            hours: getHours(new Date()),
            minutes: getMinutes(new Date()),
            seconds: getSeconds(new Date())
        });
        let update_date = new Date();


        try {
            realm.write(() => {
                let checkExistingInventory = Object.values(JSON.parse(JSON.stringify(realm.objects('Inventory').filtered(`closingStockId = "${inventory.closingStockId}"`))));

                if (checkExistingInventory.length > 0) {
                    let inventorUpdateObj = realm.objects('Inventory').filtered(`closingStockId = "${inventory.closingStockId}"`);
                    inventorUpdateObj[0].product_id = inventory.product_id;
                    if (inventory.type === 'closing') {
                        inventorUpdateObj[0].quantity = inventory.quantity ? inventory.quantity : 0;
                        inventorUpdateObj[0].inventory = inventory.inventory ? inventory.inventory : 0;
                    } else if (inventory.type === 'notdispatched') {
                        inventorUpdateObj[0].notDispatched = inventory.notDispatched ? inventory.notDispatched : 0;

                    } inventorUpdateObj[0].kiosk_id = inventory.kiosk_id;
                    inventorUpdateObj[0].wastageName = inventory.wastageName;
                    inventorUpdateObj[0].syncAction = 'update';
                    inventorUpdateObj[0].updated_at = update_date;
                } else {
                    let saveObj = {};
                    if (inventory.type === 'closing') {
                        saveObj = {
                            ...inventory,
                            closingStockId: uuidv1(),
                            created_at: current_date,
                            inventory: inventory.inventory ? inventory.inventory : 0,
                            quantity: inventory.quantity ? inventory.quantity : 0,
                            syncAction: 'create',
                            active: false
                        }
                    } else if (inventory.type === 'notdispatched') {
                        saveObj = {
                            ...inventory,
                            closingStockId: uuidv1(),
                            created_at: date,
                            notDispatched: inventory.notDispatched ? inventory.notDispatched : 0,
                            syncAction: 'create',
                            active: false
                        }
                    }


                    realm.create('Inventory', saveObj);
                }
            });
        } catch (e) {
        }
    }

    updateInventory(inventory) {
        try {
            realm.write(() => {
                let inventoryObj = realm.objects('Inventory').filtered(`closingStockId = "${inventory.closingStockId}"`);
                inventoryObj[0].product_id = inventory.product_id;
                inventoryObj[0].notDispatched = inventory.notDispatched ? inventory.notDispatched : 0,
                    inventoryObj[0].quantity = inventory.quantity ? inventory.quantity : 0,
                    inventoryObj[0].kiosk_id = inventory.kiosk_id,
                    inventoryObj[0].created_at = new Date(inventory.created_at);
                inventoryObj[0].inventory = inventory.inventory ? inventory.inventory : 0;
                inventoryObj[0].wastageName = inventory.wastageName;
                inventoryObj[0].syncAction = 'update';
                inventoryObj[0].updated_at = new Date();
            })

        } catch (e) {
        }

    }

    synched(inventory) {
        try {
            realm.write(() => {
                let inventoryObj = realm.objects('Inventory').filtered(`closingStockId = "${inventory.closingStockId}"`);
                inventoryObj[0].active = true;
                inventoryObj[0].syncAction = null;
            })

        } catch (e) {
        }

    }

    synchedMeterReading(meterReading) {
        try {
            realm.write(() => {
                let meterReadingObj = realm.objects('MeterReading').filtered(`meter_reading_id = "${meterReading.meter_reading_id}"`);
                meterReadingObj[0].active = true;
                meterReadingObj[0].syncAction = null;
            })

        } catch (e) {
        }

    }

    // Hard delete when active property is false or when active property and syncAction is delete
    hardDeleteInventory(inventory) {
        try {
            realm.write(() => {
                let inventories = realm.objects('Inventory');
                let deleteInventory = inventories.filtered(`closingStockId = "${inventory.closingStockId}"`);
                realm.delete(deleteInventory);
            })
        } catch (e) {
        }
    }

    softDeleteInventory(inventory) {
        try {
            realm.write(() => {
                realm.write(() => {
                    let inventoryObj = realm.objects('Inventory').filtered(`closingStockId = "${inventory.closingStockId}"`);
                    inventoryObj[0].syncAction = 'delete';
                })
            })
        } catch (e) {
        }
    }

    createManyInventories(inventories) {
        return new Promise((resolve, reject) => {
            try {
                let result = [];
                realm.write(() => {
                    for (i = 0; i < inventories.length; i++) {
                        let isCheckInvnetoryDate = this.checkInvnetoryDate(inventories[i].created_at, inventories[i].product_id).length;
                        if (isCheckInvnetoryDate === 0) {
                            let value = realm.create('Inventory', { ...inventories[i], wastageName: inventories[i].product_id, inventory: inventories[i].quantity, active: true });
                            result.push({ status: 'success', data: value, message: 'Closing Stock has been set' });
                        } else if (isCheckInvnetoryDate > 0) {
                            result.push({ status: 'fail', data: inventories[i], message: 'Local Closing Stock has already been set' });
                        }
                    }
                });
                resolve(result);

            } catch (e) {
            }
        });
    }

    checkInvnetoryDate(date, product_id) {
        return this.getAllInventory().filter(e => SyncUtils.isSimilarDay(e.created_at, date) && e.product_id === product_id)
    }

    createManyMeterReading(meterReadings) {
        return new Promise((resolve, reject) => {
            try {
                let result = [];
                realm.write(() => {
                    for (i = 0; i < meterReadings.length; i++) {
                        if (this.checkMeterReadingDate(meterReadings[i].created_at).length === 0) {
                            let value = realm.create('MeterReading', { ...meterReadings[i], active: true });
                            result.push({ status: 'success', data: value, message: 'Meter Reading has been set' });
                        } else if (this.checkMeterReadingDate(meterReadings[i].created_at).length > 0) {
                            result.push({ status: 'fail', data: meterReadings[i], message: 'Local Meter Reading has already been set' });
                        }
                    }
                });
                resolve(result);
            } catch (e) {
            }
        });
    }

    checkMeterReadingDate(date) {
        return this.getAllMeterReading().filter(e => SyncUtils.isSimilarDay(e.created_at, date))
    }

}

export default new InventroyRealm();
