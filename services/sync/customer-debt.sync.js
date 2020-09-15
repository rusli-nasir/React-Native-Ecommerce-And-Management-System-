import CustomerDebtRealm from '../../database/customer_debt/customer_debt.operations';
import CustomerDebtApi from '../api/customer-debt.api';
import SyncUtils from './syncUtils';
import * as _ from 'lodash';
class CustomerDebtsSync {

    synchronizeCustomerDebts(kiosk_id) {
        return new Promise(resolve => {
            CustomerDebtApi.getCustomerDebts(kiosk_id, CustomerDebtRealm.getLastCustomerDebtSync())
                .then(async result => {

                    let initlocalCustomerDebts = CustomerDebtRealm.getCustomerDebtsByDate(CustomerDebtRealm.getLastCustomerDebtSync());

                    let localCustomerDebts = initlocalCustomerDebts.length > 0 ? [...initlocalCustomerDebts] : [];
                    let remoteCustomerDebts = result.length > 0 ? [...result] : [];


                    let onlyInLocal = localCustomerDebts.filter(SyncUtils.compareRemoteAndLocal(remoteCustomerDebts, 'customer_debt_id'));
                    let onlyInRemote = remoteCustomerDebts.filter(SyncUtils.compareRemoteAndLocal(localCustomerDebts, 'customer_debt_id'));

                    let syncResponseArray = [];

                    if (onlyInRemote.length > 0) {
                        let localResponse = await CustomerDebtRealm.syncManyCustomerDebt(onlyInRemote);
                        syncResponseArray.push(...localResponse);
                        CustomerDebtRealm.setLastCustomerDebtSync();
                    }


                    if (onlyInLocal.length > 0) {

                        for (const property in onlyInLocal) {
                            let syncResponse = await this.apiSyncOperations({ ...onlyInLocal[property], kiosk_id });
                            syncResponseArray.push(syncResponse);
                        }

                    }

                    resolve({
                        success: syncResponseArray.length > 0 ? syncResponseArray[0].status : 'success',
                        debt: onlyInLocal.concat(onlyInRemote).length,
                        successError: syncResponseArray.length > 0 ? syncResponseArray[0].status : 'success',
                        successMessage: syncResponseArray.length > 0 ? syncResponseArray[0] : 'success'
                    });



                })
                .catch(error => {

                    resolve({
                        error: true,
                        debt: 0
                    });
                });
        });
    }


    apiSyncOperations(localCustomerDebt) {

        return new Promise(resolve => {
            if (localCustomerDebt.synched === true && localCustomerDebt.syncAction === 'delete') {
                CustomerDebtApi.deleteCustomerDebt(
                    localCustomerDebt
                )
                    .then((response) => {

                        CustomerDebtRealm.setLastCustomerDebtSync();
                        resolve({ status: 'success', message: 'synched', data: localCustomerDebt });
                    })
                    .catch(error => {

                        resolve({ status: 'fail', message: 'error', data: localCustomerDebt });
                    });
            }

            if (localCustomerDebt.synched === true && localCustomerDebt.syncAction === 'update') {
                CustomerDebtApi.updateCustomerDebt(
                    localCustomerDebt
                )
                    .then((response) => {
                        // updateCount = updateCount + 1;
                        CustomerDebtRealm.setLastCustomerDebtSync();

                        resolve({ status: 'success', message: 'synched', data: localCustomerDebt });
                    })
                    .catch(error => {

                        resolve({ status: 'fail', message: 'error', data: localCustomerDebt });
                    });

            }

            if ((localCustomerDebt.synched === false || localCustomerDebt.synched === null) && localCustomerDebt.syncAction === 'update') {
                CustomerDebtApi.createCustomerDebt(
                    localCustomerDebt
                )
                    .then((response) => {
                        // updateCount = updateCount + 1;
                        CustomerDebtRealm.synched(localCustomerDebt);
                        CustomerDebtRealm.setLastCustomerDebtSync();

                        resolve({ status: 'success', message: 'synched', data: localCustomerDebt });
                    })
                    .catch(error => {

                        resolve({ status: 'fail', message: 'error', data: localCustomerDebt });
                    });
            }

            if ((localCustomerDebt.synched === false || localCustomerDebt.synched === null) && localCustomerDebt.syncAction === 'delete') {
                CustomerDebtApi.createCustomerDebt(
                    localCustomerDebt
                )
                    .then((response) => {
                        //  updateCount = updateCount + 1;
                        CustomerDebtRealm.synched(localCustomerDebt);
                        CustomerDebtRealm.setLastCustomerDebtSync();

                        resolve({ status: 'success', message: 'synched', data: localCustomerDebt });
                    })
                    .catch(error => {

                        resolve({ status: 'fail', message: 'error', data: localCustomerDebt });
                    });
            }

            if ((localCustomerDebt.synched === false || localCustomerDebt.synched === null) && localCustomerDebt.syncAction === 'create') {
                CustomerDebtApi.createCustomerDebt(
                    localCustomerDebt
                )
                    .then((response) => {
                        //  updateCount = updateCount + 1;
                        CustomerDebtRealm.synched(localCustomerDebt);
                        CustomerDebtRealm.setLastCustomerDebtSync();

                        resolve({ status: 'success', message: 'synched', data: localCustomerDebt });
                    })
                    .catch(error => {

                        resolve({ status: 'error', message: 'error', data: localCustomerDebt });
                    });
            }

        })

    }

}
export default new CustomerDebtsSync();
