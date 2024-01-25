/* eslint-disable react-native/no-inline-styles */
import CircleUI from '@ui/CircleUI';
import colors from '@utils/colors';
import React, {FC, ReactNode} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';

interface Props {
  title?: string;
  subTitle?: string;
  children?: ReactNode;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const AuthFormContainer: FC<Props> = ({title, subTitle, children}) => {
  return (
    <View style={styles.container}>
      <CircleUI position="top-left" size={200} />
      <CircleUI position="top-right" size={100} />
      <CircleUI position="bottom-left" size={100} />
      <CircleUI position="bottom-right" size={200} />

      <View style={styles.headerContainer}>
        <Image source={require('../assets/logo.png')} />
        <Text style={styles.heading}>{title}</Text>
        <Text style={styles.subHeading}>{subTitle}</Text>
      </View>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: colors.PRIMARY,
    paddingHorizontal: 15,
  },
  heading: {
    color: colors.SECONDARY,
    fontSize: 25,
    fontWeight: 'bold',
    paddingVertical: 5,
  },
  subHeading: {
    color: colors.SECONDARY,
    fontSize: 16,
  },
  headerContainer: {
    width: '100%',
    marginBottom: 20,
  },
});

export default AuthFormContainer;
