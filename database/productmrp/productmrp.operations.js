import realm from '../init';
import { uuidv1 } from 'uuid';
// const uuidv1 = require('uuid/v1');
import SyncUtils from '../../services/sync/syncUtils';
import { parseISO,  format, sub, compareAsc } from 'date-fns';

class ProductMRPRealm {
    constructor() {
        this.productMRP = [];
        let firstSyncDate = format(sub(new Date(), { years: 3 }), 'yyyy-MM-dd');
        realm.write(() => {
            if (Object.values(JSON.parse(JSON.stringify(realm.objects('ProductMRPSyncDate')))).length == 0) {
                realm.create('ProductMRPSyncDate', { lastProductMRPSync: firstSyncDate });
            }
        });

    }

    getLastProductMRPSync() {
        return this.lastProductMRPSync = JSON.parse(JSON.stringify(realm.objects('ProductMRPSyncDate')))['0'].lastProductMRPSync;
    }

    truncate() {
        try {
            realm.write(() => {
                let productMRPs = realm.objects('ProductMRP');
                realm.delete(realm.objects('ProductMRPSyncDate'));
                realm.delete(productMRPs);
            })
        } catch (e) {
        }
    }

    setLastProductMRPSync() {
        realm.write(() => {
        let syncDate = realm.objects('ProductMRPSyncDate');
        syncDate[0].lastProductMRPSync = new Date()
        })
    }

    getFilteredProductMRP() {
        let productMrpDict = {}; // Note - This assumes that all productMrps are being saved
        let productMrpsArray = Object.values(JSON.parse(JSON.stringify(realm.objects('ProductMRP').filtered(`active = ${true}`))));
        productMrpsArray.forEach(productMrp => {
            const key = this.getProductMrpKey(productMrp);
			productMrpDict[key] = productMrp;
		});

        return this.productMRP = productMrpDict;
    }



    getProductMrpKey(productMrp) {
		return '' + productMrp.productId + '-' + productMrp.salesChannelId; // ProductId and salesChannelId are unique key
    }

    getProductMrpKeyFromIds(productId, salesChannelId) {
		return '' + productId + '-' + salesChannelId;
	}

    getProductMRPS() {
        return Object.values(JSON.parse(JSON.stringify(realm.objects('ProductMRP'))));
    }

    getProductMRPSByDate(date) {
        let productMrps = Object.values(JSON.parse(JSON.stringify(realm.objects('ProductMRP'))));
        return productMrps.filter(r => {
            return compareAsc(parseISO(r.created_at), parseISO(date)) === 1 || compareAsc(parseISO(r.updated_at), parseISO(date)) === 1 || r.active === false;
        })
    }

    initialise() {
        return this.getProductMRPS();
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


    createProductMRP(kiosk_id, product_id, quantity, filterDate) {
        let existingProductMRP = this.getProductMRPS().filter(productMRP => this.formatDay(productMRP.created_at) === this.formatDay(filterDate) && productMRP.product_id === product_id);
        const now = new Date();
        if (existingProductMRP.length === 0) {
            const newProductMRP = {
                id: uuidv1(),
                kiosk_id,
                product_id,
                quantity,
                created_at: now,
                updated_at: now,
                syncAction: 'create',
                active: false
            };
            try {
                realm.write(() => {
                    realm.create('ProductMRP', newProductMRP);
                });
            } catch (e) {
            }
        }

        if (existingProductMRP.length > 0) {
            return this.updateProductMRP(
                { ...existingProductMRP[0], quantity: quantity, updated_at: now, syncAction: 'update' }
            )
        }
    }

    updateProductMRP(productMRP) {
        try {
            realm.write(() => {
                let productMRPObj = realm.objects('ProductMRP').filtered(`id = "${productMRP.id}"`);
                productMRPObj[0].quantity = productMRP.quantity;
                productMRPObj[0].updated_at = productMRP.updated_at;
                productMRPObj[0].syncAction = productMRP.syncAction;
            })

        } catch (e) {
        }

    }

    synched(productMRP) {
        try {
            realm.write(() => {
                let productMRPObj = realm.objects('ProductMRP').filtered(`id = "${productMRP.id}"`);
                productMRPObj[0].isSynched = true;
                productMRPObj[0].syncAction = null;
            })

        } catch (e) {
        }

    }


  // Hard delete when active property is false or when active property and syncAction is delete

    hardDeleteProductMRP(productMRP) {
        try {
            realm.write(() => {
                let productMRPs = realm.objects('ProductMRP');
                let deleteProductMRP = productMRPs.filtered(`id = "${productMRP.id}"`);
                realm.delete(deleteProductMRP);
            })

        } catch (e) {
        }
    }

    softDeleteProductMRP(productMRP) {
        try {
            realm.write(() => {
                realm.write(() => {
                    let productMRPObj = realm.objects('ProductMRP').filtered(`id = "${productMRP.id}"`);
                    productMRPObj[0].syncAction = 'delete';
                })
            })

        } catch (e) {
        }
    }




    createManyProductMRP(productMRPs) {

        return new Promise((resolve, reject) => {
            try {
                let result = [];
                realm.write(() => {
                    for (i = 0; i < productMRPs.length; i++) {
                        let ischeckproductMRPs = this.checkProductMrps(productMRPs[i].created_at, productMRPs[i].id).length;
                        if (ischeckproductMRPs === 0) {
                            let value = realm.create('ProductMRP', {
                                ...productMRPs[i],
                                priceAmount: Number(productMRPs[i].priceAmount),
                                cogsAmount: Number(productMRPs[i].cogsAmount),
                                productId: Number(productMRPs[i].productId),
                                salesChannelId: Number(productMRPs[i].salesChannelId),
                                siteId: Number(productMRPs[i].siteId),
                            });
                            result.push({ status: 'success', data: value, message: 'Product MRP has been set' });
                        } else if (ischeckproductMRPs > 0) {
                            let discountObj = realm.objects('ProductMRP').filtered(`id = "${productMRPs[i].id}"`);

                             discountObj[0].priceAmount=  Number(productMRPs[i].priceAmount);
                             discountObj[0].cogsAmount = Number(productMRPs[i].cogsAmount);
                             discountObj[0].productId = Number(productMRPs[i].productId);
                             discountObj[0].salesChannelId = Number(productMRPs[i].salesChannelId);
                             discountObj[0].siteId =Number(productMRPs[i].siteId);
                             discountObj[0].currencyCode = productMRPs[i].currencyCode;
                             discountObj[0].active = productMRPs[i].active;
                             discountObj[0].updated_at = productMRPs[i].updated_at;
                             result.push({ status: 'success', data: productMRPs[i], message: 'Local Product MRP has been updated' });


                        }
                    }

                });
                resolve(result);
            } catch (e) {
                return e;
            }
        });
    }





    checkProductMrps(date, id) {
        return this.getProductMRPS().filter(e => SyncUtils.isSimilarDay(e.created_at, date) && e.id === id)
    }
}

export default new ProductMRPRealm();
