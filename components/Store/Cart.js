import { Text, View, Image, ActivityIndicator } from 'react-native'
import React, { Component } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Icon from 'react-native-vector-icons/AntDesign';
import Icon2 from "react-native-vector-icons/Ionicons"
import Icon3 from "react-native-vector-icons/MaterialCommunityIcons"
import Icon4 from "react-native-vector-icons/Entypo"
import { ScrollView } from 'react-native-gesture-handler';
import { Button } from '@rneui/themed'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';
import axios from 'axios';
import { API_URL, HOST } from '../../Init';
import { addToCart, loadCart } from '../../redux/actions';
import { connect } from 'react-redux';
import { TouchableOpacity } from 'react-native';
export class Cart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      totalAmount: 0,
      spinner: false,
      loading: false,
    }
  }
  TopBar = ({ navigation }) => {
    return (
      <View style={{ backgroundColor: '#ffffff', paddingTop: 20, paddingBottom: 15, paddingHorizontal: 20, elevation: 10 }}>
        <View style={{ display: "flex", flexDirection: 'row', alignItems: "center" }}>
          <TouchableOpacity onPress={() => navigation.goBack()} >
            <Icon name="arrowleft" size={25} />
          </TouchableOpacity>
          <Text style={{ fontSize: 20, fontWeight: '500', marginLeft: 20 }}>Checkout</Text>
        </View>
      </View>
    )
  }

  CartList = () => {
    // console.log(this.props.cart)
    return (
      <View style={{ flex: 1, padding: 15, backgroundColor: "#fff", margin: 15, borderRadius: 10, elevation: 1 }}>
        {
          this.props.cart.map((product, key) => {
            return (
              <View key={key} style={{ display: "flex", flexDirection: 'row', alignItems: "center", justifyContent: "space-between", paddingVertical: 5, backgroundColor: '#ffffff', borderRadius: 8, marginVertical: 5 }}>
                <View style={{ display: "flex", flexDirection: "row", alignItems: "flex-start" }}>
                  <View style={{ padding: 10, borderColor: "#ebebeb", borderWidth: 1, borderRadius: 10 }}>
                    <Image style={{ height: 50, width: 50, resizeMode: 'contain' }} source={{ uri: product.image }} />
                  </View>
                  <View style={{ marginLeft: 20, width: "50%" }}>
                    <Text style={{ fontSize: 14, fontFamily: "RobotoMedium" }} numberOfLines={2}>{product.product_name}</Text>
                    <Text style={{ color: "#494f55", fontSize: 12, fontFamily: "RobotoRegular", marginTop: 5 }}>{product.description}</Text>
                    <Text style={{ color: '#333', fontFamily: "RobotoBold", marginTop: 5 }}>₹ {parseInt(product.unit_price)}</Text>
                  </View>
                </View>
                {/* <Icon name='close' onPress={async () => {
                    this.setState({ spinner: true })
                    await this.props.addToCart(this.props.auth.user_details.c_email, product.product_id, product.pkg_id, 0);
                    await this.props.loadCart(this.props.auth.user_details.c_email);
                    this.setState({ spinner: false })
                  }} size={15} /> */}
                <View style={{ display: "flex", flexDirection: "row", alignItems: "center", width: 70, justifyContent: "space-around", backgroundColor: "#328616", borderRadius: 6 }}>
                  <Text
                    onPress={async () => {
                      this.setState({ loading: true });
                      await this.props.addToCart(this.props.auth.user_details.c_email, product.product_id, product.pkg_id, parseInt(product.qty)-1)
                      await this.props.loadCart(this.props.auth.user_details.c_email);
                      this.setState({ loading: false });
                    }}
                    style={{ color: "#fff", fontFamily: "RobotoBold", padding: 5 }}>-</Text>
                  <Text style={{ color: "#fff", fontFamily: "RobotoBold", padding: 5 }}>{product.qty}</Text>
                  <Text
                    onPress={async () => {
                      this.setState({ loading: true });
                      await this.props.addToCart(this.props.auth.user_details.c_email, product.product_id, product.pkg_id, parseInt(product.qty)+1)
                      await this.props.loadCart(this.props.auth.user_details.c_email);
                      this.setState({ loading: false });
                    }}
                    style={{ color: "#fff", fontFamily: "RobotoBold", padding: 5 }}>+</Text>
                </View>
              </View>
            )
          })
        }
      </View>
    )
  }
  Empty = () => {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 15 }}>
        <Text>No Items found on your cart list</Text>
      </View>
    )
  }

  AddtoCart = async (product_id, pkg_id, qty) => {
    try {
      const email = this.state.auth.c_email;
      const data = new FormData();
      data.append('email', email);
      data.append('product_id', product_id);
      data.append('pkg_id', pkg_id);
      data.append('qty', qty);
      await axios({
        method: 'POST',
        url: API_URL + 'addToCart',
        data: data,
        headers: { "Content-Type": "multipart/form-data" },
      }).then((res) => {
        console.log(res.data);
      }).catch(err => {
        console.log(err)
      })
    } catch (error) {
      console.log(error);
    }
  }

  Checkout = async () => {
    this.setState({ spinner: true });
    if (this.state.auth.login == true) {
      try {
        const email = this.state.auth.user_details.c_email;
        const data = new FormData();
        data.append('c_email', email);
        await axios({
          method: 'POST',
          url: API_URL + 'myCartList',
          data: data,
          headers: { "Content-Type": "multipart/form-data" },
        }).then((res) => {
          console.log(res.data);
        }).catch(err => {
          console.log(err)
        })
      } catch (error) {

      }
      this.setState({ spinner: false });
      try {
        this.props.route.params.rootNav.navigate('Checkout');
      } catch (error) {
        console.log(error);
      }

    } else {
      this.props.route.params.rootNav.navigate('SignIn');
    }
    //

  }
  render() {
    if (this.props.cart.length === 0) {
      this.props.navigation.goBack();
    }
    return (
      <View style={{ flex: 1, backgroundColor: "#f4f6fb" }}>
        <Spinner visible={this.state.spinner} />
        <this.TopBar navigation={this.props.navigation} />
        <ScrollView showsVerticalScrollIndicator={false}>
          {
            (this.props.cart.length != 0) ? <this.CartList /> : <this.Empty />
          }
          <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 20, backgroundColor: "#fff", margin: 15, borderRadius: 10, elevation: 1 }}>
            <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
              <Icon3 name='brightness-percent' color={"blue"} size={20} />
              <Text style={{ fontFamily: "RobotoMedium", fontSize: 20, marginLeft: 20 }}>Use Coupons</Text>
            </View>
            <Icon name='right' size={18} />
          </View>
          <View style={{ flex: 1, backgroundColor: "#fff", margin: 15, elevation: 1, borderRadius: 10, padding: 20 }}>
            <Text style={{ fontFamily: "RobotoBold", fontSize: 16 }}>Bill details</Text>
            <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
              <Text style={{ fontFamily: "RobotoRegular" }}>Item total (incl. taxes)</Text>
              <Text style={{fontFamily:"RobotoMedium"}}>₹ {this.props.cartAmount}</Text>
            </View>
            <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
              <View style={{display:"flex", flexDirection:"row"}}>
                <Text style={{ fontFamily: "RobotoRegular" }}>Delivery charge</Text>
                <View style={{ padding: 2, borderWidth: 1, borderRadius: 50, borderColor: "#000", width:16 , marginLeft:3}}>
                  <Icon4 name='info' size={10} />
                </View>
              </View>
              <Text style={{fontFamily:"RobotoMedium"}}>₹ 15</Text>
            </View>
            <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
              <Text style={{ fontFamily: "RobotoBold" }}>Grand total</Text>
              <Text style={{ fontFamily: "RobotoBold" }}>₹ {this.props.cartAmount+15}</Text>
            </View>
          </View>
          <View style={{flex:1, backgroundColor:"#fff", borderRadius:10, elevation:1,margin:15, padding:20}}>
            <Text style={{fontFamily:"RobotoBold", fontSize:14}}>Cancellation Policy</Text>
            <Text style={{fontFamily:"RobotoLight", fontSize:14, marginTop:10}}>Orders cannot be cancelled once packed for delivery. In case of unexpected delays, a refumd will be provided if applicable. </Text>
          </View>
        </ScrollView>
        {
          (this.props.cart.length != 0) ?
            <View style={{ padding: 10, backgroundColor: "#fff" }}>
              <View style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingBottom: 20 }}>
                <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                  <Icon2 name='location-outline' size={20} color={"#328616"} />
                  <View style={{ display: "flex", flexDirection: "column", marginLeft: 10 }}>
                    <Text style={{ fontFamily: "RobotoBold" }}>Delivering to home</Text>
                    <Text style={{ fontFamily: "RobotoRegular", fontSize: 12 }}>Govt polytechnic gate Shantinagar Colony, Masab Tank</Text>
                  </View>
                </View>
                <Button type='clear' titleStyle={{ fontSize: 14, color: "#328616" }}>Change</Button>
              </View>
              <Button type='solid' color={"#328616"} buttonStyle={{ borderRadius: 10, height: 40 }} titleStyle={{ fontFamily: "RobotoRegular" }}>
                {this.state.loading ? <ActivityIndicator color={"#fff"} /> : "Select payment option"}
              </Button>
            </View>
            : <></>
        }
      </View>
    )
  }

}
const mapStateToProps = state => ({
  cart: state.cart,
  isLogin: state.isLogin,
  cartAmount: state.cartAmount,
  auth: state.auth
})
export default connect(mapStateToProps, { addToCart, loadCart })(Cart)

{/* <Button onPress={() => { this.Checkout(); }} type='solid' color='#66ac34' containerStyle={{ position: 'absolute', bottom: 0, width: '100%', padding: 15 }} buttonStyle={{ padding: 18, borderRadius: 8 }}>
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ flex: 1, fontSize: 16, fontWeight: '500', color: '#ffffff', marginLeft: 10 }}>
                  <Icon name='shoppingcart' size={18} color={'#ffffff'} />  Checkout
                  <Text style={{ fontSize: 12, color: '#ffffff' }}>   ₹{this.props.cartAmount}</Text>
                </Text>
                <Text style={{ flex: 1, textAlign: 'right', marginRight: 10, fontSize: 12, color: '#ffffff' }}>
                  <Icon name='doubleright' size={18} color={'#ffffff'} />
                </Text>
              </View>
            </Button> */}