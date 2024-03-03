/* eslint-disable react-native/no-inline-styles */
import AuthInputField from '@components/form/AuthInputField';
import Form from '@components/form';
import React, {FC, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import * as yup from 'yup';
import SubmitBtn from '@components/form/SubmitBtn';
import PassWordVisibilityIcon from '@ui/PassWordVisibilityIcon';
import AppLink from '@ui/AppLink';
import AuthFormContainer from '@components/AuthFormContainer';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {AuthStackParamList} from 'src/@Types/navigation';
import {FormikHelpers} from 'formik';
import client from 'src/api/client';
import {catchAsyncError} from 'src/api/catchError';
import {useDispatch} from 'react-redux';
import {updateNotification} from 'src/store/notification';

interface Props {}

interface NewUser {
  name: string;
  email: string;
  password: string;
}

const initialValues = {
  name: '',
  email: '',
  password: '',
};

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

const SignUp: FC<Props> = () => {
  const [secureEntry, setSecureEntry] = useState(true);
  const navigation = useNavigation<NavigationProp<AuthStackParamList>>();
  const dispatch = useDispatch();

  const handleSubmit = async (
    values: NewUser,
    actions: FormikHelpers<NewUser>,
  ) => {
    actions.setSubmitting(true);
    try {
      const {data} = await client.post('/auth/create', {
        ...values,
      });
      navigation.navigate('Verification', {userInfo: data.user});
      actions.setSubmitting(false);
    } catch (err) {
      const error = catchAsyncError(err);
      dispatch(updateNotification({message: error, type: 'error'}));
      console.log('Sign Up Error', err);
    }
  };

  return (
    <Form
      onSubmit={handleSubmit}
      initialValues={initialValues}
      validationSchema={signUpSchema}>
      <AuthFormContainer
        title="Welcome"
        subTitle="Lets's Get Started By creating Account">
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
            secureTextEntry={secureEntry}
            containerStyle={styles.marginBottom}
            rightIcon={<PassWordVisibilityIcon privateIcon={secureEntry} />}
            onRightIconPress={() => setSecureEntry(!secureEntry)}
          />
          <SubmitBtn title="SignUp" />
          <View style={styles.appLinkContainer}>
            <AppLink
              title="forget Password"
              onPress={() => {
                navigation.navigate('LostPassWord');
              }}
            />
            <AppLink
              title="Log In"
              onPress={() => {
                navigation.navigate('SignIn');
              }}
            />
          </View>
        </View>
      </AuthFormContainer>
    </Form>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    width: '100%',
  },
  marginBottom: {
    marginBottom: 20,
  },
  appLinkContainer: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default SignUp;
