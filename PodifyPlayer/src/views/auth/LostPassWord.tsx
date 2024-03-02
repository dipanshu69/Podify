import AuthFormContainer from '@components/AuthFormContainer';
import Form from '@components/form';
import AuthInputField from '@components/form/AuthInputField';
import SubmitBtn from '@components/form/SubmitBtn';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import AppLink from '@ui/AppLink';
import {FormikHelpers} from 'formik';
import React, {FC} from 'react';
import {StyleSheet, View} from 'react-native';
import {AuthStackParamList} from 'src/@Types/navigation';
import client from 'src/api/client';
import * as yup from 'yup';

const LogInSchema = yup.object({
  email: yup
    .string()
    .trim('Email Is Missing')
    .email('Invalid Email')
    .required('Email Is Required'),
});

interface Props {}

interface initialValues {
  email: string;
}

const initialValues = {
  email: '',
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const LostPassWord: FC<Props> = props => {
  const navigation = useNavigation<NavigationProp<AuthStackParamList>>();

  const handleSubmit = async (
    value: initialValues,
    actions: FormikHelpers<initialValues>,
  ) => {
    actions.setSubmitting(true);
    try {
      const {data} = await client.post('/auth/forget-PassWord', {
        ...value,
      });
      console.log('LostPassword', data);
    } catch (error) {
      console.log('ForgetPasswordError', error);
    }
    actions.setSubmitting(false);
  };

  return (
    <Form
      onSubmit={handleSubmit}
      initialValues={initialValues}
      validationSchema={LogInSchema}>
      <AuthFormContainer
        title="Forget Password!"
        subTitle="Don't Worry , we'll  help you get back In.">
        <View style={styles.formContainer}>
          <AuthInputField
            name="email"
            placeholder="John@email.com"
            label="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            containerStyle={styles.marginBottom}
          />
          <SubmitBtn title="Send Link" />
          <View style={styles.appLinkContainer}>
            <AppLink
              title="Sign In"
              onPress={() => {
                navigation.navigate('SignIn');
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

export default LostPassWord;
