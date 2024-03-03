import AuthFormContainer from '@components/AuthFormContainer';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import AppButton from '@ui/AppButton';
import AppLink from '@ui/AppLink';
import OtpFelid from '@ui/OtpFelid';
import React, {FC, useEffect, useRef, useState} from 'react';
import {Keyboard, StyleSheet, TextInput, View} from 'react-native';
import {useDispatch} from 'react-redux';
import {AuthStackParamList} from 'src/@Types/navigation';
import {catchAsyncError} from 'src/api/catchError';
import client from 'src/api/client';
import {updateNotification} from 'src/store/notification';

type Props = NativeStackScreenProps<AuthStackParamList, 'Verification'>;

const otpFields = new Array(6).fill('');

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Verification: FC<Props> = ({route}) => {
  const [otp, setOtp] = useState([...otpFields]);
  const [activeOtpIndex, setActiveOtpIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const navigation = useNavigation<NavigationProp<AuthStackParamList>>();
  const dispatch = useDispatch();

  const {userInfo} = route.params;

  const handleChange = (value: string, index: number) => {
    const newOtp = [...otp];

    if (value === 'Backspace') {
      if (!newOtp[index]) {
        setActiveOtpIndex(index - 1);
      }
      newOtp[index] = '';
    } else {
      setActiveOtpIndex(index + 1);
      newOtp[index] = value;
    }
    setOtp([...newOtp]);
  };

  const handlePaste = (value: string) => {
    if (value.length === 6) {
      Keyboard.dismiss();
      const newOtp = value.split('');
      setOtp([...newOtp]);
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [activeOtpIndex]);

  const isValidOtp = otp.every(value => {
    return value.trim();
  });

  const handleSubmit = async () => {
    if (!isValidOtp) {
      return dispatch(
        updateNotification({message: 'Invalid OTP', type: 'error'}),
      );
    }
    setSubmitting(true);
    try {
      const {data} = await client.post('/auth/verify-email', {
        token: otp.join(''),
        userId: userInfo.id,
      });
      dispatch(updateNotification({message: data.message, type: 'success'}));
      navigation.navigate('SignIn');
    } catch (err) {
      const error = catchAsyncError(err);
      dispatch(updateNotification({message: error, type: 'error'}));
      console.log('Sign Up Error', err);
    }
    setSubmitting(false);
  };

  return (
    <AuthFormContainer title="Check Your Email!">
      <View style={styles.inputContainer}>
        {otpFields.map((_, index) => {
          return (
            <OtpFelid
              ref={activeOtpIndex === index ? inputRef : null}
              key={index}
              placeholder="_"
              onKeyPress={({nativeEvent}) => {
                handleChange(nativeEvent.key, index);
              }}
              keyboardType="numeric"
              onChangeText={handlePaste}
              value={otp[index] || ''}
            />
          );
        })}
      </View>
      <AppButton loading={submitting} title="Submit" onPress={handleSubmit} />
      <View style={styles.appLinkContainer}>
        <AppLink title="Re-Send OTP" />
      </View>
    </AuthFormContainer>
  );
};

const styles = StyleSheet.create({
  appLinkContainer: {
    marginTop: 20,
  },
  inputContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
});

export default Verification;
