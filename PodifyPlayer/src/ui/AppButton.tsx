import React, {FC, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, Animated} from 'react-native';
import colors from '../utils/colors';
import Loader from './Loader';

interface Props {
  title: string;
  onPress?(): void;
  loading?: boolean;
}

const AppButton: FC<Props> = ({title, onPress, loading}) => {
  const [scaleValue] = useState(new Animated.Value(1));

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.8, // Adjust the scale as needed
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };
  return (
    <Animated.View
      style={[[styles.container, {transform: [{scale: scaleValue}]}]]}>
      <TouchableOpacity
        onPress={onPress}
        style={styles.touchable}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}>
        {loading ? <Loader /> : <Text style={styles.title}>{title}</Text>}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 45,
    backgroundColor: colors.SECONDARY,
    borderRadius: 25,
    overflow: 'hidden',
  },
  touchable: {
    flex: 1,
    backgroundColor: colors.SECONDARY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: colors.CONTRAST,
    fontSize: 18,
  },
});

export default AppButton;
