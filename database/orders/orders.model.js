

export const OrderSchema = {
    name: 'Order',
    properties: {
        amount_card: { type: 'string', optional: true },
        amount_cash: { type: 'double', optional: true },
        amount_loan: { type: 'double', optional: true },
        amount_mobile: { type: 'double', optional: true },
        is_delete: { type: 'int', optional: true, default: 1 },
        isWalkIn: { type: 'bool', optional: true },
        notes: { type: 'string', optional: true },
        refillPending: { type: 'string', optional: true },
        emptiesDamaged: { type: 'string', optional: true },
        emptiesReturned: { type: 'string', optional: true },
        amount_bank: { type: 'double', optional: true },
        amount_cheque: { type: 'double', optional: true },
        amountjibuCredit: { type: 'double', optional: true },
        cogs: { type: 'double', optional: true },
        currency_code: { type: 'string', optional: true },
        customerAccountId: { type: 'string', optional: true },
        customer_account: { type: 'string', optional: true },
        //customer_account: {type: 'linkingObjects', objectType: 'Customer', property: 'orders'},
        customer_account_id: { type: 'string', optional: true },
        customer_type_id: { type: 'int', optional: true },
        delivery_id: { type: 'string', optional: true },
        delivery: { type: 'string', optional: true },
        id: { type: 'string', optional: true },
        isLocal: { type: 'string', optional: true },
        is_sponsor_selected: { type: 'bool', optional: true },
        kiosk_id: { type: 'int', optional: true },
        payment_type: { type: 'string', optional: true },
        //receipt_line_items: { type: 'OrderItems[]' },
        receipt_line_items: { type: 'string', optional: true },
        sales_channel_id: { type: 'int', optional: true },
        sponsor_amount: { type: 'string', optional: true },
        sponsor_id: { type: 'string', optional: true },
        total: { type: 'double', optional: true },
        totalAmount: { type: 'double', optional: true },
        user_id: { type: 'string', optional: true },
        uuid: { type: 'string', optional: true },
        receiptId: { type: 'string', optional: true },
        active: { type: 'bool', optional: true },
        status: { type: 'string', optional: true }, // pending - onCredit - fully paid
        syncAction: { type: 'string', optional: true },
        created_at: { type: 'date', optional: true },
        updated_at: { type: 'date', optional: true },
    }
};


export const OrderSyncDateSchema = {
    name: 'OrderSyncDate',
    properties: {
        lastOrderSync: 'date',
    }
};
