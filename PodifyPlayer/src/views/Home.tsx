/* eslint-disable react-native/no-inline-styles */
import PulseAnimationContainer from '@ui/PulseAnimationContainer';
import React, {FC} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Image, ScrollView} from 'react-native-reanimated/lib/typescript/Animated';
import {useFetchLatestAudios} from 'src/hooks/query';

interface Props {}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Home: FC<Props> = props => {
  const {data, loading} = useFetchLatestAudios();

  if (loading) {
    return (
      <PulseAnimationContainer>
        <Text style={{color: 'white', fontSize: 25}}>Loading</Text>
      </PulseAnimationContainer>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView horizontal>
        {data?.map(item => {
          return (
            <View key={item.id}>
              <Image source={{uri: item.poster}} style={{height: 100}} />
              <Text style={{color: 'white', paddingVertical: 10}}>
                {item.title}
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {},
});

export default Home;
