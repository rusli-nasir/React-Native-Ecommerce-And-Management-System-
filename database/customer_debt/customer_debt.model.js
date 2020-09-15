export const CustomerDebtSchema = {
    name: 'CustomerDebt',
    properties: {
        id: { type: 'int', optional: true },
        customer_debt_id:  { type: 'string', optional: true },
        receipt_id:  { type: 'string', optional: true },
        customer_account_id:  { type: 'string', optional: true },
        notes: { type: 'string', optional: true },
        due_amount: { type: 'int', optional: true },
        balance: { type: 'int', optional: true },
        synched: { type: 'bool', optional: true },
        syncAction: { type: 'string', optional: true },
        created_at: { type: 'date', optional: true },
        active: { type: 'bool', optional: true },
        updated_at: { type: 'date', optional: true },
    }
};

export const CustomerDebtSyncDateSchema = {
    name: 'CustomerDebtSyncDate',
    properties: {
        lastCustomerDebtSync: 'date',
    }
};