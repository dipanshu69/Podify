import AppInput from '@ui/AppInput';
import colors from '@utils/colors';
import {useFormikContext} from 'formik';
import React, {FC, ReactNode, useEffect} from 'react';
import {
  StyleSheet,
  TextInputProps,
  View,
  StyleProp,
  ViewStyle,
  Text,
  Pressable,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withSequence,
} from 'react-native-reanimated';

interface Props {
  name: string;
  label?: string;
  placeholder?: string;
  keyboardType?: TextInputProps['keyboardType'];
  secureTextEntry?: boolean;
  autoCapitalize?: TextInputProps['autoCapitalize'];
  containerStyle?: StyleProp<ViewStyle>;
  rightIcon?: ReactNode;
  onRightIconPress?(): void;
}

const AuthInputField: FC<Props> = props => {
  const {
    label,
    placeholder,
    keyboardType,
    secureTextEntry,
    autoCapitalize,
    containerStyle,
    name,
    rightIcon,
    onRightIconPress,
  } = props;

  const {handleChange, handleBlur, values, errors, touched} = useFormikContext<{
    [key: string]: string;
  }>();

  const inputTransFormValue = useSharedValue(0);
  const inputStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateX: inputTransFormValue.value}],
    };
  });

  const errorMsg = touched[name] && errors[name] ? errors[name] : '';

  const shakeUI = () => {
    inputTransFormValue.value = withSequence(
      withTiming(-10, {duration: 50}),
      withSpring(0, {
        damping: 8,
        mass: 0.5,
        stiffness: 1000,
        restDisplacementThreshold: 0.1,
      }),
    );
  };

  useEffect(() => {
    if (errorMsg) {
      shakeUI();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorMsg]);

  return (
    <Animated.View style={[containerStyle, inputStyle]}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.errorMsg}>{errorMsg}</Text>
      </View>
      <View>
        <AppInput
          placeholder={placeholder}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          onChangeText={handleChange(name)}
          value={values[name]}
          onBlur={handleBlur(name)}
        />
        {rightIcon ? (
          <Pressable onPress={onRightIconPress} style={styles.rightIcon}>
            {rightIcon}
          </Pressable>
        ) : null}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  label: {
    color: colors.CONTRAST,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 5,
  },
  errorMsg: {
    color: colors.ERROR,
  },
  rightIcon: {
    width: 45,
    height: 45,
    position: 'absolute',
    top: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AuthInputField;
