import {StyleSheet, View, TouchableOpacity, Vibration} from 'react-native'
import React, {useState} from 'react'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import tw from 'twrnc'
// TODO: configure intelisense https://github.com/jaredh159/tailwind-react-native-classnames?tab=readme-ov-file#vs-code-intellisense
type Props = {
  onPress: () => void;
};
export default function Esc(props: Props) {
  const [isPressed, setIsPressed] = useState(false)
  const handlePressIn = () => {
    Vibration.vibrate(11)
    setIsPressed(true)
  }

  const handlePressOut = () => {
    setIsPressed(false)
  }
  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={props.onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}>
      <View style={tw`bg-black w-20 h-20 rounded-lg border-2 border-black`}>
        <View style={[ tw`bg-red-700 w-20 h-20 rounded-lg ml-[-7px] mt-[-7px] border-2 border-black`,
          isPressed && { transform: [{translateX: 4}, {translateY: 4}, {scale: 0.99}]}]}>
          <View style={tw`bg-red-500 w-15 h-15 justify-center items-center rounded-lg ml-2 mt-1.5 border-2 border-black shadow-2xl`}>
            <Icon name="keyboard-esc" size={45} color={'black'} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}
