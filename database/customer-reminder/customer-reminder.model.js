export const CustomerReminderSchema = {
    name: 'CustomerReminder',
    properties: {
        id: { type: 'int', optional: true },
        kiosk_id: { type: 'int', optional: true },
        reminder_id:  { type: 'string', optional: true },
        customer_account_id:  { type: 'string', optional: true },
        frequency: { type: 'int', optional: true },
        phone_number:  { type: 'string', optional: true },
        address:  { type: 'string', optional: true },
        name:  { type: 'string', optional: true },
        reminder_date:  { type: 'date', optional: true },
        active: { type: 'bool', optional: true },
        last_purchase_date:  { type: 'date', optional: true },
        custom_reminder_date:  { type: 'date', optional: true },
        syncAction: { type: 'string', optional: true },
        created_at: { type: 'date', optional: true },  
        updated_at: { type: 'date', optional: true },
    }
};


export const CustomerReminderSyncDateSchema = {
    name: 'CustomerReminderSyncDate',
    properties: {
        lastCustomerReminderSync: 'date',
    }
};