export const DebtTopupPaymentTypeSchema = {
    name: 'DebtTopupPaymentTypes',
    properties: {
		id: { type: 'int', optional: true },
		debtTopupPaymentTypesId:  { type: 'string', optional: true },
        customer_debt_id:  { type: 'string', optional: true },
        top_up_id:  { type: 'string', optional: true },
        type:  { type: 'string', optional: true },
        payment_type_id: { type: 'int', optional: true },
        amount: { type: 'double', optional: true },
        syncAction: { type: 'string', optional: true },
        created_at: { type: 'date', optional: true },
        updated_at: { type: 'date', optional: true },
        active: { type: 'bool', optional: true },
    }
};

export const DebtTopupPaymentTypeSyncDateSchema = {
    name: 'DebtTopupPaymentTypeSyncDate',
    properties: {
        lastDebtTopupPaymentTypeSync: 'date',
    }
};
