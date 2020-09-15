
export const CreditSchema = {
    name: 'Credit',
    properties: {
        id: { type: 'int', optional: true },
        top_up_id: { type: 'string', optional: true },
        receipt_id:  { type: 'string', optional: true },
        customer_account_id: { type: 'string', optional: true },
        notes: { type: 'string', optional: true },
        topup: { type: 'double', optional: true },
        balance: { type: 'double', optional: true },
        active: { type: 'bool', optional: true },
        synched: { type: 'bool', optional: true },
        syncAction: { type: 'string', optional: true },
        created_at: { type: 'date', optional: true },
        updated_at: { type: 'date', optional: true },
    }
};

export const CreditSyncDateSchema = {
    name: 'CreditSyncDate',
    properties: {
        lastCreditSync: 'date',
    }
};
