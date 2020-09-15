import realm from '../init';
import SyncUtils from '../../services/sync/syncUtils';
import { parseISO, format, sub, compareAsc } from 'date-fns';

class DiscountRealm {
    constructor() {
        this.discount = [];
        let firstSyncDate = format(sub(new Date(), { years: 3 }), 'yyyy-MM-dd');
        realm.write(() => {
            if (Object.values(JSON.parse(JSON.stringify(realm.objects('DiscountSyncDate')))).length == 0) {
                realm.create('DiscountSyncDate', { lastDiscountSync: firstSyncDate });
            }
        });
    }

    truncate() {
        try {
            realm.write(() => {
                let discounts = realm.objects('Discount');
                realm.delete(realm.objects('DiscountSyncDate'));
                realm.delete(discounts);
            })
        } catch (e) {
        }
    }

    getLastDiscountSync() {
        return JSON.parse(JSON.stringify(realm.objects('DiscountSyncDate')))['0'].lastDiscountSync;
    }

    setLastDiscountSync() {
        realm.write(() => {
            let syncDate = realm.objects('DiscountSyncDate');
            syncDate[0].lastDiscountSync = new Date();
        })
    }

    geDiscountsByDate(date) {
        let discounts = Object.values(JSON.parse(JSON.stringify(realm.objects('Discount'))));
        return discounts.filter(r => {
            return compareAsc(parseISO(r.created_at), parseISO(date)) === 1 || compareAsc(parseISO(r.updated_at), parseISO(date)) === 1 || r.active === false;
        })
    }

    getDiscounts() {
        return Object.values(JSON.parse(JSON.stringify(realm.objects('Discount'))));
    }

    initialise() {
        return this.getDiscounts();
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


    createDiscount(discount) {

        try {
            realm.write(() => {
                realm.create('Discount', discount);
            });
        } catch (e) {
        }



    }

    updateDiscount(discount) {
        try {
            realm.write(() => {
                let discountObj = realm.objects('Discount').filtered(`id = "${discount.id}"`);
                discountObj[0].applies_to = discount.applies_to;
                discountObj[0].start_date = discount.start_date;
                discountObj[0].end_date = discount.end_date;
                discountObj[0].base64encoded_image = discount.base64encoded_image;
                discountObj[0].region_id = discount.region_id;
                discountObj[0].amount = discount.amount;
                discountObj[0].kiosk_id = discount.kiosk_id;
                discountObj[0].sku = discount.sku;
                discountObj[0].type = discount.type;
                discountObj[0].quantity = discount.quantity;
                discountObj[0].active = discount.active;
                discountObj[0].created_at = discount.created_at;
                discountObj[0].updated_at = discount.updated_at;

            })

        } catch (e) {
        }

    }

    resetSelected(){
        try {
            realm.write(() => {
                let discountObj = realm.objects('Discount');

                discountObj.forEach(element=>{
                    element.isSelected = false;
                })
            })

        } catch (e) {
        }

    }

    isSelected(discount,isSelected) {
        try {
            realm.write(() => {
                let discountObj = realm.objects('Discount').filtered(`id = "${discount.id}"`);
                discountObj[0].isSelected = isSelected;

            });

        } catch (e) {
        }

    }

    synched(discount) {
        try {
            realm.write(() => {
                let discountObj = realm.objects('Discount').filtered(`id = "${discount.id}"`);
                discountObj[0].active = true;
                discountObj[0].syncAction = null;
            })

        } catch (e) {
        }

    }


    // Hard delete when active property is false or when active property and syncAction is delete

    hardDeleteDiscount(discount) {
        try {
            realm.write(() => {
                let discounts = realm.objects('Discount');
                let deleteDiscount = discounts.filtered(`id = "${discount.id}"`);
                realm.delete(deleteDiscount);
            })

        } catch (e) {
        }
    }

    softDeleteDiscount(discount) {
        try {
            realm.write(() => {
                realm.write(() => {
                    let discountObj = realm.objects('Discount').filtered(`id = "${discount.id}"`);
                    discountObj[0].syncAction = 'delete';
                })
            })

        } catch (e) {
        }
    }



    createManyDiscount(discounts) {

        return new Promise((resolve, reject) => {
            try {
                let result = [];
                realm.write(() => {
                    for (i = 0; i < discounts.length; i++) {
                        let ischeckdiscounts = this.checkdiscounts(discounts[i].created_at, discounts[i].id).length;
                        if (ischeckdiscounts === 0) {
                            let value = realm.create('Discount', {
                                ...discounts[i],
                                amount: Number(discounts[i].amount),
                                active: true
                            });
                            result.push({ status: 'success', data: value, message: 'Discount has been set' });
                        } else if (ischeckdiscounts > 0) {
                            let discountObj = realm.objects('Discount').filtered(`id = "${discounts[i].id}"`);

                             discountObj[0].amount=  Number(discounts[i].amount);
                             discountObj[0].applies_to = discounts[i].applies_to;
                             discountObj[0].start_date = discounts[i].start_date;
                             discountObj[0].end_date = discounts[i].end_date;
                             discountObj[0].product_id = discounts[i].product_id;
                             discountObj[0].region_id = discounts[i].region_id;
                             discountObj[0].base64encoded_image = discounts[i].base64encoded_image;
                             discountObj[0].kiosk_id = discounts[i].kiosk_id;
                             discountObj[0].sku = discounts[i].sku;
                             discountObj[0].type = discounts[i].type;
                             discountObj[0].updated_at = discounts[i].updated_at;
                             result.push({ status: 'success', data: discounts[i], message: 'Local Discount has been updated' });


                        }
                    }

                });
                resolve(result);
            } catch (e) {
            }
        });
    }

    checkdiscounts(date, id) {
        return this.getDiscounts().filter(e => SyncUtils.isSimilarDay(e.created_at, date) && e.id === id)
    }

}

export default new DiscountRealm();
