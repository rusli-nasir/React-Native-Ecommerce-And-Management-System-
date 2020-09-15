export const DiscountSchema = {
    name: 'Discount',
    properties: {
        id: { type: 'int', optional: true },
        applies_to: { type: 'string', optional: true },
        start_date: { type: 'date', optional: true },
        end_date: { type: 'date', optional: true },
        base64encoded_image: { type: 'string', optional: true },
        product_id:{ type: 'int', optional: true },
        region_id: { type: 'int', optional: true },
        isSelected: { type: 'bool', optional: true, default: false },
        amount: { type: 'double', optional: true },
        kiosk_id: { type: 'int', optional: true },
        sku: { type: 'string', optional: true },
        type: { type: 'string', optional: true },
        active: { type: 'bool', optional: true },
        syncAction: { type: 'string', optional: true },
        created_at: { type: 'date', optional: true },
        updated_at: { type: 'date', optional: true },
    }
};


export const DiscountSyncDateSchema = {
    name: 'DiscountSyncDate',
    properties: {
        lastDiscountSync: 'date',
    }
};
