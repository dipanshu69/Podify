import AppButton from '@ui/AppButton';
import {useFormikContext} from 'formik';
import React, {FC} from 'react';

interface Props {
  title: string;
  onPress?: () => void;
}

const SubmitBtn: FC<Props> = props => {
  const {handleSubmit} = useFormikContext();

  return <AppButton title={props.title} onPress={() => handleSubmit()} />;
};

export default SubmitBtn;
