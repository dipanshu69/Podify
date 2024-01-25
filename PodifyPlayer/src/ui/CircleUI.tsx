/* eslint-disable react-native/no-inline-styles */
import colors from '@utils/colors';
import React, {FC} from 'react';
import {FlexStyle, View} from 'react-native';

interface Props {
  size: number;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

const CircleUI: FC<Props> = ({size, position}) => {
  let viewPostion: FlexStyle = {};

  switch (position) {
    case 'top-left':
      viewPostion = {
        top: -size / 2,
        left: -size / 2,
      };
      break;
    case 'top-right':
      viewPostion = {
        top: -size / 2,
        right: -size / 2,
      };
      break;
    case 'bottom-left':
      viewPostion = {
        bottom: -size / 2,
        left: -size / 2,
      };
      break;
    case 'bottom-right':
      viewPostion = {
        bottom: -size / 2,
        right: -size / 2,
      };
  }

  return (
    <View
      style={{
        width: size,
        height: size,
        position: 'absolute',
        ...viewPostion,
      }}>
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: colors.ERROR,
          opacity: 0.3,
        }}
      />
      <View
        style={{
          width: size / 1.5,
          height: size / 1.5,
          backgroundColor: colors.CONTRAST,
          borderRadius: size,
          opacity: 0.3,
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: [{translateX: -size / 3}, {translateY: -size / 3}],
        }}
      />
    </View>
  );
};

export default CircleUI;
