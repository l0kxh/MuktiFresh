import { View, Text, Image, Dimensions, Animated } from 'react-native'
import React, { useState, useEffect } from 'react'
import Icon from 'react-native-vector-icons/AntDesign';
import { useSelector } from 'react-redux';
import { StyleSheet } from 'react-native';
import { useRef } from 'react';


const FloatingCart = ({ Navigation, Screen }) => {
    const { cart } = useSelector(state => state);
    const { cartAmount } = useSelector(state => state);
    return (
        cart.length===0 ? <></>:
            <Animated.View onTouchStart={() => { Navigation.navigate('Cart'); }} style={[styles.MainContainer, { bottom: Screen !== undefined && Screen === "Products" ? 0 : 0}]}>
            <View style={{ backgroundColor: "#328616", width: "100%", padding: 8, borderRadius: 10, display:"flex", flexDirection:"row", justifyContent:"space-between", alignItems:"center" }}>
                <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                    <Image source={{ uri: cart[0]?.image }} style={{ width: 40, height: 40, borderRadius: 10 }} resizeMode='contain' />
                    <View style={{ marginLeft: 10 }}>
                        <Text style={{ fontSize: 12, fontFamily: "RobotoMedium", color: "#fff" }}>{cart.length} {cart.length === 1 ? "Item" : "Items"}</Text>
                        <Text style={{ fontSize: 16, fontFamily: "RobotoMedium", color: "#fff" }}>₹ {cartAmount}</Text>
                    </View>
                </View>
                <Text style={{ fontFamily: "RobotoMedium", fontSize: 14, color: "#fff" }}>View cart  <Icon name='caretright' color={"#fff"} /></Text>
            </View>
        </Animated.View>
    )
}
const styles = StyleSheet.create({
    MainContainer : {
        flexDirection: 'row', 
        alignItems: "center", 
        borderRadius: 10, 
        padding: 10, 
        backgroundColor: '#fff', 
        position: 'absolute', 
        width: Dimensions.get("window").width,
        zIndex: 999,     
        bottom : 0,
        left:0,
        right:0
    }
})
export default FloatingCart