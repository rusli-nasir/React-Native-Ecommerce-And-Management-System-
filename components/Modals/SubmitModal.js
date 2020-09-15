import React, {useState} from 'react';
import Modal from 'react-native-modal';
import {Button, Text, View, StyleSheet} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import Modal1 from './Modal1';
import Modal2 from './Modal2';
import {TextInput, ScrollView} from 'react-native-gesture-handler';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function Modals({toggleModal, isModalVisible}) {
  const [date, setDate] = useState(new Date(1598051730000));
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  // const showTimepicker = () => {
  //   showMode('time');
  // };

  const [isModalVisible1, setModalVisible1] = useState(false);
  const [isModalVisible2, setModalVisible2] = useState(false);

  const [toggleCheckBox1, setToggleCheckBox1] = useState(false);
  const [toggleCheckBox2, setToggleCheckBox2] = useState(false);
  const [toggleCheckBox3, setToggleCheckBox3] = useState(false);
  const [toggleCheckBox4, setToggleCheckBox4] = useState(false);
  const [toggleCheckBox5, setToggleCheckBox5] = useState(false);
  const [delivery, setDelivery] = useState(false);
  const [WalkIn, setWalkIn] = useState(false);

  let values = [
    {id: '1', item: 'Cash', isChecked: false},
    {id: '2', item: 'Mobile', isChecked: false},
    {id: '3', item: 'Cheque', isChecked: false},
    {id: '4', item: 'Bank Transfer', isChecked: false},
    {id: '5', item: 'Card', isChecked: false},
  ];

  const toggleModal1 = () => {
    setModalVisible1(!isModalVisible1);
  };

  const toggleModal2 = () => {
    setModalVisible2(!isModalVisible2);
  };

  // const Check = ({item}) => (
  //   <View
  //     style={{
  //       flexDirection: 'row',
  //       width: 500,
  //     }}>
  //     <CheckBox
  //       value={toggleCheckBox}
  //       onValueChange={(newValue) => setToggleCheckBox(newValue)}
  //     />
  //     <Text>{item.item}</Text>
  //     <View style={{paddingLeft: 200}}>
  //       <TextInput
  //         placeholder=""
  //         editable={toggleCheckBox}
  //         autoFocus={toggleCheckBox}
  //       />
  //     </View>
  //   </View>
  // );

  return (
    <View>
      <Modal isVisible={isModalVisible} onBackdropPress={toggleModal}>
        <ScrollView>
          <Modal1
            isModalVisible1={isModalVisible1}
            toggleModal1={toggleModal1}
          />
          <Modal2
            isModalVisible2={isModalVisible2}
            toggleModal2={toggleModal2}
          />
          <View style={styles.container}>
            <View>
              <View style={styles.row1}>
                <Text style={styles.text}>Sales Amount Due</Text>
                <Text style={styles.text}>Customer Wallet</Text>
              </View>
              <View style={styles.row1}>
                <Text style={styles.text}>Loan Balance</Text>
                <Text style={styles.text}>Total Amount Due</Text>
              </View>
            </View>
            <View>
              <View style={{marginHorizontal: '5%'}}>
                <View style={{alignItems: 'flex-start'}}>
                  <Text style={styles.text}>Payment Method</Text>
                </View>
                <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                  <>
                    {/* {values.map((item) => {
                      return <Check key={item.id} item={item} />;
                    })} */}
                    <View
                      style={{
                        flexDirection: 'row',
                        width: 500,
                      }}>
                      <CheckBox
                        value={toggleCheckBox1}
                        onValueChange={(newValue) =>
                          setToggleCheckBox1(newValue)
                        }
                      />
                      <Text>Cash</Text>
                      <View style={{paddingLeft: 200}}>
                        <TextInput
                          placeholder="..."
                          editable={toggleCheckBox1}
                          autoFocus={toggleCheckBox1}
                        />
                      </View>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        width: 500,
                      }}>
                      <CheckBox
                        value={toggleCheckBox2}
                        onValueChange={(newValue) =>
                          setToggleCheckBox2(newValue)
                        }
                      />
                      <Text>Mobile</Text>
                      <View style={{paddingLeft: 200}}>
                        <TextInput
                          placeholder="..."
                          editable={toggleCheckBox2}
                          autoFocus={toggleCheckBox2}
                        />
                      </View>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        width: 500,
                      }}>
                      <CheckBox
                        value={toggleCheckBox3}
                        onValueChange={(newValue) =>
                          setToggleCheckBox3(newValue)
                        }
                      />
                      <Text>Cheque</Text>
                      <View style={{paddingLeft: 200}}>
                        <TextInput
                          placeholder="..."
                          editable={toggleCheckBox3}
                          autoFocus={toggleCheckBox3}
                        />
                      </View>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        width: 500,
                      }}>
                      <CheckBox
                        value={toggleCheckBox4}
                        onValueChange={(newValue) =>
                          setToggleCheckBox4(newValue)
                        }
                      />
                      <Text>Bank Transfer</Text>
                      <View style={{paddingLeft: 200}}>
                        <TextInput
                          placeholder="..."
                          editable={toggleCheckBox4}
                          autoFocus={toggleCheckBox4}
                        />
                      </View>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        width: 500,
                      }}>
                      <CheckBox
                        value={toggleCheckBox5}
                        onValueChange={(newValue) =>
                          setToggleCheckBox5(newValue)
                        }
                      />
                      <Text>Card</Text>
                      <View style={{paddingLeft: 200}}>
                        <TextInput
                          placeholder="..."
                          editable={toggleCheckBox5}
                          autoFocus={toggleCheckBox5}
                        />
                      </View>
                    </View>
                  </>
                </View>
              </View>
            </View>

            <View style={{alignItems: 'center'}}>
              <Text style={styles.text}>Delivery Mode</Text>
            </View>

            <View style={styles.buttons}>
              <View style={styles.checkboxContainer}>
                <CheckBox
                  value={delivery}
                  onValueChange={(newValue) => setDelivery(newValue)}
                />
                <Text>Delivery</Text>
              </View>
              <View style={styles.checkboxContainer}>
                <CheckBox
                  value={WalkIn}
                  onValueChange={(newValue) => setWalkIn(newValue)}
                />
                <Text>Walk In</Text>
              </View>
              <Button title="Bottles Returned" onPress={toggleModal1} />
              <Button title="Additional Notes" onPress={toggleModal2} />
            </View>
            <View style={styles.buttons2}>
              <Text style={styles.text}>Are you recording an old sale ?</Text>
              <Button onPress={showDatepicker} title=" change reciept date" />
              {/* <Button onPress={showTimepicker} title="Show time picker!" /> */}
            </View>
            <View style={styles.btn}>
              <Button title="Check Out" />
            </View>
          </View>
          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode={mode}
              is24Hour={true}
              display="default"
              onChange={onChange}
            />
          )}
        </ScrollView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'space-around',
  },
  btn: {
    padding: 20,
  },
  row1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: '2%',
    backgroundColor: '#83b9e6',
    height: 50,
    borderWidth: 0.6,
    borderColor: 'gray',
    marginTop: 5,
  },
  text: {
    fontWeight: 'bold',
  },
  buttons: {
    flexDirection: 'row',
    marginHorizontal: '5%',
    justifyContent: 'space-between',
    padding: 20,
  },
  buttons2: {
    flexDirection: 'row',
    marginHorizontal: '26%',
    justifyContent: 'space-between',
  },
  checkboxContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  checkbox: {
    alignSelf: 'center',
  },
});
