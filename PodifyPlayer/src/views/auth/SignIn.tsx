import AuthFormContainer from '@components/AuthFormContainer';
import Form from '@components/form';
import AuthInputField from '@components/form/AuthInputField';
import SubmitBtn from '@components/form/SubmitBtn';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import AppLink from '@ui/AppLink';
import PassWordVisibilityIcon from '@ui/PassWordVisibilityIcon';
import {Keys, saveToAsyncStorage} from '@utils/asyncStorage';
import {FormikHelpers} from 'formik';
import React, {FC, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {useDispatch} from 'react-redux';
import {AuthStackParamList} from 'src/@Types/navigation';
import client from 'src/api/client';
import {updateLoggedInState, updateProfile} from 'src/store/auth';
import * as yup from 'yup';

const LogInSchema = yup.object({
  email: yup
    .string()
    .trim('Email Is Missing')
    .email('Invalid Email')
    .required('Email Is Required'),
  password: yup
    .string()
    .trim('Password Is Missing')
    .min(8, 'Password Is Too Short!')
    .required('Password Is Required'),
});

interface Props {}

interface User {
  email: string;
  password: string;
}

const initialValues = {
  email: '',
  password: '',
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const SignIn: FC<Props> = props => {
  const [secureEntry, setSecureEntry] = useState(true);
  const navigation = useNavigation<NavigationProp<AuthStackParamList>>();
  const dispatch = useDispatch();

  const handleSubmit = async (values: User, actions: FormikHelpers<User>) => {
    actions.setSubmitting(true);
    try {
      const {data} = await client.post('auth/sign-in', {
        ...values,
      });
      console.log('SignIn', data);
      await saveToAsyncStorage(Keys.AUTH_TOKEN, data.token);
      dispatch(updateProfile(data.profile));
      dispatch(updateLoggedInState(true));
    } catch (error) {
      console.log('Lodged In Failed', error);
    }
    actions.setSubmitting(false);
  };

  return (
    <Form
      onSubmit={handleSubmit}
      initialValues={initialValues}
      validationSchema={LogInSchema}>
      <AuthFormContainer title="Welcome Back">
        <View style={styles.formContainer}>
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
          <SubmitBtn title="Log In" />
          <View style={styles.appLinkContainer}>
            <AppLink
              title="forget Password"
              onPress={() => {
                navigation.navigate('LostPassWord');
              }}
            />
            <AppLink
              title="Register"
              onPress={() => {
                navigation.navigate('SignUp');
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

export default SignIn;
