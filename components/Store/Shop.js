import React, { Component } from 'react'
import { Text, View } from 'react-native'
import Header from './Header'
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native';
import { Image } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { connect } from 'react-redux';
import { loadFeaturedProducts, setSelectedCategory } from "../../redux/actions"
import { HOST } from '../../Init';
import { TouchableOpacity } from 'react-native';
import Icon from "react-native-vector-icons/AntDesign"
import ProductCard from '../UI/ProductCard';
import FloatingCart from '../UI/FloatingCart';
import { Dimensions } from 'react-native';
import Icon2 from "react-native-vector-icons/Ionicons"

export class Shop extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    }
  }
  // async componentDidMount() {
  //   this.setState({ loading: true });
  //   await this.props.loadFeaturedProducts();
  //   this.setState({ loading: false });
  // }
  handleSelectCategory = async (id, name) => {
    this.setState({ loading: true });
    await this.props.setSelectedCategory(this.props.categories, id,name, "Shop");
    setTimeout(() => {
      this.setState({ loading: false });
      this.props.navigation.navigate('Products');
    }, 1000)
  }
  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <Spinner visible={this.state.loading} />
          <Header drawerToggle={this.props.navigation}/>
        <ScrollView showsVerticalScrollIndicator={false} style={{ paddingHorizontal: 10 }} >
          <View style={{ marginVertical: 30 }}>
            <ScrollView showsHorizontalScrollIndicator={false} horizontal={true} >
              <Image source={require('../../assets/slider4.jpg')} style={{ width: Dimensions.get("window").width - 20, height: 140, borderRadius: 10, resizeMode: 'contain' }} />
              {this.props?.banners?.map((item, index) => <Image key={index} source={{ uri: item.banner_image }} style={{ width: 340, marginRight: 10, height: 120, borderRadius: 10, resizeMode: 'contain' }} />)}
            </ScrollView>
          </View>
          {
            this.props?.featuredProducts.map((item, key) => {
              var banner = null;
              if (item.cat_banner != null) {
                banner = HOST + 'assets/frontEnd/images/category/' + item.cat_banner;
              }
              return (
                <View key={key}>
                  {
                    (item.cat_banner != null) ? <TouchableOpacity onPress={() => this.handleSelectCategory(item.cat_id, item.cat_name)}><Image source={{ uri: banner }} style={{ width: '100%', padding: 15, height: 120, borderRadius: 10, resizeMode: 'contain', marginBottom: 10 }} /></TouchableOpacity> : <></>
                  }
                  <View style={{ flex: 1, marginBottom: 5 }}>
                    <View style={{ flex: 1, padding: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                      <Text style={{ fontSize: 17, fontWeight: '500', flex: 8, paddingVertical: 5, fontFamily: "RobotoMedium" }}>{item.cat_name}</Text>
                      <Text onPress={() => this.handleSelectCategory(item.cat_id, item.cat_name)} style={{ flex: 4, textAlign: 'right', paddingVertical: 5, color: '#328616', fontFamily: "RobotoMedium" }}>View all <Icon name={'rightcircle'} size={13} /></Text>
                    </View>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                      {
                        item.products.map((product, key) => {
                          return (
                            <View key={key} style={{ flex: 1, paddingTop: 8, paddingBottom: 18, width: 160 }}>
                              <ProductCard ShowDet={false} AddtoCart={this.AddtoCart} Item={product} Related={item.products} />
                            </View>
                          )
                        })
                      }
                    </ScrollView>
                  </View>
                </View>
              )
            })
          }
        </ScrollView>
        {
          (this.state.cart != 0) ? <FloatingCart Navigation={this.props.navigation} Cart={this.CartData} /> : <></>
        }
        <FloatingCart Navigation={this.props.navigation} />
      </SafeAreaView>
    )
  }
}
const mapStateToProps = state => ({
  featuredProducts: state.featuredProducts,
  cart: state.cart,
  cartPkgId: state.cartPkgId,
  categories: state.categories,
  subCategories: state.subCategories
})
export default connect(mapStateToProps, { loadFeaturedProducts, setSelectedCategory })(Shop)
