export const CustomerTypesSchema = {
    name: 'CustomerType',
    properties: {
        id: { type: 'int', optional: true },
        description: { type: 'string', optional: true },
        name: { type: 'string', optional: true },
        salesChannelId: { type: 'int', optional: true },
        salesChannelName: { type: 'string', optional: true },
        active: { type: 'bool', optional: true },
        syncAction: { type: 'string', optional: true },
        created_at: { type: 'date', optional: true },
        updated_at: { type: 'date', optional: true },
    }
};

export const CustomerTypesSyncDateSchema = {
    name: 'CustomerTypesSyncDate',
    properties: {
        lastCustomerTypesSync: 'date',
    }
};
  