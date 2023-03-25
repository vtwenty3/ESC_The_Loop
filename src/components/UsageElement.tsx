import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Animated,
  Easing,
  Image,
} from 'react-native';
import React, {useRef, useState} from 'react';
import {ModalSetTimer} from '../components/ModalSetTimer';
interface Timers {
  [key: string]: {timeLeft?: number; timeSet?: number};
}

type Props = {
  item: any;
  setTimers: React.Dispatch<React.SetStateAction<Timers>>;
  timers: Timers;
  onOpenModal: (appName: string, packageName: string) => void;
};
export default function UsageElement(props: Props) {
  const [modalVisible, setModalVisible] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const animatedValueTask = useRef(
    new Animated.Value(isPressed ? 0 : -4),
  ).current;
  const handlePressIn = () => {
    setIsPressed(true);
    Animated.spring(animatedValueTask, {
      toValue: 0,
      stiffness: 170,
      damping: 6.7,
      mass: 0.2,
      restSpeedThreshold: 1,
      restDisplacementThreshold: 0.5,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    setIsPressed(false);
    Animated.spring(animatedValueTask, {
      toValue: -4,
      stiffness: 270,
      damping: 3.7,
      mass: 0.4,
      restSpeedThreshold: 1,
      restDisplacementThreshold: 0.5,
      useNativeDriver: true,
    }).start();
  };
  return (
    <View style={styles.mainContainer}>
      <TouchableOpacity
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={() => {
          props.onOpenModal(props.item.appName, props.item.packageName);
          // setModalVisible(true);
        }}>
        <View style={styles.appContainerShadow}>
          <Animated.View
            style={[
              styles.appContainer,
              {
                transform: [
                  {translateX: animatedValueTask},
                  {translateY: animatedValueTask},
                ],
              },
            ]}>
            <Image
              source={{uri: `data:image/png;base64,${props.item.iconBase64}`}} //important to add the data:image/png;base64, part
              style={styles.image}
            />
            <View
              style={{
                flexDirection: 'column',
                flex: 1,
                paddingHorizontal: 5,
              }}>
              <Text
                style={{
                  fontFamily: 'Lexend-SemiBold',
                  fontSize: 17,
                  color: 'black',
                }}>
                {props.item.appName}
              </Text>
              <View style={styles.appContainerText}>
                <Text style={{color: 'black'}}>
                  <Text style={{fontWeight: 'bold'}}>Usage: </Text>
                  {props.item.usageTimeMinutes} Minutes
                </Text>
                <Text style={{color: 'black'}}>
                  {props.item.usageTimeSeconds} Seconds
                </Text>
              </View>

              <View style={styles.appContainerText}>
                <Text style={{color: 'red'}}>
                  <Text style={{fontWeight: 'bold'}}>Timers: </Text>
                  {props.timers[props.item.packageName]?.timeLeft}
                </Text>
                <Text style={{color: 'red'}}>
                  {props.timers[props.item.packageName]?.timeSet} set
                </Text>
              </View>
            </View>
          </Animated.View>
        </View>
      </TouchableOpacity>
      <View style={{position: 'absolute'}}>
        {/* <ModalSetTimer
          setVisible={setModalVisible}
          visible={modalVisible}
          name={props.item.appName}
          packageName={props.item.packageName}
          setTimers={props.setTimers}
          timers={props.timers}
        /> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  appContainerShadow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'black',
    borderRadius: 10,
    borderColor: 'black',
  },
  appContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDF2AD',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'black',
    zIndex: 20,
    padding: 5,
    transform: [{translateX: -6}, {translateY: -6}],
  },
  usageContainer: {
    flex: 1,
    backgroundColor: 'black',
    borderRadius: 10,
    zIndex: 4,
  },
  appContainerText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mainContainer: {
    paddingTop: 10,
  },
  image: {
    width: 50,
    height: 50,
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 25,
  },
});
