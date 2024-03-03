import React, {FC, ReactNode, useEffect} from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

interface Props {
  children: ReactNode;
}

const PulseAnimationContainer: FC<Props> = ({children}) => {
  const opacitySharedValue = useSharedValue(1);

  const opacity = useAnimatedStyle(() => {
    return {
      opacity: opacitySharedValue.value,
    };
  });

  useEffect(() => {
    opacitySharedValue.value = withRepeat(
      withTiming(0.3, {duration: 1000}),
      -1,
      true,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <Animated.View style={opacity}>{children}</Animated.View>;
};

export default PulseAnimationContainer;
