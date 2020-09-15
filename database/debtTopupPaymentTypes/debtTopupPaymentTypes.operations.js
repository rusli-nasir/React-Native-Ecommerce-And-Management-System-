import realm from '../init';
import { uuidv1 } from 'uuid';
// const uuidv1 = require('uuid/v1');
import SyncUtils from '../../services/sync/syncUtils';
import { parseISO,  format, sub, compareAsc } from 'date-fns';


class ReceiptPaymentTypeRealm {
    constructor() {
        this.receiptPaymentType = [];
        let firstSyncDate = format(sub(new Date(), { days: 30 }), 'yyyy-MM-dd');
        realm.write(() => {
            if (Object.values(JSON.parse(JSON.stringify(realm.objects('ReceiptPaymentTypeSyncDate')))).length == 0) {
                realm.create('ReceiptPaymentTypeSyncDate', { lastReceiptPaymentTypeSync: firstSyncDate });
            }
        });
        this.lastReceiptPaymentTypeSync = firstSyncDate;
    }

    setLastReceiptPaymentTypeSync() {
        realm.write(() => {
            let syncDate = realm.objects('ReceiptPaymentTypeSyncDate');
            syncDate[0].lastReceiptPaymentTypeSync = new Date()
        })
    }



    truncate() {
        try {
            realm.write(() => {
                let receiptPaymentTypes = realm.objects('ReceiptPaymentType');
                realm.delete(receiptPaymentTypes);
            })
        } catch (e) {
        }
    }

    getLastReceiptPaymentTypeSync() {
        return this.lastReceiptPaymentTypeSync = JSON.parse(JSON.stringify(realm.objects('ReceiptPaymentTypeSyncDate')))['0'].lastReceiptPaymentTypeSync;
    }



    getReceiptPaymentTypes() {
        return Object.values(JSON.parse(JSON.stringify(realm.objects('ReceiptPaymentType'))));
    }


    getReceiptPaymentTypesByDate(date) {
        try {
            let orderObj = Object.values(JSON.parse(JSON.stringify(realm.objects('ReceiptPaymentType'))));
            let orderObj2 = orderObj.map(
                item => {
                    return {
                        ...item,
                        created_at: item.created_at,
                        updated_at: item.updated_at,
                    }
                });

            return orderObj2.filter(r => {
                return compareAsc(parseISO(r.created_at), parseISO(date)) === 1 || compareAsc(parseISO(r.updated_at), parseISO(date)) === 1;
            }
            );
        } catch (e) {
        }
    }

    initialise() {
        return this.getReceiptPaymentTypes();
    }


    createReceiptPaymentType(receiptPaymentType) {
        try {
            realm.write(() => {
                realm.create('ReceiptPaymentType', { ...receiptPaymentType, active: false });
            });
        } catch (e) {
        }
    }

    updateReceiptPaymentType(receiptPaymentType) {
        try {
            realm.write(() => {
                let receiptPaymentTypeObj = realm.objects('ReceiptPaymentType').filtered(`receipt_payment_type_id = "${receiptPaymentType.receipt_payment_type_id}"`);
                receiptPaymentTypeObj[0].id = receiptPaymentType.id;
                receiptPaymentTypeObj[0].name = receiptPaymentType.name;
                receiptPaymentTypeObj[0].active = receiptPaymentType.active;
                receiptPaymentTypeObj[0].description = receiptPaymentType.description;
                receiptPaymentTypeObj[0].syncAction = receiptPaymentType.syncAction;
                receiptPaymentTypeObj[0].created_at = receiptPaymentType.created_at;
                receiptPaymentTypeObj[0].updated_at = receiptPaymentType.updated_at;

            })

        } catch (e) {
        }

    }

    resetSelected() {
        try {
            realm.write(() => {
                let receiptPaymentTypeObj = realm.objects('ReceiptPaymentType');

                receiptPaymentTypeObj.forEach(element => {
                    element.isSelected = false;
                })
            })

        } catch (e) {
        }

    }

    isSelected(receiptPaymentType, isSelected) {
        try {
            realm.write(() => {
                let receiptPaymentTypeObj = realm.objects('ReceiptPaymentType').filtered(`id = "${receiptPaymentType.id}"`);
                receiptPaymentTypeObj[0].isSelected = isSelected;

            })

        } catch (e) {
        }

    }

    synched(receiptPaymentType) {
        try {
            realm.write(() => {
                let receiptPaymentTypeObj = realm.objects('ReceiptPaymentType').filtered(`id = "${receiptPaymentType.id}"`);
                receiptPaymentTypeObj[0].active = true;
                receiptPaymentTypeObj[0].syncAction = null;
            })

        } catch (e) {
        }

    }


    hardDeleteReceiptPaymentType(receiptPaymentType) {
        try {
            realm.write(() => {
                let receiptPaymentTypes = realm.objects('ReceiptPaymentType');
                let deleteReceiptPaymentType = receiptPaymentTypes.filtered(`receipt_payment_type_id = "${receiptPaymentType.receipt_payment_type_id}"`);
                realm.delete(deleteReceiptPaymentType);
            })

        } catch (e) {
        }
    }

    softDeleteReceiptPaymentType(receiptPaymentType) {
        try {
            realm.write(() => {
                realm.write(() => {
                    let receiptPaymentTypeObj = realm.objects('ReceiptPaymentType').filtered(`receipt_payment_type_id = "${receiptPaymentType.receipt_payment_type_id}"`);
                    receiptPaymentTypeObj[0].syncAction = 'delete';
                })
            })

        } catch (e) {
        }
    }

    createManyReceiptPaymentType(receiptPaymentTypes, receiptId) {
        try {
            realm.write(() => {
                if (receiptId) {
                    receiptPaymentTypes.forEach(obj => {
                        realm.create('ReceiptPaymentType', {
                            receipt_id: receiptId ? receiptId : null,
                            payment_type_id: obj.id,
                            receipt_payment_type_id: uuidv1(),
                            amount: Number(obj.amount),
                            active: false,
                            syncAction: obj.syncAction ? obj.syncAction : 'create',
                            created_at: obj.created_at ? obj.created_at : null,
                            updated_at: obj.updated_at ? obj.updated_at : null,
                        });
                    });
                }
                if (!receiptId) {
                    receiptPaymentTypes.forEach(obj => {
                        let syncObj = {
                            active: true,
                            amount: Number(obj.amount),
                            created_at: obj.created_at,
                            id: obj.id,
                            payment_type_id: obj.payment_type_id,
                            receipt_id: obj.receipt_id,
                            receipt_payment_type_id: obj.receipt_payment_type_id,
                            updated_at: obj.updated_at,
                        }
                        realm.create('ReceiptPaymentType', syncObj);
                    });
                }
            });

        } catch (e) {
        }
    }



    syncManyReceiptPaymentType(receiptPaymentTypes) {
        return new Promise((resolve, reject) => {
            try {
                let result = [];
                realm.write(() => {
                    for (i = 0; i < receiptPaymentTypes.length; i++) {
                        let ischeckReceiptPaymentType = this.checkReceiptPaymentType(receiptPaymentTypes[i].created_at, receiptPaymentTypes[i].receipt_payment_type_id).length;
                        if (ischeckReceiptPaymentType === 0) {
                            let value = realm.create('ReceiptPaymentType', {
                                ...receiptPaymentTypes[i],
                                active: true,
                                amount: Number(receiptPaymentTypes[i].amount),
                                created_at: receiptPaymentTypes[i].created_at,
                                id: receiptPaymentTypes[i].id,
                                payment_type_id: receiptPaymentTypes[i].payment_type_id,
                                receipt_id: receiptPaymentTypes[i].receipt_id,
                                receipt_payment_type_id: receiptPaymentTypes[i].receipt_payment_type_id,
                                updated_at: receiptPaymentTypes[i].updated_at,
                            });

                            result.push({ status: 'success', data: value, message: 'ReceiptPaymentType has been set' });
                        } else if (ischeckReceiptPaymentType > 0) {
                            let receiptPaymentTypeUpdate = realm.objects('ReceiptPaymentType').filtered(`receipt_payment_type_id = "${receiptPaymentTypes[i].receipt_payment_type_id}"`);

                            receiptPaymentTypeUpdate[0].amount = Number(receiptPaymentTypes[i].amount);
                            receiptPaymentTypeUpdate[0].created_at = receiptPaymentTypes[i].created_at;
                            receiptPaymentTypeUpdate[0].id = receiptPaymentTypes[i].id;
                            receiptPaymentTypeUpdate[0].payment_type_id = receiptPaymentTypes[i].payment_type_id;
                            receiptPaymentTypeUpdate[0].receipt_id = receiptPaymentTypes[i].receipt_id;
                            receiptPaymentTypeUpdate[0].receipt_payment_type_id = receiptPaymentTypes[i].receipt_payment_type_id;
                            receiptPaymentTypeUpdate[0].updated_at = receiptPaymentTypes[i].updated_at;

                            result.push({ status: 'success', data: receiptPaymentTypes[i], message: 'Local ReceiptPaymentType has been updated' });


                        }
                    }

                });
                resolve(result);
            } catch (e) {
            }
        });
    }


    checkReceiptPaymentType(date, receipt_payment_type_id) {
        return this.getReceiptPaymentTypes().filter(e => SyncUtils.isSimilarDay(e.created_at, date) && e.receipt_payment_type_id === receipt_payment_type_id)
    }

}

export default new ReceiptPaymentTypeRealm();
