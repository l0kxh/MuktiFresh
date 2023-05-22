import { Text, View, Image, Alert, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { Button, ButtonGroup } from '@rneui/themed'
import Icon from 'react-native-vector-icons/AntDesign';
import { TouchableOpacity } from 'react-native-gesture-handler'
import { BottomSheet, ListItem } from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import axios from 'axios';
import { API_URL } from '../../Init';
import { addToCart, loadCart, updateCart } from "../../redux/actions"
import { connect, useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { FlatList } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { Dimensions } from 'react-native';


const ProductCard = ({ ShowDet, Item, Related, AddtoCart, UpdateParentCart, Cart, padding, print, width, isProducts, productPadding }) => {
    const { isLogin, auth, cart } = useSelector(state => state);
    const [details, setDetails] = useState(false);
    const [loading, setLoading] = useState(false);
    const [added, setAdded] = useState(false);
    const dispatch = useDispatch();
    const [quantities, setQuantities] = useState([]);
    useEffect(() => {
        setLoading(true);
        const get = async () => {
            const temp = [];
            const len = Item.prices.length
            await Item.prices.map(async (item) => {
                const data = await cart?.filter((it) => it.pkg_id === item.pkg_id);
                if (data.length === 0) {
                    temp.push(0)
                }
                else {
                    temp.push(parseInt(data[0].qty))
                }
                if (temp.length === len) {
                    setQuantities(temp);
                }
            })
        }
        get();
        setLoading(false);

    }, [Item, cart]);
    const Ren = (key, qt) => {
        const quant = quantities;
        quant[key] = qt;
        setQuantities([...quant]);
    }
    handleCart = async (pkg_id, prod_id, qt) => {
        if (isLogin === false) {
            Alert.alert('Login Required', 'Please Login to Continue',
                [
                    { text: 'Ok', onPress: () => { } },
                ],
                { cancelable: true }
            );
        }
        else {
            setLoading(true);
            console.log(qt);
            dispatch(addToCart(auth.user_details.c_email, prod_id, pkg_id, qt, setAdded));
            setLoading(false);
        }
    }
    if (quantities.length === Item.prices.length) {
        const images = [Item.prod_image];
        Item.images.map(item=>images.push(item.img_images))
        return (
            <View style={{ borderRadius: 5, padding: productPadding !== undefined ? productPadding : 3, margin: padding !== undefined ? padding : 0, width: width !== undefined ? width : 150, backgroundColor: "#fff" }}>
                {isProducts !== undefined && isProducts === true ?
                    <TouchableOpacity onPress={() => { setDetails(true) }} style={{ display: "flex", flexDirection: "column" }}>
                        <View style={{ padding: 10, borderRadius: 10, width: 142, height: 140, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                            <Image source={{ uri: Item.prod_image }} style={{ width: 130, height: 100 }} resizeMode='contain' />
                        </View>
                        <Text numberOfLines={1} style={{ fontSize: 14, marginTop: 10, fontFamily: "RobotoMedium" }}>{Item.prod_name}</Text>
                        {(ShowDet == true) ?
                            <>
                                <Text style={{ padding: 4, textAlign: 'center', marginTop: 5, marginBottom: 5, borderRadius: 5, borderColor: '#ebebeb', borderWidth: 0.5, fontSize: 13, fontFamily: "RobotoThin" }}>{Item.prices[0].pkg_description} - ₹ {Item.prices[0].pkg_discount_cost}</Text>
                                <Text style={{ textAlign: 'center', fontSize: 12, fontWeight: '400' }}>₹ {Item.prices[0].pkg_discount_cost}</Text>
                            </>
                            : <>
                                <Text style={{ textAlign: 'left', fontSize: 12, marginVertical: 15, fontFamily: "RobotoThin" }}>{Item.prices[0].pkg_description}</Text>
                                <View style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                    <Text style={{ fontSize: 16, fontFamily: "RobotoMedium" }}>₹{parseInt(Item.prices[0].pkg_discount_cost)}</Text>
                                    <Button type='outline' buttonStyle={{ borderColor: '#328616', borderWidth: 1, borderRadius: 5, width: 70, height: 30, padding: 0 }}
                                        onPress={() => setDetails(true)} titleStyle={{ color: '#328616', fontSize: 14, fontWeight: "800", fontFamily: "RobotoBold" }}>
                                        ADD
                                    </Button>
                                </View>
                            </>

                        }
                    </TouchableOpacity>
                    :
                    <TouchableOpacity onPress={() => { setDetails(true) }} style={{ display: "flex", flexDirection: "column" }}>
                        <View style={{ borderWidth: 1, borderColor: "#ebebeb", padding: 10, borderRadius: 10, width: 142, height: 140, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                            <Image source={{ uri: Item.prod_image }} style={{ width: 130, height: 100 }} resizeMode='contain' />
                        </View>
                        <Text numberOfLines={1} style={{ fontWeight: '500', fontSize: 14, marginTop: 10 }}>{Item.prod_name}</Text>
                        {(ShowDet == true) ?
                            <>
                                <Text style={{ padding: 4, textAlign: 'center', marginTop: 5, marginBottom: 5, borderRadius: 5, borderColor: '#ebebeb', borderWidth: 0.5, fontSize: 13 }}>{Item.prices[0].pkg_description} - ₹ {Item.prices[0].pkg_discount_cost}</Text>
                                <Text style={{ textAlign: 'center', fontSize: 12, fontWeight: '400' }}>₹ {Item.prices[0].pkg_discount_cost}</Text>
                            </>
                            : <>
                                <Text style={{ textAlign: 'left', fontSize: 12, marginVertical: 15, fontWeight: '400' }}>{Item.prices[0].pkg_description}</Text>
                                <View style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                    <Text style={{ fontSize: 16, fontWeight: "500" }}>₹{parseInt(Item.prices[0].pkg_discount_cost)}</Text>
                                    <Button type='outline' buttonStyle={{ borderColor: '#328616', borderWidth: 1, borderRadius: 5, width: 70, height: 30, padding: 0 }}
                                        onPress={() => setDetails(true)} titleStyle={{ color: '#328616', fontSize: 14, fontWeight: "800" }}>
                                        ADD
                                    </Button>
                                </View>
                            </>

                        }
                    </TouchableOpacity>}
                <Spinner visible={loading} />

                <BottomSheet
                backdropStyle={{backgroundColor:"rgba(0,0,0,0.5)"}}
                 isVisible={details}  >
                    <Icon name={'closecircle'} size={40} onPress={() => { setDetails(false); }} color={"#000"} style={{ alignSelf: "center", marginBottom: 10}} />
                    {/* Floating Cart */}
                    <ScrollView style={{ display: "flex", flexDirection: 'column', backgroundColor: '#ffffff', borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingHorizontal: 10, height:parseInt(Dimensions.get("window").height/1.2) }}>
                        <View style={{ paddingTop: 20, height: 290 }}>
                            {/* <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{ flex: 1, flexDirection: 'row' }}>
                                <Image source={{ uri: Item.prod_image }} style={{ width: 300, borderWidth: 1, borderColor: '#ebebeb', height: 280, marginLeft: 15, borderRadius: 5, resizeMode: 'contain' }} />
                                {Item.images.map((img, key) => <Image key={key} source={{ uri: img.img_images }} style={{ width: 300, borderWidth: 1, borderColor: '#ebebeb', height: 280, marginLeft: 15, borderRadius: 5, resizeMode: 'contain' }} />)}
                            </ScrollView> */}
                            <FlatList
                                data={images}
                                keyExtractor={(_, index) => index.toString()}
                                horizontal
                                pagingEnabled
                                showsHorizontalScrollIndicator={false}
                                renderItem={({ item, index }) =>
                                    <View style={{width:Dimensions.get("window").width, display:"flex",alignItems:"center", justifyContent:"center"}}>
                                        <Image key={index} source={{ uri: item }} style={{ width: 200,  height: 200, resizeMode: 'contain' }} />
                                    </View>}
                            />
                        </View>
                        <Text style={{ fontSize: 22, fontWeight: '500', paddingHorizontal: 15, paddingVertical: 10 }}>{Item.prod_name}</Text>
                        <View style={{ paddingVertical: 10 }}>
                            {
                                Item.prices.map((price, key) => {
                                    return (
                                        <ListItem key={key} bottomDivider >
                                            <ListItem.Content>
                                                <View style={{ display: "flex", flexDirection: 'row', alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                                                    <View >
                                                        <Text style={{ color: '#a1a1a1' }}>{price.pkg_description}</Text>
                                                        <Text style={{ fontSize: 16, fontWeight: '500' }}>₹ {(quantities[key] == 0) ? price.pkg_discount_cost : (price.pkg_discount_cost * quantities[key]).toFixed(2)}</Text>
                                                    </View>
                                                    <View style={{ width: 80 }}>
                                                        {
                                                            (quantities[key] == 0) ?
                                                                <Button type='outline' buttonStyle={{ borderColor: '#328616', borderWidth: 1, borderRadius: 10, padding: 5 }}
                                                                    onPress={() => {
                                                                        Ren(key, 1);
                                                                        handleCart(price.pkg_id, price.pkg_prod_id, 1);
                                                                    }} titleStyle={{ color: '#328616', fontSize: 14, fontFamily: "RobotoBold" }}>
                                                                    ADD
                                                                </Button> :
                                                                <View style={{ flex: 1, flexDirection: 'row', alignItems: "center", justifyContent: "space-evenly", backgroundColor: "#328616", borderRadius: 10 }}>
                                                                    {/* <Button onPress={() => {
                                                                        const qt = quantities[key] - 1;
                                                                        Ren(key, qt);
                                                                        handleCart(price.pkg_id, price.pkg_prod_id, qt)
                                                                    }} type='solid' color={'#328616'} buttonStyle={{ padding: 5 }} containerStyle={{ flex: 1 }}>-</Button>
                                                                    <Button disabled={true} type='clear' buttonStyle={{ padding: 5 }} titleStyle={{ color: '#000000' }} containerStyle={{ flex: 1 }}><Text>{quantities[key]}</Text></Button>
                                                                    <Button onPress={() => {
                                                                        const qt = quantities[key] + 1;
                                                                        Ren(key, qt);
                                                                        handleCart(price.pkg_id, price.pkg_prod_id, qt)
                                                                    }} type='solid' color={'#328616'} buttonStyle={{ padding: 5 }} containerStyle={{ flex: 1 }}>+</Button> */}
                                                                    <Text
                                                                        onPress={() => {
                                                                            const qt = quantities[key] - 1;
                                                                            Ren(key, qt);
                                                                            handleCart(price.pkg_id, price.pkg_prod_id, qt)
                                                                        }}
                                                                        style={{ fontFamily: "RobotoBold", fontSize: 14, color: "#fff" }}>-</Text>
                                                                    <Text style={{ fontFamily: "RobotoBold", fontSize: 14, color: "#fff" }}>{quantities[key]}</Text>
                                                                    <Text
                                                                        onPress={() => {
                                                                            const qt = quantities[key] + 1;
                                                                            Ren(key, qt);
                                                                            handleCart(price.pkg_id, price.pkg_prod_id, qt)
                                                                        }}
                                                                        style={{ fontFamily: "RobotoBold", fontSize: 14, color: "#fff" }}>+</Text>
                                                                </View>
                                                        }
                                                    </View>
                                                </View>
                                            </ListItem.Content>
                                        </ListItem>
                                    )
                                })
                            }
                        </View>
                        <View style={{ paddingHorizontal: 15, paddingVertical: 10 }}>
                            <Text style={{ fontFamily: "RobotoMedium", fontSize: 16 }}>You might also like</Text>
                            <View style={{ paddingTop: 20 }}>
                                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{ flex: 1, flexDirection: 'row' }}>
                                    {
                                        Related.map((rel, i) => {
                                            return (
                                                <TouchableOpacity key={i} style={{ display: "flex", flexDirection: "column", marginHorizontal: 5, width: 142 }}>
                                                    <View style={{ borderWidth: 1, borderColor: "#ebebeb", padding: 10, borderRadius: 10, width: 142, height: 140, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                                                        <Image source={{ uri: rel.prod_image }} style={{ width: 130, height: 100 }} resizeMode='contain' />
                                                    </View>
                                                    <Text numberOfLines={1} style={{ fontWeight: '500', fontSize: 14, marginTop: 10 }}>{rel.prod_name}</Text>
                                                    {(ShowDet == true) ?
                                                        <>
                                                            <Text style={{ padding: 4, textAlign: 'center', marginTop: 5, marginBottom: 5, borderRadius: 5, borderColor: '#ebebeb', borderWidth: 0.5, fontSize: 13 }}>{rel.prices[0].pkg_description} - ₹ {rel.prices[0].pkg_discount_cost}</Text>
                                                            <Text style={{ textAlign: 'center', fontSize: 12, fontWeight: '400' }}>₹ {rel.prices[0].pkg_discount_cost}</Text>
                                                        </>
                                                        : <>
                                                            <Text style={{ textAlign: 'left', fontSize: 12, marginVertical: 15, fontWeight: '400' }}>{rel.prices[0].pkg_description}</Text>
                                                            <View style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                                                <Text style={{ fontSize: 16, fontWeight: "500" }}>₹{parseInt(rel.prices[0].pkg_discount_cost)}</Text>
                                                                <Button type='outline' buttonStyle={{ borderColor: '#328616', borderWidth: 1, borderRadius: 5, width: 70, height: 30, padding: 0 }}
                                                                    onPress={() => setDetails(true)} titleStyle={{ color: '#328616', fontSize: 14, fontWeight: "800" }}>
                                                                    ADD
                                                                </Button>
                                                            </View>
                                                        </>

                                                    }
                                                </TouchableOpacity>
                                            )
                                        })
                                    }
                                </ScrollView>
                            </View>
                        </View>

                        <View style={{ flex: 1, paddingHorizontal: 15, paddingVertical: 10, marginBottom:20 }}>
                            <Text style={{ fontSize: 16, fontFamily: "RobotoBold" }}>Product Description</Text>
                            <Text style={{ color: '#a1a1a1', fontFamily: "RobotoLight", marginTop: 10 }}>{Item.prod_description}</Text>
                        </View>
                    </ScrollView>
                </BottomSheet>
            </View>
        )
    }
    else {
        return (
            <View style={{ width: 180, height: 180, borderColor: '#ebebeb', borderRadius: 5, borderWidth: 0.5, padding: 12, margin: padding !== undefined ? padding : 0 }}>
            </View>
        )
    }
}
export default ProductCard;


// import { Text, View, Image, Alert, ScrollView } from 'react-native'
// import React, { Component } from 'react'
// import { Button, ButtonGroup } from '@rneui/themed'
// import Icon from 'react-native-vector-icons/AntDesign';
// import { TouchableOpacity } from 'react-native-gesture-handler'
// import { BottomSheet, ListItem } from '@rneui/themed';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import Spinner from 'react-native-loading-spinner-overlay/lib';
// import axios from 'axios';
// import { API_URL } from '../../Init';
// import { addToCart, loadCart } from "../../redux/actions"
// import { connect } from 'react-redux';

// export class ProductCard extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             loading: false,
//             details: false,
//             quantities: [],
//         }
//     }
//     handleCart = async (pkg_id, prod_id, prod_image, prod_name, prod_code, pkg_cost, pkg_description, qt) => {
//         if (this.props.isLogin === false) {
//             Alert.alert('Login Required', 'Please Login to Continue',
//                 [
//                     { text: 'Ok', onPress: () => { } },
//                 ],
//                 { cancelable: true }
//             );
//         }
//         else {
//             await this.props.addToCart(this.props.auth.user_details.c_email, prod_id, pkg_id, qt);
//             await this.props.loadCart(this.props.auth.user_details.c_email);
//         }
//     }
//     render() {
//         return (
//             <View style={{ width: 180, borderColor: '#ebebeb', borderRadius: 5, borderWidth: 0.5, padding: 12, margin: this.props.padding !== undefined ? this.props.padding : 0 }}>
//                 <TouchableOpacity onPress={() => { this.setState({ details: true }) }} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
//                     <Image source={{ uri: this.props.Item.prod_image }} style={{ width: 150, height: 100, resizeMode: 'contain' }} resizeMode='contain' />
//                     <Text numberOfLines={1} style={{ fontWeight: '500', fontSize: 14, textAlign: 'center' }}>{this.props.Item.prod_name}</Text>
//                     {(this.props.ShowDet == true) ?
//                         <>
//                             <Text style={{ padding: 4, textAlign: 'center', marginTop: 5, marginBottom: 5, borderRadius: 5, borderColor: '#ebebeb', borderWidth: 0.5, fontSize: 13 }}>{this.props.Item.prices[0].pkg_description} - ₹ {this.propsItem.prices[0].pkg_discount_cost}</Text>
//                             <Text style={{ textAlign: 'center', fontSize: 12, fontWeight: '400' }}>₹ {this.props.Item.prices[0].pkg_discount_cost}</Text>
//                         </>
//                         : <>
//                             <Text style={{ textAlign: 'center', fontSize: 12, marginTop: 2, fontWeight: '400' }}>{this.props.Item.prices[0].pkg_description} at ₹ {this.props.Item.prices[0].pkg_discount_cost}</Text>
//                         </>

//                     }
//                 </TouchableOpacity>
//                 <Spinner visible={this.state.loading} />
//                 <Button color={'success'} type='outline' buttonStyle={{ borderColor: '#328616', backgroundColor: '#28a74517' }}
//                     onPress={() => this.setState({ details: true })} containerStyle={{ marginTop: 10 }} titleStyle={{ color: '#328616', fontSize: 12 }}>
//                     Add
//                 </Button>
//                 <BottomSheet isVisible={this.state.details}  >
//                     <Icon name={'closecircle'} size={40} onPress={() => { this.setState({ details: false }) }} color={'#000000c2'} style={{ alignSelf: "center", marginBottom: 10 }} />
//                     {/* Floating Cart */}
//                     <ScrollView style={{ display: "flex", flexDirection: 'column', backgroundColor: '#ffffff', borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingHorizontal: 10 }}>
//                         <View style={{ paddingTop: 20 }}>
//                             <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{ flex: 1, flexDirection: 'row' }}>
//                                 <Image source={{ uri: this.props.Item.prod_image }} style={{ width: 300, borderWidth: 1, borderColor: '#ebebeb', height: 280, marginLeft: 15, borderRadius: 5, resizeMode: 'contain' }} />
//                                 {this.props.Item.images.map((img, key) => <Image key={key} source={{ uri: img.img_images }} style={{ width: 300, borderWidth: 1, borderColor: '#ebebeb', height: 280, marginLeft: 15, borderRadius: 5, resizeMode: 'contain' }} />)}
//                             </ScrollView>
//                         </View>
//                         <Text style={{ fontSize: 22, fontWeight: '500', paddingHorizontal: 15, paddingVertical: 10 }}>{this.props.Item.prod_name}</Text>
//                         <View style={{ paddingVertical: 10 }}>
//                             {
//                                 this.props.Item.prices.map((price, key) => {
//                                     return (
//                                         <ListItem key={key} bottomDivider >
//                                             <ListItem.Content>
//                                                 <View style={{ display: "flex", flexDirection: 'row', justifyContent: "space-between", width: "100%" }}>
//                                                     <View >
//                                                         <Text style={{ color: '#a1a1a1' }}>{price.pkg_description}</Text>
//                                                         <Text style={{ fontSize: 16, fontWeight: '500' }}>₹ {(this.state.quantities[key] == 0) ? price.pkg_discount_cost : (price.pkg_discount_cost * this.state.quantities[key]).toFixed(2)}</Text>
//                                                     </View>
//                                                     <View style={{ width: 120 }}>
//                                                         {
//                                                             this.state.quantities[key] === 0 ?
//                                                                 <Button color={'success'} type='outline' buttonStyle={{ borderColor: '#328616', backgroundColor: '#28a74517' }}
//                                                                     onPress={() => {
//                                                                         this.ChangeQt(key, this.state.quantities[key] + 1);
//                                                                         this.handleCart(price.pkg_id, price.pkg_prod_id, this.props.Item.prod_image, this.props.Item.prod_name, this.props.Item.prod_code, price.pkg_cost, price.pkg_description, this.state.quantities[key] + 1);
//                                                                     }} containerStyle={{ marginTop: 10, flex: 1 }} titleStyle={{ color: '#328616', fontSize: 12 }}>
//                                                                     Add
//                                                                 </Button> :
//                                                                 <View style={{ flex: 1, flexDirection: 'row', marginTop: 10, fontSize: 12 }}>
//                                                                     <Button onPress={() => {
//                                                                         this.ChangeQt(key, this.state.quantities[key] - 1);
//                                                                         this.handleCart(price.pkg_id, price.pkg_prod_id, this.props.Item.prod_image, this.props.Item.prod_name, this.props.Item.prod_code, price.pkg_cost, price.pkg_description, this.state.quantities[key] - 1);
//                                                                     }} type='solid' color={'#328616'} buttonStyle={{ padding: 5 }} containerStyle={{ flex: 1 }}>-</Button>
//                                                                     <Button disabled={true} type='clear' buttonStyle={{ padding: 5 }} titleStyle={{ color: '#000000' }} containerStyle={{ flex: 1 }}><Text>{this.state.quantities[key]}</Text></Button>
//                                                                     <Button onPress={() => {
//                                                                         this.ChangeQt(key, this.state.quantities[key] + 1);
//                                                                         this.handleCart(price.pkg_id, price.pkg_prod_id, this.props.Item.prod_image, this.props.Item.prod_name, this.props.Item.prod_code, price.pkg_cost, this.state.quantities[key] + 1);
//                                                                     }} type='solid' color={'#328616'} buttonStyle={{ padding: 5 }} containerStyle={{ flex: 1 }}>+</Button>
//                                                                 </View>
//                                                         }
//                                                     </View>
//                                                 </View>
//                                             </ListItem.Content>
//                                         </ListItem>
//                                     )
//                                 })
//                             }
//                         </View>
//                         <View style={{ flex: 1, paddingHorizontal: 15, paddingVertical: 10 }}>
//                             <Text style={{ fontSize: 16, fontWeight: '400' }}>Product Description</Text>
//                             <Text style={{ color: '#a1a1a1', textAlign: 'justify', marginTop: 3 }}>{this.props.Item.prod_description}</Text>
//                         </View>
//                         <View style={{ flex: 1, paddingHorizontal: 15, paddingVertical: 10 }}>
//                             {(this.props.Related.length == 0) ? <Text style={{ fontSize: 16, fontWeight: '400' }}>Similar Products</Text> : <></>}
//                             <View style={{ flex: 2, paddingTop: 20 }}>
//                                 <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{ flex: 1, flexDirection: 'row' }}>
//                                     {
//                                         this.props.Related.map((rel, i) => {
//                                             return (
//                                                 <TouchableOpacity key={i} style={{ borderColor: '#ebebeb', borderRadius: 5, borderWidth: 1, padding: 12, alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
//                                                     <Image source={{ uri: rel.prod_image }} style={{ width: 180, height: 180 }} resizeMode='contain' />
//                                                     <Text numberOfLines={2} style={{ marginHorizontal: 0, fontWeight: '500', fontSize: 14, textAlign: 'center' }}>{rel.prod_name}</Text>
//                                                     <Text style={{ padding: 5, textAlign: 'center', marginTop: 5, marginBottom: 5, borderRadius: 5, borderColor: '#ebebeb', borderWidth: 0.5 }}>{rel.prices[0].pkg_description} - ₹ {rel.prices[0].pkg_discount_cost}</Text>
//                                                     <Button color={'success'} type='outline' containerStyle={{ flex: 1 }} buttonStyle={{ borderColor: '#328616', backgroundColor: '#28a74517' }} onPress={() => setDetails(true)} titleStyle={{ color: '#328616', fontSize: 12 }}>
//                                                         Add
//                                                     </Button>
//                                                 </TouchableOpacity>
//                                             )
//                                         })
//                                     }
//                                 </ScrollView>
//                             </View>
//                         </View>
//                     </ScrollView>
//                 </BottomSheet>
//             </View>
//         )
//     }
// }
// const mapStateToProps = state => ({
//     auth: state.auth,
//     isLogin: state.isLogin,
//     cart: state.cart,
//     cartPkgId: state.cartPkgId
// })
// export default connect(mapStateToProps, { addToCart, loadCart })(ProductCard)
