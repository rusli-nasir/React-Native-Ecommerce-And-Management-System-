import InventroyRealm from '../../database/inventory/inventory.operations';
import MeterReadingApi from '../api/meter-reading.api';
import SyncUtils from './syncUtils';
import * as _ from 'lodash';

class MeterReadingSync {

    synchronizeMeterReading(kiosk_id) {
        return new Promise(resolve => {
            MeterReadingApi.getMeterReading(kiosk_id, InventroyRealm.getLastMeterReadingSync())
                .then(async remoteResult => {
                    let initlocalMeterReadings = InventroyRealm.getAllMeterReadingByDate(InventroyRealm.getLastMeterReadingSync());

                    let localMeterReadings = initlocalMeterReadings.length > 0 ? [...initlocalMeterReadings] : [];
                    let remoteMeterReading = remoteResult.length > 0 ? [...remoteResult] : [];

                    let onlyInLocal = localMeterReadings.filter(SyncUtils.compareRemoteAndLocal(remoteMeterReading, 'meter_reading_id'));
                    let onlyInRemote = remoteMeterReading.filter(SyncUtils.compareRemoteAndLocal(localMeterReadings, 'meter_reading_id'));

                    let syncResponseArray = [];

                    if (onlyInRemote.length > 0) {
                        let localResponse = await InventroyRealm.createManyMeterReading(onlyInRemote);
                        syncResponseArray.push(...localResponse);
                        InventroyRealm.setLastMeterReadingSync();
                    }


                    if (onlyInLocal.length > 0) {

                        for (const property in onlyInLocal) {
                            let syncResponse = await this.apiSyncOperations({
                                ...onlyInLocal[property],
                                kiosk_id
                            });
                            syncResponseArray.push(syncResponse);
                        }

                    }



                    for (const i in syncResponseArray) {
                        if (syncResponseArray[i].status === "fail" && syncResponseArray[i].message === "Meter Reading has already been sent") {
                            InventroyRealm.deleteByMeterId(syncResponseArray[i].data.meter_reading_id);
                        }
                    }

                    resolve({
                        success: syncResponseArray.length > 0 ? syncResponseArray[0].status : 'success',
                        meterReading: onlyInLocal.concat(onlyInRemote).length,
                        successError: syncResponseArray.length > 0 ? syncResponseArray[0].status : 'success',
                        successMessage: syncResponseArray.length > 0 ? syncResponseArray[0] : 'success'
                    });

                })
                .catch(error => {

                    resolve({
                        error: true,
                        message: error,
                        meterReading: 0,
                    });
                });


        });
    }


    apiSyncOperations(localMeterReading) {
        return new Promise(resolve => {

            if (localMeterReading.active === true && localMeterReading.syncAction === 'delete') {
                return MeterReadingApi.deleteMeterReading(
                    localMeterReading
                )
                    .then((response) => {

                        InventroyRealm.setLastMeterReadingSync();
                        resolve({ status: 'success', message: response, data: localMeterReading });
                    })
                    .catch(error => {

                        return { status: 'fail', message: error, data: localMeterReading }
                    });
            }

            if (localMeterReading.active === true && localMeterReading.syncAction === 'update') {

                return MeterReadingApi.updateMeterReading(
                    localMeterReading
                )
                    .then((response) => {
                        InventroyRealm.setLastMeterReadingSync();

                        resolve({ status: 'success', message: 'synched to remote', data: localMeterReading });
                    })
                    .catch(error => {

                        resolve({ status: 'fail', message: error, data: localMeterReading });
                    });

            }

            if (localMeterReading.active === false && localMeterReading.syncAction === 'update') {

                return MeterReadingApi.createMeterReading(
                    localMeterReading
                )
                    .then((response) => {
                        InventroyRealm.synchedMeterReading(localMeterReading);
                        InventroyRealm.setLastMeterReadingSync();

                        resolve({ status: 'success', message: 'synched to remote', data: localMeterReading });
                    })
                    .catch(error => {

                        resolve({ status: 'fail', message: error, data: localMeterReading });
                    });

            }

            if (localMeterReading.active === false && localMeterReading.syncAction === 'delete') {
                return MeterReadingApi.createMeterReading(
                    localMeterReading
                )
                    .then((response) => {
                        InventroyRealm.synchedMeterReading(localMeterReading);
                        InventroyRealm.setLastMeterReadingSync();

                        resolve({ status: 'success', message: response, data: localMeterReading });
                    })
                    .catch(error => {

                        return { status: 'fail', message: error, data: localMeterReading }
                    });

            }

            if (localMeterReading.active === false && localMeterReading.syncAction === 'create') {

                return MeterReadingApi.createMeterReading(
                    localMeterReading
                )
                    .then((response) => {
                        InventroyRealm.synchedMeterReading(localMeterReading);
                        InventroyRealm.setLastMeterReadingSync();

                        resolve({ status: 'success', message: 'synched to remote', data: localMeterReading });
                    })
                    .catch(error => {

                        resolve({ status: 'fail', message: error, data: localMeterReading })
                    });

            }

        });

    }


}
export default new MeterReadingSync();
