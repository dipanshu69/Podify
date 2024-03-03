import colors from '@utils/colors';
import React, {FC} from 'react';
import {Image, Pressable, StyleSheet, Text} from 'react-native';

interface Props {
  title: string;
  poster?: string;
}

const AudioCard: FC<Props> = ({title, poster}) => {
  const source = poster ? {uri: poster} : require('../assets/music.png');

  return (
    <Pressable
      onPress={() => {
        console.log('on audio press');
      }}
      onLongPress={() => {
        console.log('on audio Long Press');
      }}
      style={styles.container}>
      <Image source={source} style={styles.poster} />
      <Text numberOfLines={2} ellipsizeMode="tail" style={styles.title}>
        {title}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 100,
    marginRight: 15,
  },
  poster: {
    height: 100,
    aspectRatio: 1,
    borderRadius: 7,
  },
  title: {
    color: colors.CONTRAST,
    fontWeight: '500',
    fontSize: 16,
    marginTop: 5,
  },
});

export default AudioCard;
