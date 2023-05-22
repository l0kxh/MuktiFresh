import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import React, { Component } from 'react'
import { ActivityIndicator, Dimensions, Modal, Text, TouchableOpacity, View } from 'react-native'
import Store from "./components/Store"
import SignIn from "./components/SignIn"
import SignUp from "./components/SignUp"
import Product from "./components/Store/Product"
import Account from "./components/Account"
import Wallet from "./components/Wallet"
import Orders from "./components/Orders"
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@rneui/themed';
import { Image } from 'react-native';
import Icon from "react-native-vector-icons/AntDesign"
import Icon2 from "react-native-vector-icons/Ionicons"
import Icon3 from "react-native-vector-icons/MaterialCommunityIcons"
import Icon4 from "react-native-vector-icons/FontAwesome"
import { connect } from 'react-redux';
import Lottie from "lottie-react-native"
import { checkIfLogin, logout, loadFeaturedProducts, loadCategories, loadCart } from "./redux/actions"
import Spinner from 'react-native-loading-spinner-overlay';
import { Alert } from 'react-native';
import Products from './components/Store/Products';
import axios from 'axios';
import { API_URL } from './Init';
import Shop from './components/Store/Shop';
import Cart from './components/Store/Cart';

export class Route extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            showLogout: false,
            logoutLoading: false,
        }
    }
    async componentDidMount() {
        this.setState({ loading: true });
        await this.props.checkIfLogin();
        await this.LoadBanners();
        await this.props.loadFeaturedProducts();
        await this.props.loadCategories();
        if (this.props.isLogin) {
            await this.props.loadCart(this.props.auth.user_details.c_email, null);
        }
        this.setState({ loading: false });
    }
    LoadBanners = async () => {
        await axios.post(API_URL + 'banners')
            .then(res => this.setState({ banners: res.data.message }))
            .catch(err => console.log(err))
    }
    LogoutModal = () => {
        return (
            <Modal
                animationType='fade'
                transparent={true}
                visible={true}
            >
                <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
                    <View style={{ display: "flex", flexDirection: "column", alignItems: "center", backgroundColor: "#fff", elevation: 100, width: "80%", padding: 15, borderRadius: 10 }}>
                        <Text style={{ fontFamily: "RobotoMedium", fontSize: 16 }}>LOG OUT</Text>
                        <Text style={{ fontFamily: "RobotoLight", fontSize: 14, marginTop: 5 }}>Are you sure you want to logout</Text>
                        <View style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 5, width: "100%", paddingHorizontal: 45 }}>
                            <Button
                                onPress={() => this.setState({ showLogout: false })}
                                type='clear' titleStyle={{ color: "#328616", fontSize: 14 }}>Cancel</Button>
                            <Button
                                onPress={async () => {
                                    this.setState({ logoutLoading: true });
                                    this.setState({ showLogout: false });
                                    await this.props.logout();
                                    this.setState({ logoutLoading: false })
                                }}
                                type='clear' titleStyle={{ color: "#328616", fontSize: 14 }}>Logout</Button>
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }
    Drawer = ({ navigation }) => {
        return (
            <View style={{ flex: 1 }}>
                <Spinner visible={this.state.logoutLoading} />
                <View style={{ padding: 20, display: "flex", flexDirection: "row", alignItems: "center", elevation: 100, backgroundColor: "#fff", paddingTop: 20 }}>
                    <Icon name='arrowleft' size={25} onPress={() => navigation.closeDrawer()} />
                    <Text style={{ fontFamily: "RobotoMedium", fontSize: 16, marginLeft: 15 }}>Profile</Text>
                </View>
                {this.props.isLogin ?
                    <View style={{ marginTop: 20, paddingHorizontal: 15, marginBottom: 15 }}>
                        <Text style={{ fontFamily: "RobotoMedium", fontSize: 22 }}>{this.props.auth.user_details?.c_fullname}</Text>
                        <Text style={{ fontFamily: "RobotoLight", fontSize: 18, marginTop: 5 }}>{this.props.auth.user_details?.c_phone}</Text>
                    </View>
                    :
                    <View style={{ marginTop: 20, paddingHorizontal: 15, marginBottom: 15 }}>
                    <Text style={{fontFamily:"RobotoMedium", fontSize:24}}>My account</Text>
                    <Text style={{fontFamily:"RobotoLight",fontSize:14, marginTop:10}}>Log in or sign up to view your complete profile</Text>
                    <Button  type='outline' 
                    onPress={()=>navigation.navigate('SignIn')}
                    buttonStyle={{borderColor:"#328616", borderWidth:1, borderRadius:10, height:50, marginTop:20}}
                    titleStyle={{color:"#328616",fontFamily:"RobotoRegular"}}
                    >Continue</Button>
                    </View>
                }
                <View style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: "#ebf3ff", margin: 15, borderRadius: 10, paddingBottom: 10, paddingHorizontal: 40, paddingTop: 15 }}>
                    <TouchableOpacity onPress={()=>navigation.navigate('Wallet')} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <Icon2 name='wallet-outline' size={20} />
                        <Text style={{ fontFamily: "RobotoRegular", marginTop: 5, fontSize: 14 }}>Wallet</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <Icon3 name='message-reply-text-outline' size={20} />
                        <Text style={{ fontFamily: "RobotoRegular", marginTop: 5, fontSize: 14 }}>Support</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <Icon2 name='card-outline' size={20} />
                        <Text style={{ fontFamily: "RobotoRegular", marginTop: 5, fontSize: 14 }}>Payments</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ padding: 15 }}>
                    <Text style={{ fontSize: 14, color: "grey", fontFamily: "RobotoMedium", marginVertical: 15 }}>YOUR INFORMATION</Text>
                    <View style={{ display: "flex", flexDirection: "row", alignItems: "center", marginVertical: 10 }}>
                        <View style={{ borderRadius: 50, backgroundColor: "#ebf3ff", padding: 10, width: 35 }}>
                            <Icon2 name='ios-newspaper-outline' size={15} color={"grey"} />
                        </View>
                        <Text style={{ fontFamily: "RobotoRegular", fontSize: 15, marginLeft: 15 }}>Your Orders</Text>
                    </View>
                    <View style={{ display: "flex", flexDirection: "row", alignItems: "center", marginVertical: 10 }}>
                        <View style={{ borderRadius: 50, backgroundColor: "#ebf3ff", padding: 10, width: 35 }}>
                            <Icon4 name='address-book-o' size={15} color={"grey"} />
                        </View>
                        <Text style={{ fontFamily: "RobotoRegular", fontSize: 15, marginLeft: 15 }}>Address book</Text>
                    </View>
                </View>
                <View style={{ padding: 15, paddingTop: 0 }}>
                    <Text style={{ fontSize: 14, color: "grey", fontFamily: "RobotoMedium", marginVertical: 15 }}>OTHER INFORMATION</Text>
                    <View style={{ display: "flex", flexDirection: "row", alignItems: "center", marginVertical: 10 }}>
                        <View style={{ borderRadius: 50, backgroundColor: "#ebf3ff", padding: 10, width: 35 }}>
                            <Icon2 name='ios-arrow-redo-outline' size={15} color={"grey"} />
                        </View>
                        <Text style={{ fontFamily: "RobotoRegular", fontSize: 15, marginLeft: 15 }}>Share the app</Text>
                    </View>
                    <View style={{ display: "flex", flexDirection: "row", alignItems: "center", marginVertical: 10 }}>
                        <View style={{ borderRadius: 50, backgroundColor: "#ebf3ff", padding: 10, width: 35 }}>
                            <Icon2 name='information-circle-outline' size={15} color={"grey"} />
                        </View>
                        <Text style={{ fontFamily: "RobotoRegular", fontSize: 15, marginLeft: 15 }}>About us</Text>
                    </View>
                    {this.props.isLogin &&
                        <TouchableOpacity
                            onPress={() => this.setState({ showLogout: true })}
                            style={{ display: "flex", flexDirection: "row", alignItems: "center", marginVertical: 10 }}>
                            <View style={{ borderRadius: 50, backgroundColor: "#ebf3ff", padding: 10, width: 35 }}>
                                <Icon2 name='power' size={15} color={"grey"} />
                            </View>
                            <Text style={{ fontFamily: "RobotoRegular", fontSize: 15, marginLeft: 15 }}>Logout</Text>
                        </TouchableOpacity>
                    }
                    {this.state.showLogout && this.LogoutModal()}
                </View>
            </View>
        )
    }
    // Drawer = ({ navigation }) => {
    //     return (
    //         <SafeAreaView style={{ flex: 1 }}>
    //             <Spinner visible={this.state.loading} />
    //             <View style={{ flex: 1, padding: 15 }}>
    //                 <View style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 20, marginBottom: 20 }}>
    //                     <Image source={require('./assets/logo.png')} style={{ width: '50%', resizeMode: 'contain' }} />
    //                 </View>
    //                 <Button onPress={() => { navigation.navigate('Store'); }} type='clear' buttonStyle={{ width: '100%', justifyContent: 'flex-start', borderRadius: 5, padding: 10 }} containerStyle={{ alignItems: 'flex-start', padding: 5 }} titleStyle={{ color: '#66ac34' }}>
    //                     <Icon name='basket-outline' color='#66ac34' size={18} /> Shop
    //                 </Button>
    //                 <Button type='clear' buttonStyle={{ width: '100%', justifyContent: 'flex-start', borderRadius: 5, padding: 10 }} containerStyle={{ alignItems: 'flex-start', padding: 5 }} titleStyle={{ color: '#66ac34' }}>
    //                     <Icon name='help-circle-outline' color='#66ac34' size={18} /> Help Center
    //                 </Button>
    //                 {
    //                     (this.props.isLogin === true) ?
    //                         <>
    //                             <Button onPress={() => { navigation.navigate('Orders'); }} type='clear' buttonStyle={{ width: '100%', justifyContent: 'flex-start', borderRadius: 5, padding: 10 }} containerStyle={{ alignItems: 'flex-start', padding: 5 }} titleStyle={{ color: '#66ac34' }}>
    //                                 <Icon name='cart-outline' color='#66ac34' size={18} /> Orders
    //                             </Button>
    //                             <Button type='clear' onPress={() => { navigation.navigate('Wallet'); }} buttonStyle={{ width: '100%', justifyContent: 'flex-start', borderRadius: 5, padding: 10 }} containerStyle={{ alignItems: 'flex-start', padding: 5 }} titleStyle={{ color: '#66ac34' }}>
    //                                 <Icon name='wallet-outline' color='#66ac34' size={18} /> Wallet
    //                             </Button>
    //                             <Button onPress={() => { navigation.navigate('Account'); }} type='clear' buttonStyle={{ width: '100%', justifyContent: 'flex-start', borderRadius: 5, padding: 10 }} containerStyle={{ alignItems: 'flex-start', padding: 5 }} titleStyle={{ color: '#66ac34' }}>
    //                                 <Icon name='person-outline' color='#66ac34' size={18} /> Account
    //                             </Button>
    //                             <Button
    // onPress={() => {
    //     navigation.toggleDrawer();
    //     Alert.alert('Confirm', 'Are you sure want to login?', [
    //         {
    //             text: 'Yes', onPress: async () => {
    //                 this.setState({ loading: true });
    //                 await this.props.logout();
    //                 this.setState({ loading: false });
    //             }
    //         },
    //         { text: 'No', onPress: () => { } }
    //     ])
    // }}
    //                                 type='clear' buttonStyle={{ width: '100%', justifyContent: 'flex-start', borderRadius: 5, padding: 10 }} containerStyle={{ alignItems: 'flex-start', padding: 5 }} titleStyle={{ color: '#66ac34' }}>
    //                                 <Icon name='log-out-outline' color='#66ac34' size={18} /> Logout
    //                             </Button>
    //                         </>
    //                         :
    //                         <>
    //                             <Button onPress={() => { navigation.navigate('SignIn'); }} type='clear' buttonStyle={{ width: '100%', justifyContent: 'flex-start', borderRadius: 5, padding: 10 }} containerStyle={{ alignItems: 'flex-start', padding: 5 }} titleStyle={{ color: '#66ac34' }}>
    //                                 <Icon name='cart-outline' color='#66ac34' size={18} /> Login
    //                             </Button>
    //                             <Button onPress={() => { navigation.navigate('SignUp'); }} type='clear' buttonStyle={{ width: '100%', justifyContent: 'flex-start', borderRadius: 5, padding: 10 }} containerStyle={{ alignItems: 'flex-start', padding: 5 }} titleStyle={{ color: '#66ac34' }}>
    //                                 <Icon name='wallet-outline' color='#66ac34' size={18} /> Register
    //                             </Button>
    //                         </>
    //                 }
    //             </View>
    //         </SafeAreaView>
    //     )
    // }
    render() {
        const Drawer = createDrawerNavigator();
        return (
            this.state.loading ? <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Lottie source={require('./assets/loading.json')} style={{  transform: [{ scale: 0.8 }] }} autoPlay loop />
            </View> :
                <NavigationContainer>
                    <Drawer.Navigator screenOptions={{
                        drawerPosition: "right",
                        drawerStyle: {
                            width: Dimensions.get('window').width
                        },
                        // swipeEdgeWidth : Dimensions.get("window").width-40
                    }} initialRouteName="Shop" drawerContent={({ navigation }) => <this.Drawer navigation={navigation} />}>
                        <Drawer.Screen name="Shop" component={Shop} options={{ headerShown: false }} />
                        <Drawer.Screen name="Product" component={Product} options={{ headerShown: false }} />
                        <Drawer.Screen name="SignIn" component={SignIn} options={{ headerShown: false }} />
                        <Drawer.Screen name="SignUp" component={SignUp} options={{ headerShown: false }} />
                        <Drawer.Screen name="Account" component={Account} options={{ headerShown: false }} />
                        <Drawer.Screen name="Wallet" component={Wallet} options={{ headerShown: false }} />
                        <Drawer.Screen name="Orders" component={Orders} options={{ headerShown: false }} />
                        <Drawer.Screen name='Products' component={Products} options={{ headerShown: false }} />
                        <Drawer.Screen name='Cart' component={Cart} options={{headerShown:false}} />
                    </Drawer.Navigator>
                </NavigationContainer>
        )
    }
}
const mapStateToProps = state => ({
    isLogin: state.isLogin,
    featuredProducts: state.featuredProducts,
    auth: state.auth,
    cart: state.cart
});
export default connect(mapStateToProps, { checkIfLogin, logout, loadFeaturedProducts, loadCategories, loadCart })(Route);
