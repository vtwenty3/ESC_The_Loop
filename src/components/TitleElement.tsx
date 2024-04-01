import {StyleSheet, Text, View} from 'react-native'
import React from 'react'
type Props = {
  text: string;
  fontFamily: string;
  fontSize: number;
};
export default function Title(props: Props) {
  return (
    <View style={styles.textShadow}>
      <View style={styles.topView}>
        <Text
          style={{
            color: 'white',
            fontSize: props.fontSize,
            fontFamily: props.fontFamily,
          }}>
          {props.text}
        </Text>
      </View>
      <View style={styles.shadowView}>
        <Text
          style={{
            fontFamily: props.fontFamily,
            color: 'black',
            fontSize: props.fontSize,
          }}>
          {props.text}
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  topView: {
    position: 'absolute',
    zIndex: 1,
  },
  shadowView: {marginTop: 7, marginLeft: 3},
  textShadow: {
    alignContent: 'center',
    justifyContent: 'center',
  },
})
