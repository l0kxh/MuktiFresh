import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { Component } from 'react'
import { Text, View } from 'react-native'
import Cart from "./Store/Cart"
import Checkout from "./Store/Checkout"
import Home from "./Store/Home"
import Empty from "./Store/Empty"
import Shop from "./Store/Shop"
import Products from "./Store/Products"
import Categories from "./Store/Categories"
import { TouchableOpacity } from 'react-native';
import Icon from "react-native-vector-icons/Ionicons"
import { API_URL } from "../Init"
import axios from 'axios';
import Spinner from 'react-native-loading-spinner-overlay';
import { connect } from 'react-redux';
import { loadCart, loadCategories, loadFeaturedProducts } from "../redux/actions"
import { ActivityIndicator } from 'react-native';


export class Store extends Component {
  constructor(props) {
    super(props);
    this.state = {
      root_nav: this.props.navigation,
      banners: [],
      loading: false,
    }
  }
  async componentDidMount() {
    this.setState({ loading: true });
    await this.LoadBanners();
    await this.props.loadFeaturedProducts();
    await this.props.loadCategories();
    if(this.props.isLogin){
      await this.props.loadCart(this.props.auth.user_details.c_email);
    }
    this.setState({ loading: false });
  }
  ToggleDrawer = () => {
    this.state.root_nav.toggleDrawer();
  }
  LoadBanners = async () => {
    await axios.post(API_URL + 'banners')
      .then(res => this.setState({ banners: res.data.message }))
      .catch(err => console.log(err))
  }
  BottomNav = ({ descriptors, state, navigation }) => {
    const focusedOptions = descriptors[state.routes[state.index].key].options;
    if (focusedOptions?.tabBarStyle?.display === "none") {
      return null;
    }
    return (
      <View style={{ display: "flex", backgroundColor: '#ffffff', height: 72, borderTopColor: '#ebebeb', borderWidth: 1, flexDirection: "row", justifyContent: "space-evenly", alignItems: "center" }}>
        <TouchableOpacity onPress={() => { navigation.navigate('Home'); }} style={{ display: "flex", alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="home-outline" color={'#66ac34'} size={25} />
          <Text style={{ fontSize: 10, color: '#66ac34' }}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { navigation.navigate('Categories'); }} style={{ display: "flex", alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="apps-outline" color={'#66ac34'} size={25} />
          <Text style={{ fontSize: 10, color: '#66ac34' }}>Categories</Text>
        </TouchableOpacity>
        <View style={{
          display: "flex",
          justifyContent: 'center', alignItems: 'center',
          bottom: 20, // space from bottombar
          height: 75,
          width: 75,
          borderRadius: 50,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#66ac34'
        }}
          onTouchStart={() => {
            navigation.navigate('Shop');
          }}>
          <Icon name="basket-outline" color={'#ffffff'} size={30} />
        </View>
        <TouchableOpacity onPress={() => { navigation.navigate('Cart'); }} style={{ display: "flex", alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="cart-outline" color={'#66ac34'} size={25} />
          <Text style={{ fontSize: 10, color: '#66ac34' }}>Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { }} style={{ display: "flex", alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="pricetags-outline" color={'#66ac34'} size={25} />
          <Text style={{ fontSize: 10, color: '#66ac34' }}>Offers</Text>
        </TouchableOpacity>
      </View>
    )
  }
  render() {
    const Tab = createBottomTabNavigator();
    return (
      this.state.loading ? <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
        <ActivityIndicator size={"large"} color={"#284DD1"} />
      </View>:
      <>
        <Spinner visible={this.state.loading} />
        <Tab.Navigator
          initialRouteName='Shop'
          tabBar={(props) => <this.BottomNav {...props} />}
          screenOptions={{
            tabBarActiveTintColor: '#66ac34',
            tabBarStyle: {
              height: 65,
              paddingBottom: 15,
              paddingTop: 8,
              backgroundColor: '#ffffff'
            }
          }}>
          <Tab.Screen
            name="Home"
            options={{
              headerShown: false, tabBarLabel: 'Home',
              tabBarIcon: ({ color, size }) => (<Icon name="home-outline" color={color} size={size} />)
            }}>
            {({ navigation }) => <Home banners={this.state.banners} navigation={navigation} rootNav={this.state.root_nav} UpdateCart={this.UpdateCart} CartData={this.CartData} Cart={this.CartData} drawerToggle={this.ToggleDrawer} />
            }
          </Tab.Screen>

          {/* <Tab.Screen
            name="Products"
            options={{
              tabBarStyle: {
                display: "none",
              },
              headerShown: false, tabBarLabel: 'Products',
              tabBarIcon: ({ color, size }) => (<Icon name="apps-outline" color={color} size={size} />)
            }}>
            {({ navigation }) => <Products GetProductCaller={this.GetProductCaller} SetSelectedCategoryID={this.SetSelectedCategoryID} GetSelectedCategoryID={this.GetSelectedCategoryID} GetSelectedCategoryProducts={this.GetSelectedCategoryProducts} GetSelectedCategory={this.GetSelectedCategory} navigation={navigation} rootNav={this.state.root_nav} UpdateCart={this.UpdateCart} CartData={this.CartData} Cart={this.CartData} drawerToggle={this.ToggleDrawer} />
            }
          </Tab.Screen> */}
          <Tab.Screen
            name="Categories"
            options={{
              headerShown: false, tabBarLabel: 'Categories',
              tabBarIcon: ({ color, size }) => (<Icon name="apps-outline" color={color} size={size} />)
            }}>
            {({ navigation }) => <Categories SetProductCaller={this.SetProductCaller} SetSelectedCategoryID={this.SetSelectedCategoryID} GetSelectedCategoryID={this.GetSelectedCategoryID} GetSelectedCategoryProducts={this.GetSelectedCategoryProducts} SetSelectedCategoryProducts={this.SetSelectedCategoryProducts} GetSelectedCategory={this.GetSelectedCategory} SetSelectedCategory={this.SetSelectedCategory} navigation={navigation} rootNav={this.state.root_nav} UpdateCart={this.UpdateCart} CartData={this.CartData} Cart={this.CartData} drawerToggle={this.ToggleDrawer} />
            }
          </Tab.Screen>
          <Tab.Screen
            name="Shop"
            options={{
              headerShown: false, tabBarLabel: 'Shop',
              tabBarLabel: '',
              tabBarIcon: () => (
                <View
                  style={{
                    position: 'absolute',
                    bottom: 0, // space from bottombar
                    height: 70,
                    width: 70,
                    borderRadius: 70,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#66ac34'
                  }}>
                  <Icon name="basket-outline" color={'#ffffff'} size={30} />
                </View>
              )
            }} >
            {({ navigation }) => <Shop SetProductCaller={this.SetProductCaller} SetSelectedCategoryID={this.SetSelectedCategoryID} navigation={navigation} banners={this.state.banners} rootNav={this.state.root_nav} UpdateCart={this.UpdateCart} SetSelectedCategoryProducts={this.SetSelectedCategoryProducts} CartData={this.CartData} SetSelectedCategory={this.SetSelectedCategory} Cart={this.CartData} drawerToggle={this.ToggleDrawer} />
            }</Tab.Screen>

          <Tab.Screen
            name="Cart"
            options={{
              headerShown: false, tabBarLabel: 'Cart',
              tabBarStyle: {
                display: "none",
              },
              tabBarIcon: ({ color, size }) => (<Icon name="cart-outline" color={color} size={size} />)
            }} component={Cart}
            initialParams={{ rootNav: this.state.root_nav, UpdateCart: this.UpdateCart, Cart: this.CartData }}
          />
          <Tab.Screen
            name="Checkout"
            options={{
              headerShown: false, tabBarLabel: 'Cart',
              tabBarStyle: {
                display: "none",
              },
              tabBarIcon: ({ color, size }) => (<Icon name="cart-outline" color={color} size={size} />)
            }} component={Checkout}
            initialParams={{ rootNav: this.state.root_nav, UpdateCart: this.UpdateCart, Cart: this.CartData }}
          />
          <Tab.Screen
            name="Offer"
            options={{
              headerShown: false, tabBarLabel: 'Offer',
              tabBarIcon: ({ color, size }) => (<Icon name="pricetags-outline" color={color} size={size} />)
            }} component={Empty} />
        </Tab.Navigator>
      </>
    )
  }
}
const mapStateToProps = state => ({
  isLogin: state.isLogin,
  featuredProducts: state.featuredProducts,
  auth: state.auth,
  cart : state.cart
});
export default connect(mapStateToProps, { loadFeaturedProducts, loadCategories,loadCart })(Store)
