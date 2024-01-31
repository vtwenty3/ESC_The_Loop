import React, { useState, useEffect } from 'react'
import InputFiled from '../components/InputFiledElement'
import Title from '../components/TitleElement'
import Esc from '../components/EscElement'
import NoteElement from '../components/NoteElement'
import { useFocusEffect } from '@react-navigation/native'
import ModalEdit from '../components/ModalEdit'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { globalStyles } from '../globalStyles'
import { StyleSheet, View, FlatList } from 'react-native'
import NoDataFound from '../components/NoDataFound'

export function Notes() {
  const [data, setData] = useState<any>()
  const [modalVisible, setModalVisible] = useState(false)
  const [modalObject, setModalObject] = useState({})

  async function getMyObject() {
    try {
      const jsonValue = await AsyncStorage.getItem('@Note')
      return jsonValue != null ? await JSON.parse(jsonValue) : null
    } catch (e) {
      console.log(' Error: ', e)
    }
    console.log('Data Loaded.')
  }

  async function updateMyObject(updatedData: any) {
    try {
      await AsyncStorage.setItem('@Note', JSON.stringify(updatedData))
    } catch (e) {
      console.log('Error: ', e)
    }
  }

  const handleSave = async (itemUpdated: object, timestampOld: string) => {
    const findIndex = data.findIndex((obj: any) => obj.timestamp === timestampOld)
    if (findIndex !== -1) {
      data.splice(findIndex, 1) // Remove the object at the found index
      data.push(itemUpdated) // Append the new object to the end of the array
    }
    await updateMyObject(data)
    setModalVisible(false)
  }

  const handleDelete = async (timestamp: string) => {
    const findIndex = data.findIndex((obj: any) => obj.timestamp === timestamp)
    if (findIndex !== -1) {
      data.splice(findIndex, 1) // Remove the object at the found index
    }
    await updateMyObject(data)
    fetchData()

    setTimeout(() => {
      setModalVisible(false)
    }, 400)
  }
  const isActive = true

  const fetchData = async () => {
    try {
      const data = await getMyObject()
      if (isActive) {
        setData(data)
        // console.log('data:', data, typeof data);
      }
    } catch (e) {
      console.log('Error fetchData:', e)
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      let isActive = true
      fetchData()
      return () => {
        isActive = false
      }
    }, [])
  )

  return (
    <View style={[globalStyles.root]}>
      <View style={[globalStyles.header]}>
        <View style={[globalStyles.headerChildren]}>
          <Esc onPress={() => console.log('Esc')} />
          <Title text={'Notes'} fontFamily={'Lexend-Medium'} fontSize={40} />
        </View>
      </View>
      <View style={[globalStyles.body]}>
        {/* <View style={styles.FlatList}> */}
        <FlatList
          contentContainerStyle={{ paddingTop: 15, gap: 5 }}
          data={data}
          keyExtractor={(item) => item.timestamp}
          renderItem={({ item }) => (
            <NoteElement
              onOpenModal={() => {
                setModalObject(item)
                setModalVisible(true)
              }}
              item={item}
              modalVisible={modalVisible}
            />
          )}
        />
        {/* </View> */}
        {!data === undefined || data == null || data.length === 0 ? (
          <NoDataFound boldText="No Notes Found" boldTextSize={20} text="Add a Note by pressing the + button" />
        ) : null}
        <ModalEdit
          autofocusDescription={true}
          autofocusTitle={false}
          setVisible={setModalVisible}
          visible={modalVisible}
          item={modalObject}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({})
