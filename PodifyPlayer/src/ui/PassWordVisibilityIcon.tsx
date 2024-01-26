import colors from '@utils/colors';
import React, {FC} from 'react';
import Icon from 'react-native-vector-icons/Entypo';

interface Props {
  privateIcon: boolean;
}

const PassWordVisibilityIcon: FC<Props> = ({privateIcon}) => {
  return privateIcon ? (
    <Icon name="eye" size={26} color={colors.SECONDARY} />
  ) : (
    <Icon name="eye-with-line" size={26} color={colors.SECONDARY} />
  );
};

export default PassWordVisibilityIcon;
