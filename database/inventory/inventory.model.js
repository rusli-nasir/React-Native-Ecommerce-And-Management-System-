export const InventorySchema = {
    name: 'Inventory',
    properties: {
        id: { type: 'int', optional: true },
        closingStockId: { type: 'string', optional: true },
        kiosk_id: { type: 'int', optional: true },
        wastageName: { type: 'string', optional: true },
        inventory: { type: 'int', optional: true },
        product_id: { type: 'string', optional: true },
        quantity: { type: 'int', optional: true },
        notDispatched: { type: 'int', optional: true },
        active: { type: 'bool', optional: true },
        syncAction: { type: 'string', optional: true },
        created_at: { type: 'date', optional: true },
        updated_at: { type: 'date', optional: true },
    }
};

export const InventorySyncDateSchema = {
    name: 'InventorySyncDate',
    properties: {
        lastInventorySync: 'date',
    }
};
