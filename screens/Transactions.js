import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  SectionList,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';

import CreditRealm from '../database/credit/credit.operations';
import CustomerDebtRealm from '../database/customer_debt/customer_debt.operations';
import ProductsRealm from '../database/products/product.operations';

import ReceiptPaymentTypeRealm from '../database/reciept_payment_types/reciept_payment_types.operations';
import PaymentTypeRealm from '../database/payment_types/payment_types.operations';

import CustomerRealm from '../database/customers/customer.operations';
import OrderRealm from '../database/orders/orders.operations';
import SettingRealm from '../database/settings/settings.operations';
import Synchronization from '../services/Synchronization';
import {format, parseISO, isBefore} from 'date-fns';
import Details from '../components/Details';
const windowWidth = Dimensions.get('window').width;
export default function Transactions() {
  const clearDetail = () => setDetail(null);

  const [detail, setDetail] = useState(null);
  const [sectionData, setSectionData] = useState([]);

  useEffect(() => {
    const data = prepareSectionedData();
    setSectionData(data);
  }, []);

  const prepareCustomerDebt = () => {
    let debtArray = CustomerDebtRealm.getCustomerDebtsTransactions();
    const totalCount = debtArray.length;

    let debtPayment = debtArray.map((receipt, index) => {
      return {
        active: receipt.active,
        synched: receipt.synched,
        notes: receipt.notes,
        id: receipt.customer_debt_id,
        customer_debt_id: receipt.customer_debt_id,
        receiptId: receipt.receipt_id,
        createdAt: receipt.created_at,
        sectiontitle: format(parseISO(receipt.created_at), 'iiii d MMM yyyy'),
        customerAccount: CustomerRealm.getCustomerById(
          receipt.customer_account_id,
        )
          ? CustomerRealm.getCustomerById(receipt.customer_account_id)
          : receipt.customer_account_id,
        receiptLineItems: undefined,
        paymentTypes: undefined,
        description: [{amount: receipt.due_amount, name: 'cash'}],
        isLocal: receipt.isLocal || false,
        key: null,
        index,
        updated: receipt.updated_at,
        // is_delete: receipt.is_delete,
        // amountLoan: receipt.amount_loan,
        totalCount,
        // currency: receipt.currency_code,
        isReceipt: false,
        isDebt: true,
        isTopUp: false,
        type: 'Debt Payment',
        totalAmount: receipt.due_amount,
        balance: receipt.balance,
      };
    });

    debtPayment.sort((a, b) => {
      return isBefore(new Date(a.createdAt), new Date(b.createdAt)) ? 1 : -1;
    });
    return [...debtPayment];
  };

  const prepareTopUpData = () => {
    // Used for enumerating receipts
    let creditArray = CreditRealm.getCreditTransactions();
    const totalCount = creditArray.length;
    let topups = creditArray.map((receipt, index) => {
      return {
        active: receipt.active,
        synched: receipt.synched,
        id: receipt.top_up_id,
        top_up_id: receipt.top_up_id,
        notes: receipt.notes,
        receiptId: receipt.receipt_id,
        createdAt: receipt.created_at,
        sectiontitle: format(parseISO(receipt.created_at), 'iiii d MMM yyyy'),
        customerAccount: CustomerRealm.getCustomerById(
          receipt.customer_account_id,
        )
          ? CustomerRealm.getCustomerById(receipt.customer_account_id)
          : receipt.customer_account_id,
        receiptLineItems: undefined,
        paymentTypes: undefined,
        description: [{amount: receipt.due_amount, name: 'cash'}],
        isLocal: receipt.isLocal || false,
        key: null,
        index,
        updated: receipt.updated_at,
        // is_delete: receipt.is_delete,
        // amountLoan: receipt.amount_loan,
        totalCount,
        // currency: receipt.currency_code,
        isReceipt: false,
        isDebt: false,
        isTopUp: true,
        type: 'Top Up',
        balance: receipt.balance,
        totalAmount: receipt.topup,
      };
    });

    topups.sort((a, b) => {
      return isBefore(new Date(a.createdAt), new Date(b.createdAt)) ? 1 : -1;
    });
    return [...topups];
  };

  const comparePaymentTypes = () => {
    let receiptsPaymentTypes = ReceiptPaymentTypeRealm.getReceiptPaymentTypes();
    let paymentTypes = PaymentTypeRealm.getPaymentTypes();

    let finalreceiptsPaymentTypes = [];

    for (let receiptsPaymentType of receiptsPaymentTypes) {
      const rpIndex = paymentTypes
        .map(function (e) {
          return e.id;
        })
        .indexOf(receiptsPaymentType.payment_type_id);
      if (rpIndex >= 0) {
        receiptsPaymentType.name = paymentTypes[rpIndex].name;
        finalreceiptsPaymentTypes.push(receiptsPaymentType);
      }
    }
    return finalreceiptsPaymentTypes;
  };

  const comparePaymentTypeReceipts = () => {
    let receiptsPaymentTypes = comparePaymentTypes();
    let customerReceipts = OrderRealm.getAllOrder();
    let finalCustomerReceiptsPaymentTypes = [];
    for (let customerReceipt of customerReceipts) {
      let paymentTypes = [];
      for (let receiptsPaymentType of receiptsPaymentTypes) {
        if (receiptsPaymentType.receipt_id === customerReceipt.id) {
          paymentTypes.push(receiptsPaymentType);
        }
      }
      customerReceipt.paymentTypes = paymentTypes;
      finalCustomerReceiptsPaymentTypes.push(customerReceipt);
    }
    return finalCustomerReceiptsPaymentTypes;
  };
  const prepareData = () => {
    // Used for enumerating receipts
    const totalCount = OrderRealm.getAllOrder().length;

    let receipts = comparePaymentTypeReceipts().map((receipt, index) => {
      return {
        active: receipt.active,
        synched: receipt.synched,
        id: receipt.id,
        receiptId: receipt.id,
        createdAt: receipt.created_at,
        topUp: CreditRealm.getCreditByRecieptId(receipt.id),
        debt: CustomerDebtRealm.getCustomerDebtByRecieptId(receipt.id),
        isDebt:
          CustomerDebtRealm.getCustomerDebtByRecieptId(receipt.id) === undefined
            ? false
            : true,
        isTopUp:
          CreditRealm.getCreditByRecieptId(receipt.id) === undefined
            ? false
            : true,
        sectiontitle: format(parseISO(receipt.created_at), 'iiii d MMM yyyy'),
        //customerAccount: receipt.customer_account,
        customerAccount: CustomerRealm.getCustomerById(
          receipt.customer_account_id,
        )
          ? CustomerRealm.getCustomerById(receipt.customer_account_id)
          : receipt.customer_account_id,
        receiptLineItems: receipt.receipt_line_items,
        paymentTypes: receipt.paymentTypes,
        isLocal: receipt.isLocal || false,
        key: receipt.isLocal ? receipt.key : null,
        index,
        updated: receipt.updated,
        is_delete: receipt.is_delete,
        amountLoan: receipt.amount_loan,
        totalCount,
        currency: receipt.currency_code,
        isReceipt: true,
        type: 'Receipt',
        totalAmount: receipt.total,
        notes: receipt.notes,
      };
    });

    receipts.sort((a, b) => {
      return isBefore(new Date(a.createdAt), new Date(b.createdAt)) ? 1 : -1;
    });

    return [...receipts];
  };

  const groupBySectionTitle = (objectArray, property) => {
    return objectArray.reduce(function (acc, obj) {
      let key = obj[property];
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(obj);
      return acc;
    }, {});
  };

  const prepareSectionedData = () => {
    // Used for enumerating receipts
    let receipts = prepareData();
    let topups = prepareTopUpData();
    let deptPayment = prepareCustomerDebt();
    let finalArray = deptPayment
      .concat(topups)
      .concat(receipts)
      .sort((a, b) => {
        return isBefore(new Date(a.createdAt), new Date(b.createdAt)) ? 1 : -1;
      });

    let transformedarray = groupBySectionTitle(finalArray, 'sectiontitle');
    let newarray = [];
    for (let i of Object.getOwnPropertyNames(transformedarray)) {
      newarray.push({
        title: i,
        data: transformedarray[i],
      });
    }
    return newarray;
  };

  // const onSynchronize = () => {
  //   console.log('synched caldled');
  //   try {
  //     Synchronization.synchronize().then((syncResult) => {
  //       console.log('syncResult', syncResult);
  //     });
  //   } catch (error) {}
  // };
  //onSynchronize();

  if (sectionData.length === 0) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>Loading...</Text>
      </View>
    );
  } else {
    return (
      <React.Fragment>
        {/* <Text>Transactions Page</Text> */}
        <View style={styles.container}>
          <View style={styles.col_1}>
            <SectionList
              sections={sectionData}
              keyExtractor={(item) => item.id}
              renderItem={({item}) => {
                // console.log('item', item);
                return (
                  <>
                    <TouchableOpacity
                      style={{height: 60}}
                      onPress={() => {
                        setDetail(item);
                      }}>
                      {/* <Text style={{padding: 10, marginHorizontal: 10}}>
                        {item.currency_code}:
                        {parseFloat(item.price_total).toFixed(0)}
                      </Text> */}
                      <Text style={{textTransform: 'capitalize'}}>
                        {/* {item.isReceipt && item.customerAccount.name} */}
                        {item.isReceipt
                          ? item.customerAccount.name
                          : item.customerAccount.name}
                      </Text>
                    </TouchableOpacity>
                  </>
                );
              }}
              renderSectionHeader={({section: {title}}) => (
                <View
                  style={{
                    backgroundColor: '#94b5eb',
                    height: 40,
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text style={styles.header}>
                    {new Date(title).toDateString()}
                  </Text>
                </View>
              )}
            />
          </View>
          <View style={styles.col_2}>
            <Details detail={detail} clearDetail={clearDetail} />
          </View>
        </View>
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  col_1: {
    width: (40 / 100) * windowWidth,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    // marginHorizontal: 10,
    backgroundColor: '#fff',
    // paddingTop: 5,
  },
  col_2: {
    width: (60 / 100) * windowWidth,
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
    padding: 5,
    // marginHorizontal: 10,
    // alignItems: "center",
    // justifyContent: "center",
  },
  item: {
    backgroundColor: 'green',
    padding: 20,
    marginVertical: 8,
  },
  header: {
    // fontFamily: 'EncodeSansSemiExpanded_500Medium',
    marginHorizontal: 10,
    // justifyContent: "center",
  },
  listitem: {
    // fontFamily: 'EncodeSansSemiExpanded_300Light',
    // fontStyle: "italic",
  },
  title: {
    fontSize: 24,
  },
});
