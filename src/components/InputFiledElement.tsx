import {StyleSheet, View, TextInput, Animated, Easing} from 'react-native'
import React, {useState, useRef, useEffect} from 'react'

type Props = {
  placeholder: string;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  multiline?: boolean;
  numberOfLines?: number;
  fontSize?: number;
  numeric?: boolean;
  fontFamily?: string;
  pop: boolean;
  autofocus?: boolean;
  editable?: boolean
};

export default function InputFiled(props: Props) {
  useEffect(() => {
    if (props.pop == true) {
      handlePressOut()
    }
  }, [props.pop])

  const handlePressOut = () => {
    Animated.spring(animatedValue, {
      toValue: -4,
      stiffness: 270,
      damping: 3.7,
      mass: 0.4,
      delay: 150,
      restSpeedThreshold: 1,
      restDisplacementThreshold: 0.5,
      useNativeDriver: true,
    }).start()
  }
  const [title, onChangeTitle] = React.useState('')
  const [focused, setFocused] = useState(false)
  const animatedValue = useRef(new Animated.Value(focused ? 0 : -4)).current
  return (
    <View>
      <View style={styles.inputTitleShadow}>
        <Animated.View
          style={{
            transform: [
              {translateX: animatedValue},
              {translateY: animatedValue},
            ],
          }}>
          <TextInput
            placeholderTextColor="#7a7a7a"
            autoFocus={props.autofocus ? props.autofocus : undefined}
            maxLength={props.multiline ? undefined : 40}
            style={[
              styles.inputTitle,
              {
                color: 'black',
                fontSize: props.fontSize ? props.fontSize : 18,
                fontFamily: props.fontFamily
                  ? props.fontFamily
                  : 'Lexend-Medium',
              },
            ]}
            onChangeText={props.setValue}
            value={props.value}
            multiline={props.multiline}
            keyboardType={props.numeric ? 'numeric' : undefined}
            numberOfLines={props.multiline ? props.numberOfLines : undefined}
            textAlignVertical={props.multiline ? 'top' : undefined}
            placeholder={props.placeholder}
            onFocus={() => {
              setFocused(true)
              Animated.timing(animatedValue, {
                duration: 600,
                toValue: 0,
                easing: Easing.out(Easing.circle),
                useNativeDriver: true,
              }).start()
            }}
            onBlur={() => {
              setFocused(false)
              // Animated.spring(animatedValue, {
              //   toValue: -4,
              //   stiffness: 270,
              //   damping: 3.7,
              //   mass: 0.4,
              //   delay: 150,
              //   restSpeedThreshold: 1,
              //   restDisplacementThreshold: 0.5,
              //   useNativeDriver: true,
              // }).start();
            }}
            editable={props.editable}
          />
        </Animated.View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  inputTitle: {
    maxHeight: 155,
    borderWidth: 2,
    padding: 10,
    zIndex: 3,
    backgroundColor: 'white',
    borderRadius: 10,
    width: '100%',
    // transform: [{translateX: -4}, {translateY: -4}],
  },
  inputTitleShadow: {
    alignSelf: 'center',
    backgroundColor: 'black',
    borderRadius: 10,
    width: '100%',
    zIndex: 2,
  },
})
