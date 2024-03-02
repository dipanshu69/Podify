import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from '@views/Home';
import Profile from '@views/Profile';
import Upload from '@views/Upload';
import colors from '@utils/colors';
import Icon from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.PRIMARY,
        },
      }}>
      <Tab.Screen
        name="HomeScreen"
        component={Home}
        options={{
          tabBarIcon: props => {
            return <Icon name="home" size={props.size} color={props.color} />;
          },
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: props => {
            return <Icon name="user" size={props.size} color={props.color} />;
          },
          tabBarLabel: 'Profile',
        }}
      />
      <Tab.Screen
        name="Upload"
        component={Upload}
        options={{
          tabBarIcon: props => {
            return (
              <MaterialCommunityIcons
                name="account-music-outline"
                size={40}
                color={props.color}
              />
            );
          },
          tabBarLabel: 'Upload',
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
