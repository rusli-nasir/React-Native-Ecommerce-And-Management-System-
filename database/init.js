var Realm = require('realm');
import { CustomerSchema, CustomerSyncDateSchema } from './customers/customer.model';
import { CreditSchema, CreditSyncDateSchema } from './credit/credit.model';
import { InventorySchema, InventorySyncDateSchema } from './inventory/inventory.model';
import { ProductMRPSchema, ProductMRPSyncDateSchema } from './productmrp/productmrp.model';
import { ProductSchema, ProductSyncDateSchema } from './products/product.model';
import { SalesChannelSchema, SalesChannelSyncDateSchema } from './sales-channels/sales-channels.model';
import { CustomerTypesSchema, CustomerTypesSyncDateSchema } from './customer-types/customer-types.model';
import { SettingsSchema, TokenExpirySchema } from './settings/settings.model';
import { OrderSyncDateSchema, OrderSchema } from './orders/orders.model';
import { DiscountSchema, DiscountSyncDateSchema } from './discount/discount.model';
import { CustomerDebtSchema, CustomerDebtSyncDateSchema } from './customer_debt/customer_debt.model';
import { MeterReadingSchema, MeterReadingSyncDateSchema } from './inventory/meter-reading.model';
import { CustomerReminderSchema, CustomerReminderSyncDateSchema } from './customer-reminder/customer-reminder.model';

import { PaymentTypeSchema, PaymentTypeSyncDateSchema } from './payment_types/payment_type.model';
import { ReceiptPaymentTypeSchema, ReceiptPaymentTypeSyncDateSchema } from './reciept_payment_types/reciept_payment_types.model';


import { DebtTopupPaymentTypeSchema, DebtTopupPaymentTypeSyncDateSchema } from './debtTopupPaymentTypes/debtTopupPaymentTypes.model';


// Realm schema creation
const SEMA_SCHEMA = {
    name: 'SemaRealm',
    primaryKey: 'id',
    properties: {
        id: 'string',
        data: 'string'
    }
};

export default realm = new Realm({
    schema: [
        SEMA_SCHEMA,
        InventorySchema,
        InventorySyncDateSchema,
        CreditSchema,
        CreditSyncDateSchema,
        CustomerSchema,
        CustomerSyncDateSchema,
        ProductMRPSchema,
        ProductMRPSyncDateSchema,
        ProductSchema,
        ProductSyncDateSchema,
        CustomerTypesSchema,
        CustomerTypesSyncDateSchema,
        SalesChannelSchema,
        SalesChannelSyncDateSchema,
        SettingsSchema,
        TokenExpirySchema,
        OrderSchema,
        OrderSyncDateSchema,
        DiscountSchema,
        DiscountSyncDateSchema,
        PaymentTypeSchema,
        PaymentTypeSyncDateSchema,
        ReceiptPaymentTypeSchema,
        ReceiptPaymentTypeSyncDateSchema,
        CustomerDebtSchema,
        CustomerReminderSchema,
        CustomerReminderSyncDateSchema,
        MeterReadingSchema,
        MeterReadingSyncDateSchema,
        CustomerDebtSyncDateSchema,
        DebtTopupPaymentTypeSchema,
        DebtTopupPaymentTypeSyncDateSchema
    ],
    schemaVersion: 96,
    migration: (oldRealm, newRealm) => {
        // only apply this change if upgrading to schemaVersion 1
        if (oldRealm.schemaVersion < 1) {
            const oldObjects = oldRealm.objects('InventoryInventorySynDate');
            const newObjects = newRealm.objects('InventoryInventorySynDate');
        }
    }
});
