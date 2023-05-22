import React, { Component } from 'react'
import { Text, View } from 'react-native'
import Header from './Header'
import { SafeAreaView } from 'react-native-safe-area-context'

export class Product extends Component {
  render() {
    return (
      <SafeAreaView style={{flex:1}}>
        <Header/>
      </SafeAreaView>
    )
  }
}

export default Product
