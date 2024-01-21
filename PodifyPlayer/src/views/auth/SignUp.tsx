import AuthInputField from '@components/form/AuthInputField';
import Form from '@components/form';
import colors from '@utils/colors';
import React, {FC} from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import * as yup from 'yup';
import SubmitBtn from '@components/form/SubmitBtn';

interface Props {}

const signUpSchema = yup.object({
  name: yup
    .string()
    .trim('Name Is Missing')
    .min(3, 'Invalid Name')
    .required('Name Is Required'),
  email: yup
    .string()
    .trim('Email Is Missing')
    .email('Invalid Email')
    .required('Email Is Required'),
  password: yup
    .string()
    .trim('Password Is Missing')
    .min(8, 'Password Is Too Short!')
    .matches(
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#\$%\^&\*])[a-zA-Z\d!@#\$%\^&\*]+$/,
      'Password Is Too Simple',
    )
    .required('Password Is Required'),
});

const initialValues = {
  name: '',
  email: '',
  password: '',
};

const SignUp: FC<Props> = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Form
        onSubmit={values => {
          console.log(values);
        }}
        initialValues={initialValues}
        validationSchema={signUpSchema}>
        <View style={styles.formContainer}>
          <AuthInputField
            name="name"
            placeholder="John Doe"
            label="Name"
            containerStyle={styles.marginBottom}
          />
          <AuthInputField
            name="email"
            placeholder="John@email.com"
            label="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            containerStyle={styles.marginBottom}
          />
          <AuthInputField
            name="password"
            placeholder="********"
            label="Password"
            autoCapitalize="none"
            secureTextEntry
          />
          <SubmitBtn title="SignUp" />
        </View>
      </Form>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: colors.PRIMARY,
  },
  formContainer: {
    width: '100%',
    paddingHorizontal: 15,
  },
  marginBottom: {
    marginBottom: 20,
  },
});

export default SignUp;
