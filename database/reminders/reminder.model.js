export const ReminderSchema = {
    name: 'Reminder',
    properties: {
        id: { type: 'int', optional: true },
        reminder_id:  { type: 'string', optional: true },
        customer_account_id:  { type: 'string', optional: true },
		frequency: { type: 'int', optional: true },
		show_reminders:  { type: 'string', optional: true },
		reminder_date:  { type: 'date', optional: true },
        active: { type: 'bool', optional: true },
        syncAction: { type: 'string', optional: true },
        created_at: { type: 'date', optional: true },
        updated_at: { type: 'date', optional: true },
    }
};
