import CreditRealm from '../../database/credit/credit.operations';
import CreditApi from '../api/credit.api';
import * as _ from 'lodash';
import SyncUtils from './syncUtils';
class CreditSync {

    synchronizeCredits(kiosk_id) {
        return new Promise(resolve => {
            CreditApi.getTopUps(kiosk_id, CreditRealm.getLastCreditSync())
                .then(async remoteCredit => {

                    let initlocalCredits = CreditRealm.getAllCreditByDate(CreditRealm.getLastCreditSync());
                    let localCredits = initlocalCredits.length > 0 ?  [...initlocalCredits] : [];
                    let remoteTopUps = remoteCredit.topup.length > 0 ?  [...remoteCredit.topup] : [];

                    let onlyInLocal = localCredits.filter(SyncUtils.compareRemoteAndLocal(remoteTopUps,'top_up_id'));
                    let onlyInRemote = remoteTopUps.filter(SyncUtils.compareRemoteAndLocal(localCredits,'top_up_id'));

                    let syncResponseArray = [];
                    if (onlyInRemote.length > 0) {
                        let localResponse = await CreditRealm.createManycredits(onlyInRemote);
                        syncResponseArray.push(...localResponse);
                        CreditRealm.setLastCreditSync();
                    }


                    if (onlyInLocal.length > 0) {

                        for (const property in onlyInLocal) {
                            let syncResponse = await this.apiSyncOperations({...onlyInLocal[property], kiosk_id});
                            syncResponseArray.push(syncResponse);
                        }

                    }


                    resolve({
                        success: syncResponseArray.length > 0 ? syncResponseArray[0].status : 'success',
                        topups: onlyInLocal.concat(onlyInRemote).length,
                        successError: syncResponseArray.length > 0 ? syncResponseArray[0].status : 'success',
                        successMessage: syncResponseArray.length > 0 ? syncResponseArray[0] : 'success'
                    });

                })
                .catch(error => {

                    resolve({
						error: false,
                        topups: 0,
					});
                });
        });
    }

    apiSyncOperations(localCredit) {
        return new Promise(resolve => {

        if (localCredit.synched === true && localCredit.syncAction === 'delete') {
            CreditApi.deleteTopUp(
                localCredit
            )
                .then((response) => {

                    CreditRealm.setLastCreditSync();
                    resolve({ status: 'success', message: response, data: localCredit });
                })
                .catch(error => {

                    return { status: 'fail', message: error, data: localCredit }
                });
        }

        if (localCredit.synched === true && localCredit.syncAction === 'update') {
            CreditApi.updateCustomerCredit(
                localCredit
            )
                .then((response) => {
                    // updateCount = updateCount + 1;
                    CreditRealm.setLastCreditSync();

                    resolve({ status: 'success', message: 'synched to remote', data: localCredit });

                })
                .catch(error => {

                    resolve({ status: 'fail', message: error, data: localCredit });
                });

        }

        if (localCredit.synched === false && localCredit.syncAction === 'update') {
            CreditApi.createTopUp(
                localCredit
            )
                .then((response) => {
                    // updateCount = updateCount + 1;
                    CreditRealm.synched(localCredit);
                    CreditRealm.setLastCreditSync();

                    resolve({ status: 'success', message: 'synched to remote', data: localCredit });

                })
                .catch(error => {

                    resolve({ status: 'fail', message: 'error', data: localCredit });
                });
        }

        if (localCredit.synched === false && localCredit.syncAction === 'delete') {
            CreditApi.createTopUp(
                localCredit
            )
                .then((response) => {
                    //  updateCount = updateCount + 1;
                    CreditRealm.synched(localCredit);
                    CreditRealm.setLastCreditSync();

                    resolve({ status: 'success', message: 'synched to remote', data: localCredit });
                })
                .catch(error => {
                   console.log(error);
                    resolve({ status: 'fail', message: 'error', data: localCredit });
                });
        }

        if (localCredit.synched === false && localCredit.syncAction === 'create') {
            CreditApi.createTopUp(
                localCredit
            )
                .then((response) => {
                    //  updateCount = updateCount + 1;
                    CreditRealm.synched(localCredit);
                    CreditRealm.setLastCreditSync();

                    resolve({ status: 'success', message: 'synched to remote', data: localCredit });
                })
                .catch(error => {

                    resolve({ status: 'fail', message: 'error', data: localCredit });
                });
        }

    });
    }


}
export default new CreditSync();
