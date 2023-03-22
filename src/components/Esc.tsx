import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type Props = {
  onPress: () => void;
};
export default function Esc(props: Props) {
  const [isPressed, setIsPressed] = useState(false);
  const handlePressIn = () => {
    setIsPressed(true);
  };

  const handlePressOut = () => {
    setIsPressed(false);
  };
  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={props.onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}>
      <View style={styles.escShadow}>
        <View
          style={[
            styles.escRoot,
            isPressed && {
              transform: [{translateX: 4}, {translateY: 4}, {scale: 0.99}],
            },
          ]}>
          <View style={styles.escTop}>
            <Icon name="keyboard-esc" size={45} color={'black'} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  escShadow: {
    width: 80,
    height: 80,
    borderRadius: 7,
    backgroundColor: 'black',
    borderWidth: 2.5,
  },
  escRoot: {
    width: 80,
    height: 80,
    borderRadius: 7,
    marginTop: -7,
    marginLeft: -7,
    backgroundColor: '#B22525',
    borderWidth: 2.5,
  },
  escTop: {
    marginLeft: 8,
    marginTop: 5,
    width: 60,
    height: 60,
    borderRadius: 8.5,
    backgroundColor: '#E95B5B',
    borderWidth: 2.5,
    borderColor: '#000000',
    zIndex: 2,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.75,
    shadowRadius: 10,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pressed: {
    transform: [{translateX: 4}, {translateY: 4}, {scale: 0.99}],
  },
});
