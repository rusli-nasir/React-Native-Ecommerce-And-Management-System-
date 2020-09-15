export const PaymentTypeSchema = {
    name: 'PaymentType',
    properties: {
        id: { type: 'int', optional: true },
        name:  { type: 'string', optional: true },
        active: { type: 'bool', optional: true },
        description: { type: 'string', optional: true },
        isSelected: { type: 'bool', optional: true, default: false },
        syncAcytion: { type: 'string', optional: true },
        created_at: { type: 'date', optional: true },
        updated_at: { type: 'date', optional: true },
    }
};

export const PaymentTypeSyncDateSchema = {
    name: 'PaymentTypeSyncDate',
    properties: {
        lastPaymentTypeSync: 'date',
    }
};
  