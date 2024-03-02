import CategorySelector from '@components/CategorySelector';
import FileSelector from '@components/FileSelector';
import AppButton from '@ui/AppButton';
import {categories} from '@utils/Category';
import {Keys, getFromAsyncStorage} from '@utils/asyncStorage';
import colors from '@utils/colors';
import React, {FC, useState} from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {types, DocumentPickerResponse} from 'react-native-document-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import client from 'src/api/client';
import * as yup from 'yup';

interface FormFields {
  title: string;
  category: string;
  about: string;
  file?: DocumentPickerResponse;
  poster?: DocumentPickerResponse;
}

const defaultForm: FormFields = {
  title: '',
  category: '',
  about: '',
};

const audioInfoSchema = yup.object().shape({
  title: yup.string().trim().required('Title is missing!'),
  category: yup.string().oneOf(categories, 'Category is missing!'),
  about: yup.string().trim().required('About is missing!'),
  file: yup.object().shape({
    uri: yup.string().required('Audio file is missing!'),
    name: yup.string().required('Audio file is missing!'),
    type: yup.string().required('Audio file is missing!'),
    size: yup.number().required('Audio file is missing!'),
  }),
  poster: yup.object().shape({
    uri: yup.string(),
    name: yup.string(),
    type: yup.string(),
    size: yup.number(),
  }),
});

const Upload: FC<Props> = props => {
  const [showCategoryModal, setShowCategoryModal] = useState<boolean>(false);
  const [audioInfo, setAudioInfo] = useState({...defaultForm});

  const handleUpload = async () => {
    try {
      const finalData = await audioInfoSchema.validate(audioInfo);

      const formData = new FormData();

      formData.append('title', finalData.title);
      formData.append('about', finalData.about);
      formData.append('category', finalData.category);
      const file = {
        name: finalData.file.name,
        type: finalData.file.type,
        uri: finalData.file.uri,
      };
      formData.append('file', file as any);

      if (finalData.poster.uri) {
        const poster = {
          name: finalData.poster.name,
          type: finalData.poster.type,
          uri: finalData.poster.uri,
        };
        formData.append('poster', poster as any);
      }
      console.log(formData, 'formData');

      const token = await getFromAsyncStorage(Keys.AUTH_TOKEN);

      const {data} = await client.post('/audio/create', formData, {
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'multipart/form-data;',
        },
      });

      console.log(data);
    } catch (error: any) {
      if (error instanceof yup.ValidationError) {
        console.log(error);
      }
      console.log(
        'Status Code:',
        error.response.status,
        'Data:',
        error.response.data,
      );
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.fileContainer}>
        <FileSelector
          icon={
            <MaterialCommunityIcons
              name="image-outline"
              size={35}
              color={colors.SECONDARY}
            />
          }
          btnTitle="Select Poster"
          options={{type: [types.images]}}
          onSelect={poster => {
            setAudioInfo({...audioInfo, poster});
          }}
        />
        <FileSelector
          icon={
            <MaterialCommunityIcons
              name="file-music-outline"
              size={35}
              color={colors.SECONDARY}
            />
          }
          btnTitle="Select Audio"
          style={{marginLeft: 20}}
          options={{type: [types.audio]}}
          onSelect={file => {
            setAudioInfo({...audioInfo, file});
          }}
        />
      </View>
      <View style={styles.formContainer}>
        <TextInput
          placeholderTextColor={colors.INACTIVE_CONTRAST}
          style={styles.input}
          placeholder="Title"
          onChangeText={text => {
            setAudioInfo({...audioInfo, title: text});
          }}
        />
        <Pressable
          onPress={() => {
            setShowCategoryModal(true);
          }}
          style={styles.categorySelector}>
          <Text style={styles.categorySelectorTitle}>Category</Text>
          <Text style={styles.selectedCategory}>{audioInfo.category}</Text>
        </Pressable>
        <TextInput
          placeholderTextColor={colors.INACTIVE_CONTRAST}
          style={[{textAlignVertical: 'top'}, styles.input]}
          placeholder="About"
          numberOfLines={10}
          multiline
          onChangeText={text => {
            setAudioInfo({...audioInfo, about: text});
          }}
        />
        <CategorySelector
          visible={showCategoryModal}
          onRequestClose={() => setShowCategoryModal(false)}
          title="Category"
          data={categories}
          renderItem={item => {
            return <Text style={styles.category}>{item}</Text>;
          }}
          onSelect={item => {
            setAudioInfo({...audioInfo, category: item});
          }}
        />
        <View style={{marginBottom: 20}} />
        <AppButton title="Submit" onPress={handleUpload} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  fileContainer: {
    flexDirection: 'row',
  },
  formContainer: {
    marginTop: 20,
  },
  input: {
    borderWidth: 2,
    borderColor: colors.SECONDARY,
    borderRadius: 10,
    padding: 10,
    fontSize: 18,
    color: colors.CONTRAST,
  },
  category: {
    padding: 10,
    color: colors.PRIMARY,
    fontSize: 18,
  },
  categorySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  categorySelectorTitle: {
    color: colors.CONTRAST,
  },
  selectedCategory: {
    color: colors.SECONDARY,
    fontStyle: 'italic',
    marginLeft: 5,
  },
});

export default Upload;
