import colors from '@utils/colors';
import React, {FC, useEffect} from 'react';
import {StyleSheet, Text} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {useDispatch, useSelector} from 'react-redux';
import {getNotificationState, updateNotification} from 'src/store/notification';

interface Props {}

const AppNotification: FC<Props> = () => {
  const {message, type} = useSelector(getNotificationState);
  const height = useSharedValue(0);

  const dispatch = useDispatch();

  const heightStyle = useAnimatedStyle(() => {
    return {
      height: height.value,
    };
  });

  let backgroundColor = colors.ERROR;
  let textColor = colors.CONTRAST;

  switch (type) {
    case 'success':
      backgroundColor = colors.SUCCESS;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      textColor = colors.PRIMARY;
      break;
  }

  useEffect(() => {
    let timeOutID = 0;

    const performAnimation = () => {
      height.value = withTiming(45, {
        duration: 150,
      });

      timeOutID = setTimeout(() => {
        height.value = withTiming(0, {
          duration: 150,
        });
        dispatch(updateNotification({message: '', type}));
      }, 3000);
    };

    if (message) performAnimation();
    return () => {
      clearTimeout(timeOutID);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message]);

  return (
    <Animated.View style={[styles.container, {backgroundColor}, heightStyle]}>
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    fontSize: 18,
    alignItems: 'center',
  },
});

export default AppNotification;
