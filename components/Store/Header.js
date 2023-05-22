import React, { Component } from 'react'
import { TouchableOpacity } from 'react-native'
import { TextInput } from 'react-native'
import { Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Icon from "react-native-vector-icons/Ionicons"

export default function Header({ drawerToggle, customStyle, }) {
    return (
        <View style={[{ padding: 10}, customStyle]}>
            <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                <View>
                    <Text style={{ fontFamily: "RobotoBlack", fontSize: 13 }}>DELIVERY IN</Text>
                    <Text style={{ fontFamily: "RobotoBold", fontSize: 26 }}>Next Day Delivery</Text>
                    <Text style={{ fontFamily: "RobotoBold" }}>HOME - <Text style={{ fontFamily: "RobotoRegular" }}>Govt Polytechnic gate, Shantinagar <Icon name='caret-down-outline' /></Text></Text>
                </View>
                <TouchableOpacity onPress={() => drawerToggle.openDrawer()}>
                    <Icon name='ios-person-circle-outline' size={50} color={"#333"} />
                </TouchableOpacity>
            </View>
            <View style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" , backgroundColor:"#f2f4f7", borderRadius:10, elevation:0.5, marginTop:20,padding:6 }}>
                <View style={{display:"flex", flexDirection:"row", alignItems:"center"}}>
                    <Icon name='search' size={18} style={{padding:6}}/>
                    <Text style={{fontFamily:"RobotoMedium", marginLeft:15, color:"grey"}}>Search "Food"</Text>
                </View>
                <Icon name='mic' size={20} style={{ padding: 6, borderLeftWidth: 1, borderLeftColor: "#ebebeb",paddingLeft:12 }} />
            </View>
        </View>

    )
}
