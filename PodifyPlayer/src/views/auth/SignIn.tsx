import AuthFormContainer from '@components/AuthFormContainer';
import Form from '@components/form';
import AuthInputField from '@components/form/AuthInputField';
import SubmitBtn from '@components/form/SubmitBtn';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import AppLink from '@ui/AppLink';
import PassWordVisibilityIcon from '@ui/PassWordVisibilityIcon';
import React, {FC, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {AuthStackParamList} from 'src/@Types/navigation';
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

const initialValues = {
  email: '',
  password: '',
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const SignIn: FC<Props> = props => {
  const [secureEntry, setSecureEntry] = useState(true);
  const navigation = useNavigation<NavigationProp<AuthStackParamList>>();

  return (
    <Form
      onSubmit={values => {
        console.log(values);
      }}
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
