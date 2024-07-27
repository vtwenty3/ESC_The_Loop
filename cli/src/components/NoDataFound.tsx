import {StyleSheet, Text, View} from 'react-native'
import React from 'react'

type Props = {
  boldText: string;
  boldTextSize?: number;
  text?: string;
  disclamer?: string;
  step1?: string;
  step2?: string;
  step3?: string;
};

export default function NoDataFound(props: Props) {
  return (
    <View style={styles.NoPermission}>
      <View>
        <Text
          style={{
            fontSize: props.boldTextSize ? props.boldTextSize : 17,
            color: 'black',
            fontFamily: 'Lexend-SemiBold',
          }}>
          {props.boldText}
        </Text>
        <Text
          style={{
            fontSize: 15,
            color: 'black',
            fontFamily: 'Lexend-Regular',
          }}>
          {props.text}
          {props.step1}
          {'\n'}
          {props.step2}
          {'\n'}
          {props.step3}
          {'\n'}
        </Text>
      </View>
      {props.disclamer ? (
        <Text
          style={{
            fontSize: 14,
            color: 'black',
            fontFamily: 'Lexend-Regular',
            backgroundColor: '#FF6B6B',
            padding: 10,
            borderRadius: 10,
            marginTop: 10,
            borderWidth: 2,
            borderColor: 'black',
          }}>
          {props.disclamer}
        </Text>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  NoPermission: {
    height: '100%',
    width: '90%',
    alignSelf: 'center',
    paddingTop: 20,
    paddingBottom: 20,
    justifyContent: 'space-between',
  },
})
