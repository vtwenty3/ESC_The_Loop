import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export function Create() {
  const [isPressed, setIsPressed] = useState(false);

  const handlePressIn = () => {
    setIsPressed(true);
  };

  const handlePressOut = () => {
    setIsPressed(false);
  };
  return (
    <View style={styles.background}>
      <View style={styles.backgroundTop}>
        <View style={styles.header}>
          <TouchableOpacity
            activeOpacity={1}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}>
            <View style={styles.escShadow}>
              <View
                style={[
                  styles.escRoot,
                  isPressed && {
                    transform: [
                      {translateX: 4},
                      {translateY: 4},
                      {scale: 0.99},
                    ],
                  },
                ]}>
                <View style={styles.escTop}>
                  <Icon name="keyboard-esc" size={45} color={'black'} />
                </View>
              </View>
            </View>
          </TouchableOpacity>
          {/* <Text style={styles.headerTitle}>Create</Text> */}

          <View style={styles.textShadow}>
            <View style={styles.topView}>
              <Text style={{color: 'white', fontSize: 40, fontWeight: '900'}}>
                Create{' '}
              </Text>
            </View>
            <View style={styles.shadowView}>
              <Text style={{color: 'black', fontSize: 40, fontWeight: '900'}}>
                Create
              </Text>
            </View>
          </View>
        </View>
      </View>
      <Text>Create</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: '#FBF4E7',
    flex: 1,
    alignItems: 'center',
  },
  backgroundTop: {
    backgroundColor: '#9723C9',
    height: 140,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    height: '100%',
    justifyContent: 'space-between',
    overflow: 'hidden', // to prevent children from overflowing parent
  },
  escRoot: {
    width: 90,
    height: 90,
    borderRadius: 7,
    marginTop: -7,
    marginLeft: -7,
    backgroundColor: '#B22525',
    borderWidth: 2.5,
  },
  escShadow: {
    width: 90,
    height: 90,

    borderRadius: 7,
    backgroundColor: 'black',
    borderWidth: 2.5,
  },
  escTop: {
    marginLeft: 8,
    marginTop: 5,
    width: 66,
    height: 66,
    borderRadius: 8.5,
    backgroundColor: '#E95B5B',
    borderWidth: 2.5,
    borderColor: '#000000',
    zIndex: 2,
    boxShadow: '0px 50 10px 0px rgba(0,0,0,0.75)',

    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: -2,
  },
  topView: {
    position: 'absolute',
    zIndex: 1,
  },
  shadowView: {marginTop: 7, marginLeft: 3},
  textShadow: {
    alignContent: 'center',
    justifyContent: 'center',
  },
});
