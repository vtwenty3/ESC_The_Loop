import React, { useState } from 'react'
import { View, Modal } from 'react-native'
import BrutalButton from './BrutalButton'

type Props = {
  visible: boolean;
  children: React.ReactNode;
  onClose: () => void;
  onConfirm: () => void;
  confirmDisabled?: boolean

};


export function CustomModal(props: Props) {


  return (
    <Modal animationType="fade" transparent visible={props.visible}>
      <View className="flex-1 justify-center items-center bg-black/40">
        <View className="bg-white rounded-xl w-fit border-2 border-black items-center justify-center p-4 max-w-[90%]" style={{ gap: 20 }}>
          {props.children}
          <View className="flex-row" style={{gap:8}}>
            <View className='w-40'>
              <BrutalButton
                onPress={props.onClose}
                text="Close"
                color="#FF6B6B"
                iconName="close-circle-outline" />
            </View>
            <View className='w-40'>
              <BrutalButton disabled={props.confirmDisabled} onPress={props.onConfirm} text="Confirm" iconName="timer-sand" />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  )
}