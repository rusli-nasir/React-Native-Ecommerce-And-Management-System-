import realm from '../init';
import { uuidv1 } from 'uuid';
// const uuidv1 = require('uuid/v1');
import SyncUtils from '../../services/sync/syncUtils';
import { parseISO,  format, sub, compareAsc } from 'date-fns';

class ProductsRealm {
    constructor() {
        this.product = [];
        let firstSyncDate = format(sub(new Date(), { years: 3 }), 'yyyy-MM-dd');
        realm.write(() => {
            if (Object.values(JSON.parse(JSON.stringify(realm.objects('ProductSyncDate')))).length == 0) {
                realm.create('ProductSyncDate', { lastProductSync: firstSyncDate });
            }
        });
        this.lastProductSync = firstSyncDate;
    }

    getLastProductsync() {
        return this.lastProductSync = JSON.parse(JSON.stringify(realm.objects('ProductSyncDate')))['0'].lastProductSync;
    }

    truncate() {
        try {
            realm.write(() => {
                let products = realm.objects('Product');
                realm.delete(realm.objects('ProductSyncDate'));
                realm.delete(products);
            })
        } catch (e) {
        }
    }

    setLastProductsync() {
        realm.write(() => {
            let syncDate = realm.objects('ProductSyncDate');
            syncDate[0].lastProductSync = new Date()
        })
    }



    getProducts() {
        return Object.values(JSON.parse(JSON.stringify(realm.objects('Product'))));
    }

    getProductsByDate(date) {
        try {
            let products = Object.values(JSON.parse(JSON.stringify(realm.objects('Product'))));
            return products.filter(r => {
                return compareAsc(parseISO(r.created_at), parseISO(date)) === 1 || compareAsc(parseISO(r.updated_at), parseISO(date)) === 1 || r.active === false;
            })

        } catch (e) {
        }


    }

    initialise() {
        return this.getProducts();
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


    createProducts(kiosk_id, product_id, quantity, filterDate) {
        let existingProducts = this.getProducts().filter(product => this.formatDay(product.created_at) === this.formatDay(filterDate) && product.product_id === product_id);
        const now = new Date();
        if (existingProducts.length === 0) {
            const newProducts = {
                productId: uuidv1(),
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
                    realm.create('Product', newProducts);
                });
            } catch (e) {
            }
        }

        if (existingProducts.length > 0) {
            return this.updateProducts(
                { ...existingProducts[0], quantity: quantity, updated_at: now, syncAction: 'update' }
            )
        }
    }

    updateProducts(product) {
        try {
            realm.write(() => {
                let productObj = realm.objects('Product').filtered(`productId = "${product.productId}"`);
                productObj[0].quantity = product.quantity;
                productObj[0].updated_at = product.updated_at;
                productObj[0].syncAction = product.syncAction;
            })

        } catch (e) {
        }

    }

    synched(product) {
        try {
            realm.write(() => {
                let productObj = realm.objects('Product').filtered(`productId = "${product.productId}"`);
                productObj[0].active = true;
                productObj[0].syncAction = null;
            })

        } catch (e) {
        }

    }


    // Hard delete when active property is false or when active property and syncAction is delete

    hardDeleteProducts(product) {
        try {
            realm.write(() => {
                let products = realm.objects('Product');
                let deleteProducts = products.filtered(`productId = "${product.productId}"`);
                realm.delete(deleteProducts);
            })

        } catch (e) {
        }
    }

    softDeleteProducts(product) {
        try {
            realm.write(() => {
                realm.write(() => {
                    let productObj = realm.objects('Product').filtered(`productId = "${product.productId}"`);
                    productObj[0].syncAction = 'delete';
                })
            })

        } catch (e) {
        }
    }




    createManyProducts(products) {
        return new Promise((resolve, reject) => {
            try {
                let result = [];
                realm.write(() => {
                    for (i = 0; i < products.length; i++) {
                        let ischeckproducts = this.checkProduct(products[i].created_at, products[i].id).length;
                        if (ischeckproducts === 0) {
                            let value = realm.create('Product', {
                                ...products[i],
                                productId: products[i].id,
                                sku: products[i].sku,
                                description: products[i].description,
                                categoryId: products[i].category,
                                priceAmount: Number(products[i].priceAmount),
                                priceCurrency: products[i].priceCurrency,
                                minimumQuantity: products[i].minQuantity,
                                maximumQuantity: products[i].maxQuantity,
                                unitPerProduct: products[i].unitsPerProduct,
                                unitMeasure: products[i].unitMeasurement,
                                cogsAmount: Number(products[i].costOfGoods),
                                updated_at: products[i].updated_at,
                                base64encodedImage: products[i].base64Image,
                                wastageName: products[i].wastageName,
                                active: true
                            });
                            result.push({ status: 'success', data: value, message: 'Product has been set' });
                        } else if (ischeckproducts > 0) {
                            let discountObj = realm.objects('Product').filtered(`id = "${products[i].id}"`);
                            discountObj[0].productId = products[i].id;
                            discountObj[0].sku = products[i].sku;
                            discountObj[0].description = products[i].description;
                            discountObj[0].categoryId = products[i].category;
                            discountObj[0].priceAmount = Number(products[i].priceAmount);
                            discountObj[0].priceCurrency = products[i].priceCurrency;
                            discountObj[0].minimumQuantity = products[i].minQuantity;
                            discountObj[0].maximumQuantity = products[i].maxQuantity;
                            discountObj[0].unitPerProduct = products[i].unitsPerProduct;
                            discountObj[0].unitMeasure = products[i].unitMeasurement;
                            discountObj[0].cogsAmount = Number(products[i].costOfGoods);
                            discountObj[0].updated_at = products[i].updated_at;
                            discountObj[0].base64encodedImage = products[i].base64Image;
                            discountObj[0].wastageName = products[i].wastageName;
                            result.push({ status: 'success', data: products[i], message: 'Local Product has been updated' });

                        }
                    }

                });
                resolve(result);
            } catch (e) {
            }
        });
    }

    checkProduct(date, id) {
        return this.getProducts().filter(e => SyncUtils.isSimilarDay(e.created_at, date) && e.id === id)
    }



}

export default new ProductsRealm();
