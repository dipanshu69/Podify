/* eslint-disable react-native/no-inline-styles */
import LatestUploads from '@components/LatestUploads';
import RecommendedAudios from '@components/RecommendedAudios';
import React, {FC} from 'react';
import {StyleSheet, View} from 'react-native';

interface Props {}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Home: FC<Props> = props => {
  return (
    <View style={styles.container}>
      <LatestUploads />
      <RecommendedAudios />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
});

export default Home;
