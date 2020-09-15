import PaymentTypeRealm from '../../database/payment_types/payment_types.operations';
import PaymentTypeApi from '../api/payment-types.api';
import SyncUtils from './syncUtils';
import * as _ from 'lodash';

class PaymentTypeSync {
  synchronizePaymentTypes() {
    return new Promise((resolve) => {
      PaymentTypeApi.getPaymentTypes(PaymentTypeRealm.getLastPaymentTypeSync())
        .then(async (remotePaymentType) => {
          console.log('remotePaymentType', remotePaymentType);
          let initlocalPaymentTypes = PaymentTypeRealm.getPaymentTypesByDate(
            PaymentTypeRealm.getLastPaymentTypeSync(),
          );
          let localPaymentTypes =
            initlocalPaymentTypes.length > 0 ? [...initlocalPaymentTypes] : [];
          let remotePaymentTypes =
            remotePaymentType.length > 0 ? [...remotePaymentType] : [];

          let onlyInLocal = localPaymentTypes.filter(
            SyncUtils.compareRemoteAndLocal(remotePaymentTypes, 'id'),
          );
          let onlyInRemote = remotePaymentTypes.filter(
            SyncUtils.compareRemoteAndLocal(localPaymentTypes, 'id'),
          );

          let syncResponseArray = [];
          if (onlyInLocal.length > 0) {
            for (const property in onlyInLocal) {
            }
          }

          if (onlyInRemote.length > 0) {
            let localResponse = await PaymentTypeRealm.createManyPaymentTypes(
              onlyInRemote,
            );
            syncResponseArray.push(...localResponse);
            PaymentTypeRealm.setLastPaymentTypeSync();
          }

          resolve({
            success:
              syncResponseArray.length > 0
                ? syncResponseArray[0].status
                : 'success',
            paymentTypes: onlyInLocal.concat(onlyInRemote).length,
            successError:
              syncResponseArray.length > 0
                ? syncResponseArray[0].status
                : 'success',
            successMessage:
              syncResponseArray.length > 0 ? syncResponseArray[0] : 'success',
          });
        })
        .catch((error) => {
          resolve({
            error: error,
            paymentTypes: 0,
          });
        });
    });
  }
}
export default new PaymentTypeSync();
