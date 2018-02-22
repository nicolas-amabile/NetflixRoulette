import React from 'react'
import { View, Text, Platform, StyleSheet } from 'react-native'

const Header = ({ title }) => (
  <View style={styles.container}>
    <Text style={styles.title}>{title}</Text>
  </View>
)

const styles = StyleSheet.create({
  container: {
    height: Platform.OS === 'ios' ? 60 : 80,
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#dadadc',
    justifyContent: 'flex-end',
    alignItems: Platform.OS === 'ios' ? 'center' : 'flex-start',
    backgroundColor: Platform.OS === 'ios' ? '#f8f8f8' : '#3f51b5'
  },
  title: {
    fontFamily: Platform.OS === 'ios' ? "System" : "Roboto",
    color: Platform.OS === 'ios' ? "#000" : "#fff",
    fontSize: 17,
    fontWeight: 'bold',
    paddingBottom: Platform.OS === 'ios' ? 10 : 17,
    paddingLeft: Platform.OS === 'ios' ? 0 : 25
  }
})

export default Header
