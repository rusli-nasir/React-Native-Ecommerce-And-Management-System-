import realm from '../init';
import { uuidv1 } from 'uuid';
// const uuidv1 = require('uuid/v1');

class ReminderRealm {
    constructor() {
        this.reminder = [];
    }

    truncate() {
        try {
            realm.write(() => {
                let reminders = realm.objects('Reminder');
                realm.delete(reminders);
            })
        } catch (e) {
        }
    }

    getReminders() {
        return Object.values(JSON.parse(JSON.stringify(realm.objects('Reminder'))));
    }

    initialise() {
        return this.getReminders();
    }

    formatDay(date) {
        date = new Date(date);
        var day = date.getDate(),
            month = date.getMonth() + 1,
            year = date.getFullYear();
        if (month.toString().length == 1) {
            month = "0" + month;
        }
        if (day.toString().length == 1) {
            day = "0" + day;
        }

        return date = year + '-' + month + '-' + day;
    }


    createReminder(reminder) {
        try {
            realm.write(() => {
                realm.create('Reminder', reminder);
            });
        } catch (e) {
        }
    }

    updateReminder(reminder) {
        try {
            realm.write(() => {
                let reminderObj = realm.objects('Reminder').filtered(`id = "${reminder.reminder_id}"`);
                reminderObj[0].reminder_id = reminder.reminder_id;
                reminderObj[0].name = reminder.name;

				reminderObj[0].frequency = reminder.frequency;
				reminderObj[0].show_reminders = reminder.show_reminders;
				reminderObj[0].reminder_date = reminder.reminder_date;
                reminderObj[0].syncAction = reminder.syncAction;
                reminderObj[0].created_at = reminder.created_at;
                reminderObj[0].updated_at = reminder.updated_at;

            })
        } catch (e) {
        }
    }

    resetSelected() {
        try {
            realm.write(() => {
                let reminderObj = realm.objects('Reminder');
                reminderObj.forEach(element => {
                    element.isSelected = false;
                })
            })
        } catch (e) {
        }
    }

    isSelected(reminder, isSelected) {
        try {
            realm.write(() => {
                let reminderObj = realm.objects('Reminder').filtered(`id = "${reminder.reminder_id}"`);
                reminderObj[0].isSelected = isSelected;

            })
        } catch (e) {
        }

    }

    synched(reminder) {
        try {
            realm.write(() => {
                let reminderObj = realm.objects('Reminder').filtered(`id = "${reminder.reminder_id}"`);
                reminderObj[0].active = true;
                reminderObj[0].syncAction = null;
            })
        } catch (e) {
        }
    }


    // Hard delete when active property is false or when active property and syncAction is delete
    hardDeleteReminder(reminder) {
        try {
            realm.write(() => {
                let reminders = realm.objects('Reminder');
                let deleteReminder = reminders.filtered(`id = "${reminder.reminder_id}"`);
                realm.delete(deleteReminder);
            })

        } catch (e) {
        }
    }

    softDeleteReminder(reminder) {
        try {
            realm.write(() => {
                realm.write(() => {
                    let reminderObj = realm.objects('Reminder').filtered(`id = "${reminder.reminder_id}"`);
                    reminderObj[0].syncAction = 'delete';
                })
            })
        } catch (e) {
        }
    }

    createManyReminder(reminders, customer_account_id) {
        try {
            realm.write(() => {
                if (customer_account_id) {
                    reminders.forEach(obj => {
                        realm.create('Reminder', {
                            customer_account_id: customer_account_id ? customer_account_id : null,
                            reminder_id: uuidv1(),
                            due_amount: obj.amount,
                            syncAction: obj.syncAction ? obj.syncAction : 'CREATE',
                            created_at: new Date(),
                            updated_at: obj.updated_at ? obj.updated_at : null,
                        });
                    });
                }
                if (!customer_account_id) {
                    reminders.forEach(obj => {
                        realm.create('Reminder', obj);
                    });
                }
            });
        } catch (e) {
        }
    }

}

export default new ReminderRealm();
