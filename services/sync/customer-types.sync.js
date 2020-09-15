import CustomerTypeRealm from '../../database/customer-types/customer-types.operations';
import CustomerTypeApi from '../api/customer-types.api';
import SyncUtils from './syncUtils';
import * as _ from 'lodash';

class CustomerTypeSync {

    synchronizeCustomerTypes() {
        return new Promise(resolve => {
            CustomerTypeApi.getCustomerTypes(CustomerTypeRealm.getLastCustomerTypesSync())
                .then(async remoteCustomerType => {
                    let initlocalCustomerTypes = CustomerTypeRealm.getCustomerTypesByDate(CustomerTypeRealm.getLastCustomerTypesSync());
                    let localCustomerTypes = initlocalCustomerTypes.length > 0 ?  [...initlocalCustomerTypes] : [];
                    let remoteCustomerTypes = remoteCustomerType.customerTypes.length > 0 ?  [...remoteCustomerType.customerTypes] : [];

                    let onlyInLocal = localCustomerTypes.filter(SyncUtils.compareRemoteAndLocal(remoteCustomerTypes,'id'));
                    let onlyInRemote = remoteCustomerTypes.filter(SyncUtils.compareRemoteAndLocal(localCustomerTypes,'id'));

                    let syncResponseArray = [];
                    if (onlyInLocal.length > 0) {
                        for (const property in onlyInLocal) {

                        }
                    }

                    if (onlyInRemote.length > 0) {
                        let localResponse = await CustomerTypeRealm.createManyCustomerTypes(onlyInRemote);
                        syncResponseArray.push(...localResponse);
                        CustomerTypeRealm.setLastCustomerTypesSync();
                    }

                    resolve({
                        success: syncResponseArray.length > 0 ? syncResponseArray[0].status : 'success',
                        customerTypes: onlyInLocal.concat(onlyInRemote).length,
                        successError: syncResponseArray.length > 0 ? syncResponseArray[0].status : 'success',
                        successMessage: syncResponseArray.length > 0 ? syncResponseArray[0] : 'success'
                    });

                })
                .catch(error => {

                    resolve({
                        error: error,
                        customerTypes: 0
                    });
                });
        });
    }

}
export default new CustomerTypeSync();
