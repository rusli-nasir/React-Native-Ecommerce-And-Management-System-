import realm from '../init';
import SyncUtils from '../../services/sync/syncUtils';
import {parseISO, format, sub, compareAsc} from 'date-fns';

class OrderRealm {
  constructor() {
    this.order = [];
    let firstSyncDate = format(sub(new Date(), {days: 30}), 'yyyy-MM-dd');
    realm.write(() => {
      if (
        Object.values(
          JSON.parse(JSON.stringify(realm.objects('OrderSyncDate'))),
        ).length == 0
      ) {
        realm.create('OrderSyncDate', {lastOrderSync: firstSyncDate});
      }
    });
    this.lastOrderSync = firstSyncDate;
  }

  getLastOrderSync() {
    return (this.lastOrderSync = JSON.parse(
      JSON.stringify(realm.objects('OrderSyncDate')),
    )['0'].lastOrderSync);
  }

  setLastOrderSync() {
    realm.write(() => {
      let syncDate = realm.objects('OrderSyncDate');
      syncDate[0].lastOrderSync = new Date();
    });
  }

  truncate() {
    try {
      realm.write(() => {
        let orders = realm.objects('Order');
        realm.delete(orders);
        realm.delete(realm.objects('OrderSyncDate'));
      });
    } catch (e) {}
  }

  getAllOrder() {
    let formattedArray = [
      ...Object.values(JSON.parse(JSON.stringify(realm.objects('Order')))),
    ];
    for (let i in formattedArray) {
      formattedArray[i].customer_account = JSON.parse(
        JSON.stringify(
          realm
            .objects('Customer')
            .filtered(
              `id = "${
                formattedArray[i].customerAccountId
                  ? formattedArray[i].customerAccountId
                  : formattedArray[i].customer_account_id
              }"`,
            ),
        ),
      )[0];

      formattedArray[i].receipt_line_items = JSON.parse(
        formattedArray[i].receipt_line_items,
      ).map((e) => {
        return {
          ...e,
          product: JSON.parse(
            JSON.stringify(
              realm
                .objects('Product')
                .filtered(`productId = "${e.product_id}"`),
            ),
          )[0],
        };
      });
    }
    return (this.order = formattedArray);
  }

  getActiveOrders() {
    let formattedArray = [
      ...Object.values(
        JSON.parse(
          JSON.stringify(realm.objects('Order').filtered(`is_delete = "${1}"`)),
        ),
      ),
    ];
    for (let i in formattedArray) {
      formattedArray[i].customer_account = JSON.parse(
        JSON.stringify(
          realm
            .objects('Customer')
            .filtered(
              `id = "${
                formattedArray[i].customerAccountId
                  ? formattedArray[i].customerAccountId
                  : formattedArray[i].customer_account_id
              }"`,
            ),
        ),
      )[0];

      formattedArray[i].receipt_line_items = JSON.parse(
        formattedArray[i].receipt_line_items,
      ).map((e) => {
        return {
          ...e,
          product: JSON.parse(
            JSON.stringify(
              realm
                .objects('Product')
                .filtered(`productId = "${e.product_id}"`),
            ),
          )[0],
        };
      });
    }

    return (this.order = formattedArray);
  }

  getOrdersByDate(date) {
    return new Promise((resolve) => {
      try {
        let orderObj = Object.values(
          JSON.parse(JSON.stringify(realm.objects('Order'))),
        );
        let orderObj2 = orderObj.map((item) => {
          return {
            ...item,
            created_at: format(parseISO(item.created_at), 'yyyy-MM-dd'),
          };
        });

        resolve(
          orderObj2.filter(
            (r) => r.created_at === format(parseISO(date), 'yyyy-MM-dd'),
          ),
        );
      } catch (e) {}
    });
  }

  getOrdersByDate2(date) {
    try {
      let orderObj = Object.values(
        JSON.parse(JSON.stringify(realm.objects('Order'))),
      );

      for (let i in orderObj) {
        orderObj[i].customer_account = JSON.parse(orderObj[i].customer_account);
        orderObj[i].receipt_line_items = JSON.parse(
          orderObj[i].receipt_line_items,
        );
      }
      return orderObj.filter((r) => {
        // return r.created_at === format(parseISO(date), 'yyyy-MM-dd') || r.updated_at === format(parseISO(date), 'yyyy-MM-dd')
        return (
          compareAsc(parseISO(r.created_at), parseISO(date)) === 1 ||
          compareAsc(parseISO(r.updated_at), parseISO(date)) === 1 ||
          r.active === false
        );
      });
    } catch (e) {}
  }

  getOrderItems() {
    return (this.order = Object.values(
      JSON.parse(JSON.stringify(realm.objects('OrderItems'))),
    ));
  }

  initialise() {
    return this.getAllOrder();
  }

  formatDay(date) {
    date = new Date(date);
    var day = date.getDate(),
      month = date.getMonth() + 1,
      year = date.getFullYear();
    if (month.toString().length == 1) {
      month = '0' + month;
    }
    if (day.toString().length == 1) {
      day = '0' + day;
    }

    return (date = year + '-' + month + '-' + day);
  }

  createOrder(receipt) {
    const now = new Date();

    const newOrder = {
      active: false,
      status: 'pending',
      amount_cash: receipt.amount_cash,
      amount_loan: receipt.amount_loan,
      amount_mobile: receipt.amount_mobile,
      amount_bank: receipt.amount_bank,
      amount_cheque: receipt.amount_cheque,
      amountjibuCredit: receipt.amountjibuCredit,
      isWalkIn: receipt.isWalkIn,
      delivery: receipt.delivery,
      notes: receipt.notes,
      cogs: receipt.cogs,
      customer_account: JSON.stringify(receipt.customer_account),
      created_at: receipt.created_at.toISOString(),
      updated_at: receipt.created_at.toISOString(),
      currency_code: receipt.currency_code,
      customer_account_id: receipt.customer_account_id,
      customer_type_id: receipt.customer_type_id,
      id: receipt.id,
      uuid: receipt.uuid,
      payment_type: receipt.payment_type,
      receipt_line_items: receipt.products,
      receiptId: receipt.id,
      sales_channel_id: receipt.sales_channel_id,
      kiosk_id: receipt.siteId,
      total: receipt.total,
      syncAction: 'create',
    };

    let receipt_line_items = [];
    for (let i in receipt.products) {
      receipt_line_items.push({
        currency_code: newOrder.currency_code,
        price_total: receipt.products[i].price_total,
        sku: receipt.products[i].sku,
        litersPerSku: receipt.products[i].litersPerSku,
        quantity: receipt.products[i].quantity,
        receipt_id: newOrder.receiptId,
        is_delete: receipt.products[i].is_delete,
        product_id: receipt.products[i].product_id,
        product: receipt.products[i].product,
        description: receipt.products[i].description,
        cogs_total: receipt.products[i].cogs_total,
        notes: receipt.products[i].notes,
        refillPending: receipt.products[i].refillPending,
        emptiesDamaged: receipt.products[i].emptiesDamaged,
        emptiesReturned: receipt.products[i].emptiesReturned,
        totalAmount: receipt.products[i].totalAmount,
        active: false,
        created_at: newOrder.created_at,
        updated_at: newOrder.updated_at,
      });
    }
    newOrder.receipt_line_items = JSON.stringify(receipt_line_items);
    try {
      realm.write(() => {
        realm.create('Order', newOrder);
      });
    } catch (e) {}
  }

  updateOrder(
    order,
    phone,
    name,
    address,
    salesChannelId,
    orderTypeId,
    frequency,
    secondPhoneNumber,
  ) {
    try {
      realm.write(() => {
        let orderObj = realm
          .objects('Order')
          .filtered(`orderId = "${order.orderId}"`);

        orderObj[0].name = name;
        orderObj[0].phoneNumber = phone;
        orderObj[0].address = address;
        orderObj[0].salesChannelId = salesChannelId;
        orderObj[0].orderTypeId = orderTypeId;
        orderObj[0].updated_at = new Date();
        orderObj[0].syncAction = 'update';
        orderObj[0].frequency = frequency;
        orderObj[0].secondPhoneNumber = secondPhoneNumber;

        if (order.reminder_date) {
          orderObj[0].reminder_date = format(
            parseISO(order.reminder_date),
            'yyyy-MM-dd',
          );
        }
      });
    } catch (e) {}
  }

  synched(order) {
    try {
      realm.write(() => {
        let orderObj = realm
          .objects('Order')
          .filtered(`receiptId = "${order.receiptId}"`);
        orderObj[0].active = true;
        orderObj[0].syncAction = null;
      });
    } catch (e) {}
  }

  // Hard delete when active property is false or when active property and syncAction is delete

  hardDeleteOrder(order) {
    try {
      realm.write(() => {
        let orders = realm.objects('Order');
        let deleteOrder = orders.filtered(`receiptId = "${order.receiptId}"`);
        realm.delete(deleteOrder);
      });
    } catch (e) {}
  }

  softDeleteOrder(order) {
    try {
      realm.write(() => {
        let orderObj = realm
          .objects('Order')
          .filtered(`receiptId = "${order.receiptId}"`);
        orderObj[0].syncAction = 'delete';
        orderObj[0].is_delete = 0;
        orderObj[0].updated_at = new Date();
      });
    } catch (e) {}
  }

  createManyOrders(orders) {
    return new Promise((resolve, reject) => {
      try {
        let result = [];
        realm.write(() => {
          for (i = 0; i < orders.length; i++) {
            let ischeckOrder = this.checkOrder(
              orders[i].created_at,
              orders[i].uuid,
            ).length;
            if (ischeckOrder === 0) {
              let value = realm.create('Order', {
                ...orders[i],
                amount_cash: Number(orders[i].amount_cash),
                amount_loan: Number(orders[i].amount_loan),
                amount_mobile: Number(orders[i].amount_mobile),
                cogs: Number(orders[i].cogs),
                total: Number(orders[i].total),
                active: true,
                customer_account: JSON.stringify(orders[i].customer_account),
                receipt_line_items: JSON.stringify(
                  orders[i].receipt_line_items,
                ),
              });
              result.push({
                status: 'success',
                data: value,
                message: 'Order has been set',
              });
            } else if (ischeckOrder > 0) {
              let orderObj = realm
                .objects('Order')
                .filtered(`uuid = "${orders[i].uuid}"`);

              orderObj[0].cogs = Number(orders[i].cogs);
              orderObj[0].total = Number(orders[i].total);
              orderObj[0].notes = orders[i].notes;
              orderObj[0].active = true;
              orderObj[0].customer_account = JSON.stringify(
                orders[i].customer_account,
              );
              orderObj[0].receipt_line_items = JSON.stringify(
                orders[i].receipt_line_items,
              );
              orderObj[0].delivery = orders[i].delivery;
              orderObj[0].customer_account = JSON.stringify(
                orders[i].customer_account,
              );
              orderObj[0].updated_at = orders[i].updated_at;
              orderObj[0].currency_code = orders[i].currency_code;
              orderObj[0].customer_account_id = orders[i].customer_account_id;
              orderObj[0].customer_type_id = orders[i].customer_type_id;
              orderObj[0].id = orders[i].id;
              orderObj[0].payment_type = orders[i].payment_type;
              orderObj[0].receiptId = orders[i].id;
              orderObj[0].sales_channel_id = orders[i].sales_channel_id;
              orderObj[0].kiosk_id = orders[i].siteId;
              orderObj[0].total = orders[i].total;

              result.push({
                status: 'success',
                data: orders[i],
                message: 'Local Order has been updated',
              });
            }
          }
        });
        resolve(result);
      } catch (e) {}
    });
  }

  checkOrder(date, uuid) {
    return this.getAllOrder().filter(
      (e) => SyncUtils.isSimilarDay(e.created_at, date) && e.uuid === uuid,
    );
  }
}

export default new OrderRealm();
