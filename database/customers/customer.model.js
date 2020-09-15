export const CustomerSchema = {
    name: 'Customer',
    properties: {
        id: { type: 'string', optional: true },
        customerId: { type: 'string', optional: true },
        name: { type: 'string', optional: true },
        customerTypeId: { type: 'int', optional: true },
        salesChannelId: { type: 'int', optional: true },
        siteId: { type: 'int', optional: true },
        isSelected: { type: 'bool', optional: true },
        is_delete: { type: 'int', optional: true, default: 1 },
        reminder_date: { type: 'date', optional: true },
        frequency: { type: 'string', optional: true },
        dueAmount: { type: 'double', optional: true, default: 0 },
        walletBalance: { type: 'double', optional: true, default: 0 },
        address: { type: 'string', optional: true },
        gpsCoordinates: { type: 'string', optional: true },
        phoneNumber: { type: 'string', optional: true },
        //orders: { type: 'Order[]' },
        secondPhoneNumber: { type: 'string', optional: true },
        active: { type: 'bool', optional: true },
        syncAction: { type: 'string', optional: true },
        created_at: 'date',
        updated_at: 'date'
    }

};

export const CustomerSyncDateSchema = {
    name: 'CustomerSyncDate',
    properties: {
        lastCustomerSync: 'date',
    }
};

