import AuthFormContainer from '@components/AuthFormContainer';
import AppButton from '@ui/AppButton';
import AppLink from '@ui/AppLink';
import OtpFelid from '@ui/OtpFelid';
import React, {FC, useEffect, useRef, useState} from 'react';
import {Keyboard, StyleSheet, TextInput, View} from 'react-native';

interface Props {}

const otpFields = new Array(6).fill('');

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Verification: FC<Props> = props => {
  const [otp, setOtp] = useState([...otpFields]);
  const [activeOtpIndex, setActiveOtpIndex] = useState(0);
  const inputRef = useRef<TextInput>(null);

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
      <AppButton title="Submit" />
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
