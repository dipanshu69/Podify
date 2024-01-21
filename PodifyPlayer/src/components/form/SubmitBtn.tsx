import {useFormikContext} from 'formik';
import React, {FC} from 'react';
import {Button} from 'react-native';

interface Props {
  title: string;
  onPress?: () => void;
}

const SubmitBtn: FC<Props> = props => {
  const {handleSubmit} = useFormikContext();

  return <Button title={props.title} onPress={() => handleSubmit()} />;
};

export default SubmitBtn;
