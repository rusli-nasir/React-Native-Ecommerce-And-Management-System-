export const ReceiptPaymentTypeSchema = {
    name: 'ReceiptPaymentType',
    properties: {
		id: { type: 'int', optional: true },
		receipt_payment_type_id:  { type: 'string', optional: true },
        receipt_id:  { type: 'string', optional: true },
        payment_type_id: { type: 'int', optional: true },
        amount: { type: 'double', optional: true },
        syncAction: { type: 'string', optional: true },
        created_at: { type: 'date', optional: true },
        updated_at: { type: 'date', optional: true },
        active: { type: 'bool', optional: true },
    }
};

export const ReceiptPaymentTypeSyncDateSchema = {
    name: 'ReceiptPaymentTypeSyncDate',
    properties: {
        lastReceiptPaymentTypeSync: 'date',
    }
};
