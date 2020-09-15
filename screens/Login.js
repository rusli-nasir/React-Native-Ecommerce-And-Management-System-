import React, {useContext, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Button,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import * as yup from 'yup';
import {Formik} from 'formik';

const validationSchema = yup.object().shape({
  username: yup.string().required('Username Field Is Empty'),
  password: yup
    .string()
    .required('Password Field Is empty')
    .min(5, 'A minimum of 6 Chars is Required'),
});

const StylesInput = ({props, formikKey, ...rest}) => {
  const inputstyles = {
    width: '80%',
    borderRadius: 25,
    height: 50,
    justifyContent: 'center',
    padding: 20,
    borderWidth: 0.5,
    borderColor: 'black',
  };

  if (props.touched[formikKey] && props.errors[formikKey]) {
    inputstyles.borderColor = 'red';
  }

  return (
    <>
      <View style={inputstyles}>
        <TextInput
          style={styles.inputText}
          placeholderTextColor="#003f5c"
          onChangeText={props.handleChange(formikKey)}
          value={props.values.formikKey}
          onBlur={props.handleBlur(formikKey)}
          {...rest}
        />
      </View>
      <Text style={{color: 'red', paddingBottom: 20}}>
        {props.touched[formikKey] && props.errors[formikKey]}
      </Text>
    </>
  );
};

export default function Login() {
  // const [data, setData] = useState(null);

  const auth = useContext(ProductContext);

  return (
    <Formik
      initialValues={{username: 'training', password: "Let'sGrow"}}
      onSubmit={(values) => auth.login(values)}
      validationSchema={validationSchema}>
      {(props) => (
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
          }}>
          <View style={styles.container}>
            <>
              <StylesInput
                props={props}
                formikKey="username"
                placeholder="username"
              />
              <StylesInput
                props={props}
                formikKey="password"
                placeholder="Password"
                secureTextEntry
              />
            </>
            {/* {props.isSubmitting ? (
              <ActivityIndicator />
            ) : ( */}
            <TouchableOpacity
              style={styles.loginBtn}
              onPress={props.handleSubmit}>
              <Text style={styles.loginText}>LOGIN</Text>
            </TouchableOpacity>
            {/* )} */}
          </View>
        </TouchableWithoutFeedback>
      )}
    </Formik>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    fontWeight: 'bold',
    fontSize: 50,
    color: '#fb5b5a',
    marginBottom: 40,
  },

  inputText: {
    height: 50,
    color: '#003f5c',
  },
  forgot: {
    color: 'white',
    fontSize: 11,
  },
  loginBtn: {
    width: '80%',
    backgroundColor: '#4f86e3',
    // backgroundColor: "#196fe0",
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 13,
    marginBottom: 10,
  },
  loginText: {
    color: 'white',
    letterSpacing: 2,
    fontSize: 15,
    fontWeight: 'bold',
  },
});
