import * as React from 'react';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';

import Colors from '../constants/Colors';

export default function TabBarIcon(props) {
  if(props.type == 0)
    return (
      <FontAwesome
        name={props.name}
        size={30}
        style={{ marginBottom: -3 }}
        color={props.focused ? Colors.tabIconSelected : Colors.tabIconDefault}
      />
    );
  else
    return (
      <MaterialIcons
        name={props.name}
        size={30}
        style={{ marginBottom: -3 }}
        color={props.focused ? Colors.tabIconSelected : Colors.tabIconDefault}
      />
    );
}
