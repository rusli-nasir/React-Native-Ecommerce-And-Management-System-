import realm from '../init';
import { capitalizeWord } from '../../services/Utilities';
import SyncUtils from '../../services/sync/syncUtils';
import { parseISO,  format, sub, compareAsc } from 'date-fns';
class SalesChannelRealm {
    constructor() {
        this.salesChannels = Object.values(JSON.parse(JSON.stringify(realm.objects('SalesChannel'))));
        let firstSyncDate = format(sub(new Date(), { years: 3 }), 'yyyy-MM-dd');
        realm.write(() => {
            if (Object.values(JSON.parse(JSON.stringify(realm.objects('SalesChannelSyncDate')))).length == 0) {
                realm.create('SalesChannelSyncDate', { lastSalesChannelSync: firstSyncDate });
            }
        });
    }

    truncate() {
        try {
            realm.write(() => {
                realm.delete(realm.objects('SalesChannel'));
                realm.delete(realm.objects('SalesChannelSyncDate'));
            })
        } catch (e) {
        }
    }

    getLastSalesChannelSync() {
        return JSON.parse(JSON.stringify(realm.objects('SalesChannelSyncDate')))['0'].lastSalesChannelSync;
    }

    setLastSalesChannelSync() {
        realm.write(() => {
            let syncDate = realm.objects('SalesChannelSyncDate');
            syncDate[0].lastSalesChannelSync = new Date();
        })
    }


    getSalesChannels() {
        return this.salesChannels = Object.values(JSON.parse(JSON.stringify(realm.objects('SalesChannel'))));
    }

    getSalesChannelsByDate(date) {
      let salesChannels = Object.values(JSON.parse(JSON.stringify(realm.objects('SalesChannel'))));
        return salesChannels.filter(r => {
            return compareAsc(parseISO(r.created_at), parseISO(date)) === 1 || compareAsc(parseISO(r.updated_at), parseISO(date)) === 1 || r.active === false;
        })

    }

    getSalesChannelsForDisplay() {
        return this.salesChannels.map(salesChannel => {
            return {
                id: salesChannel.id,
                name: salesChannel.name,
                displayName: capitalizeWord(salesChannel.name),
                active: salesChannel.active
            };
        });
    }

    initialise() {
        return this.getSalesChannels();
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

    getSalesChannelFromName(name) {
        for (let i = 0; i < this.salesChannels.length; i++) {
            if (this.salesChannels[i].name === name) {
                return this.salesChannels[i];
            }
        }
        return null;
    }

    getSalesChannelFromId(id) {
        for (let i = 0; i < this.salesChannels.length; i++) {
            if (this.salesChannels[i].id === id) {
                return this.salesChannels[i];
            }
        }
        return null;
    }

    createManySalesChannel(salesChannels) {

        return new Promise((resolve, reject) => {
            try {
                let result = [];
                realm.write(() => {
                    for (i = 0; i < salesChannels.length; i++) {
                        let ischeckSalesChannels = this.checkSalesChannels(salesChannels[i].created_at, salesChannels[i].id).length;
                        if (ischeckSalesChannels === 0) {
                            let value = realm.create('SalesChannel', { ...salesChannels[i], active: true });
                            result.push({ status: 'success', data: value, message: 'Sales Channel has been set' });
                        } else if (ischeckSalesChannels > 0) {
                            result.push({ status: 'success', data: salesChannels[i], message: 'Local Sales Channel has been updated' });
                            let salesChannelObj = realm.objects('SalesChannel').filtered(`id = "${salesChannels[i].id}"`);
                            salesChannelObj[0].description = salesChannels[i].description;
                            salesChannelObj[0].name = salesChannels[i].name;
                            salesChannelObj[0].updated_at = new Date(salesChannels[i].updated_at);
                        }
                    }

                    // salesChannels.forEach(obj => {
                    //     realm.create('SalesChannel', obj);
                    // });
                });
                resolve(result);
            } catch (e) {
            }
        });
    }


    checkSalesChannels(date, id) {
        return this.getSalesChannels().filter(e => SyncUtils.isSimilarDay(e.created_at, date) && e.id === id)
    }


}

export default new SalesChannelRealm();
