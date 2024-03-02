import React from 'react';
import {Provider} from 'react-redux';
import store from 'src/store';
import AppNavigator from 'src/navigation';
import Appcontainer from '@components/Appcontainer';
import {StatusBar} from 'react-native';
import colors from '@utils/colors';

export default function App() {
  return (
    <Provider store={store}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.PRIMARY} // Set the background color to match tabBarStyle
      />
      <Appcontainer>
        <AppNavigator />
      </Appcontainer>
    </Provider>
  );
}
