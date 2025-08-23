import React, { useLayoutEffect } from 'react';
import { View, Text } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { commonStyles } from '../utils/helpers';

const LogoutScreen = () => {
      const { logout } = useAuth();
      useLayoutEffect(() => {
            logout();
      }, []);
      return (
            <View style={commonStyles.container}>
                  <Text>Logout</Text>
            </View>
      );
};

export default LogoutScreen;