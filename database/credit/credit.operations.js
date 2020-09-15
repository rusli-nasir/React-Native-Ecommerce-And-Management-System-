import realm from '../init';
import { uuidv1 } from 'uuid';
// const uuidv1 = require('uuid/v1');
import SyncUtils from '../../services/sync/syncUtils';
import { parseISO, format, sub, compareAsc } from 'date-fns';

class CreditRealm {
    constructor() {
        this.credit = [];
        let firstSyncDate = format(sub(new Date(), { days: 30 }), 'yyyy-MM-dd');
        realm.write(() => {
            if (Object.values(JSON.parse(JSON.stringify(realm.objects('Credit')))).length == 0) {
                realm.create('CreditSyncDate', { lastCreditSync: firstSyncDate });
            }
        });
        //this.lastCreditSync = firstSyncDate;
    }

    getLastCreditSync() {
        return this.lastCreditSync = JSON.parse(JSON.stringify(realm.objects('CreditSyncDate')))['0'].lastCreditSync;
    }

    truncate() {
        try {
            realm.write(() => {
                let credits = realm.objects('Credit');
                realm.delete(realm.objects('CreditSyncDate'));
                realm.delete(credits);
            })
        } catch (e) {
        }
    }

    setLastCreditSync() {
        realm.write(() => {
            let syncDate = realm.objects('CreditSyncDate');
            syncDate[0].lastCreditSync = new Date();
        })
    }

    getAllCredit() {
        return this.credit = Object.values(JSON.parse(JSON.stringify(realm.objects('Credit'))));
    }

    getCreditTransactions() {
        return Object.values(JSON.parse(JSON.stringify(realm.objects('Credit').filtered(`receipt_id = ${null}`))));
    }


    getAllCreditByDate(date) {
        let credit = Object.values(JSON.parse(JSON.stringify(realm.objects('Credit'))));
        return credit.filter(r => {
            return compareAsc(parseISO(r.created_at), parseISO(date)) === 1 || compareAsc(parseISO(r.updated_at), parseISO(date)) === 1;
        }
        );
    }

    initialise() {
        return this.getAllCredit();
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


    createCredit(customer_account_id, topupval, balanceval, receipt_id, notes) {
        const nowDate = new Date();
        let topup = Number(topupval);
        let balance = Number(balanceval);

        const newCredit = {
            top_up_id: uuidv1(),
            customer_account_id,
            topup,
            balance,
            receipt_id,
            notes,
            created_at: nowDate,
            updated_at: nowDate,
            syncAction: 'create',
            synched: false,
            active: true,
        };

        try {
            realm.write(() => {
                realm.create('Credit', newCredit);
            });
        } catch (e) {
        }
    }

    updateCredit(credit) {
        try {
            realm.write(() => {
                let creditObj = realm.objects('Credit').filtered(`top_up_id = "${credit.top_up_id}"`);
                creditObj[0].customer_account_id = credit.customer_account_id;
                creditObj[0].topup = credit.topup;
                creditObj[0].balance = credit.balance;
                creditObj[0].updated_at = credit.updated_at;
                creditObj[0].syncAction = 'update';
            })

        } catch (e) {
        }

    }

    getCreditByRecieptId(receipt_id) {
        let credit = Object.values(JSON.parse(JSON.stringify(realm.objects('Credit').filtered(`receipt_id = "${receipt_id}"`))));
        return credit[0]
    }


    synched(credit) {
        try {
            realm.write(() => {
                let creditObj = realm.objects('Credit').filtered(`top_up_id = "${credit.top_up_id}"`);
                creditObj[0].synched = true;
                creditObj[0].syncAction = null;
            })
        } catch (e) {
        }
    }

    hardDeleteCredit(credit) {
        try {
            realm.write(() => {
                let credits = realm.objects('Credit');
                let deleteCredit = credits.filtered(`top_up_id = "${credit.top_up_id}"`);
                realm.delete(deleteCredit);
            })
        } catch (e) {
        }
    }

    softDeleteCredit(credit) {
        try {
            realm.write(() => {
                let creditObj = realm.objects('Credit').filtered(`top_up_id = "${credit.top_up_id}"`);
                creditObj[0].syncAction = 'delete';
                creditObj[0].active = false;
                creditObj[0].updated_at = new Date();
            })
        } catch (e) {
        }
    }




    createManycredits(credit) {

        return new Promise((resolve, reject) => {
            try {
                let result = [];
                realm.write(() => {
                    for (i = 0; i < credit.length; i++) {
                        let ischeckCredit = this.checkCredit(credit[i].created_at, credit[i].top_up_id).length;
                        if (ischeckCredit === 0) {
                            let value = realm.create('Credit', {
                                ...credit[i],
                                topup: Number(credit[i].topup),
                                balance: Number(credit[i].balance),
                                synched: true
                            });
                            result.push({ status: 'success', data: value, message: 'Credit has been set' });
                        } else if (ischeckCredit > 0) {
                            let discountObj = realm.objects('Credit').filtered(`top_up_id = "${credit[i].top_up_id}"`);

                            discountObj[0].topup = Number(credit[i].topup);
                            discountObj[0].balance = Number(credit[i].balance);
                            discountObj[0].kiosk_id = credit[i].kiosk_id;
                            discountObj[0].customer_account_id = credit[i].customer_account_id;
                            discountObj[0].id = credit[i].id;
                            discountObj[0].top_up_id = credit[i].top_up_id;
                            discountObj[0].updated_at = credit[i].updated_at;
                            result.push({ status: 'success', data: credit[i], message: 'Local Credit has been updated' });


                        }
                    }

                });
                resolve(result);
            } catch (e) {
            }
        });
    }

    checkCredit(date, top_up_id) {
        return this.getAllCredit().filter(e => SyncUtils.isSimilarDay(e.created_at, date) && e.top_up_id === top_up_id)
    }

}

export default new CreditRealm();
