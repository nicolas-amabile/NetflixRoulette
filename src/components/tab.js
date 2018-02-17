import React from 'react'
import { TouchableOpacity, Text, StyleSheet } from 'react-native'

const Tab = ({ name, isActive, onPress }) => (
  <TouchableOpacity
    style={isActive ? [styles.container, styles.active] : styles.container}
    onPress={() => onPress(name)}>
    
    <Text style={isActive ? [styles.text, styles.textActive] : styles.text}>
      {name}
    </Text>

  </TouchableOpacity>
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 40
  },
  active: {
    borderBottomWidth: 3,
    borderBottomColor: '#0479fb'
  },
  text: {
    color: '#9d9d9d'
  },
  textActive: {
    color: '#0479fb',
    fontWeight: 'bold',
    paddingTop: 3
  }
})

export default Tab
