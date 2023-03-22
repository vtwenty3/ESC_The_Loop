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
export default function BrutalButton(props: Props) {
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
      <View style={styles.buttonShadow}>
        <View
          style={[
            styles.button,
            isPressed && {
              transform: [{translateX: 0}, {translateY: 0}, {scale: 0.99}],
            },
          ]}>
          <Icon name="check" size={25} color={'black'} />
          <Text style={styles.text}>Create</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonShadow: {
    borderRadius: 10,
    backgroundColor: 'black',
  },
  text: {
    color: 'black',
    fontFamily: 'Lexend-Regular',
    fontSize: 18,
    textAlign: 'center',
  },
  button: {
    padding: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    zIndex: 3,
    borderRadius: 10,
    gap: 10,
    backgroundColor: '#7FBC8C',
    transform: [{translateX: -4}, {translateY: -4}],
  },
});
