import { View, TouchableOpacity, Vibration} from 'react-native'
import React, {useState} from 'react'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

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
      <View className='bg-black w-20 h-20 rounded-lg border-2 border-black'>
        <View className='bg-red-700 w-20 h-20 rounded-lg ml-[-7px] mt-[-7px] border-2 border-black'
          style={[isPressed && { transform: [{translateX: 4}, {translateY: 4}, {scale: 0.99}]}]}>
          <View className='bg-red-500 w-[60] h-[60] justify-center items-center rounded-lg ml-2 mt-1.5 border-2 border-black shadow-2xl'>
            <Icon name="keyboard-esc" size={45} color={'black'} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}
