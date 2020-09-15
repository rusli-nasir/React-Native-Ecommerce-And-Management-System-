export const SalesChannelSchema = {
    name: 'SalesChannel',
    properties: {
        id: { type: 'int', optional: true },
        description: 'string',
        name: { type: 'string' },
        active: { type: 'bool', optional: true },
        syncAction: { type: 'string', optional: true },
        created_at: { type: 'date', optional: true },
        updated_at: { type: 'date', optional: true },
    }
};

export const SalesChannelSyncDateSchema = {
    name: 'SalesChannelSyncDate',
    properties: {
        lastSalesChannelSync: 'date',
    }
};
 