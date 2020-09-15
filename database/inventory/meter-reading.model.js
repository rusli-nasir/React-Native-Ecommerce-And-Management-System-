export const MeterReadingSchema = {
    name: 'MeterReading',
    properties: {
        id: { type: 'int', optional: true },
        meter_reading_id: { type: 'string', optional: true },
        kiosk_id: { type: 'int', optional: true },
        meter_value: { type: 'double', optional: true },
        active: { type: 'bool', optional: true },
        syncAction: { type: 'string', optional: true },
        created_at: { type: 'date', optional: true },
        updated_at: { type: 'date', optional: true },
    }
};

export const MeterReadingSyncDateSchema = {
    name: 'MeterReadingSyncDate',
    properties: {
        lastMeterReadingSync: 'date',
    }
};
