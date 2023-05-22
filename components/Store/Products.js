import React, { Component } from 'react'
import { BackHandler, Dimensions, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Header from './Header'
import { FlatList } from 'react-native'
import { connect } from 'react-redux'
import ProductCard from '../UI/ProductCard'
import FloatingCart from '../UI/FloatingCart'
import { loadCategoryWiseProducts } from '../../redux/actions'
import { Image } from 'react-native'
import { ActivityIndicator } from 'react-native'
import Icon from "react-native-vector-icons/Ionicons"
import { StyleSheet } from 'react-native'

export class Products extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCategory: {},
      loading: false,
      products: []
    }
    this.props.navigation.addListener("focus", () => {
      this.setState({ selectedCategory: this.props.subCategories !== undefined && this.props.subCategories[0] !== undefined ? this.props.subCategories[0] : {} });
      this.setState({ products: [] })
      this.handleChange(this.props.subCategories !== undefined && this.props.subCategories[0] !== undefined ? this.props.subCategories[0] : {});

    })
  }
  async componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton.bind(this));
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton.bind(this));
  }
  handleBackButton() {
    this.props.navigation.navigate(this.props.productCaller);
    return true;
  }
  EmptyList = () => {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: '#a1a1a1', textAlign: 'center' }}>No Products found on the selected subcategory!</Text>
      </View>
    )
  }
  handleChange = async (Item) => {
    this.setState({ loading: true });
    this.setState({ selectedCategory: Item })
    if (Object.keys(Item).length !== 0) {
      if (this.props.categoryWiseProducts.filter(item => item.cat_slug === Item.cat_slug).length === 0) {
        await this.props.loadCategoryWiseProducts(Item.cat_slug);
        var data = await this.props.categoryWiseProducts.filter(item => item.cat_slug === Item.cat_slug)[0];
      }
      else {
        var data = await this.props.categoryWiseProducts.filter(item => item.cat_slug === Item.cat_slug)[0];
      }
      var temp = [];
      for (const key in data.products) {
        temp.push(data.products[key])
      }
      this.setState({ products: temp });
    }
    this.setState({ loading: false });
  }
  Header = () => {
    return (
      <View style={{ backgroundColor: "#fff", paddingTop: 20, paddingBottom: 20, elevation: 100, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 15 }}>
        <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
          <Icon name='arrow-back' size={25} onPress={() => this.props.navigation.goBack()} />
          <Text style={{ fontFamily: "RobotoMedium", fontSize: 20, marginLeft: 15 }}>{this.props.selectedCategoryName}</Text>
        </View>
        <Icon name='search' size={22} />
      </View>
    )
  }
  render() {
    console.log(this.props.subCategories)
    return (
      <View style={{ flex:1}} >
        <FloatingCart Navigation={this.props.navigation} Screen={"Products"} />
        <this.Header />
        {this.props?.subCategories?.length===0 || this.props.subCategories===undefined ? 
        <View >
        <Text style={{textAlign:"center", fontFamily:"RobotoMedium", fontSize:16,marginTop:"50%", color:"grey"}}>No products available on the selected category</Text>
        </View>
        :
        <View style={{flex:1, display: "flex", flexDirection: "row", marginTop: 2 }}>
            <View style={{ flex:1, width: "20%", display: "flex", flexDirection: "column", alignItems: "center",  backgroundColor: "#fff", borderTopRightRadius: 5, elevation: 50 }}>
            <FlatList
              data={this.props.subCategories}
              numColumns={1}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) =>
                <View style={item.cat_name === this.state.selectedCategory.cat_name && { borderRightWidth: 4, borderRightColor: "#66ac34", borderRadius: 5 }}>
                  <TouchableOpacity onPress={() => this.handleChange(item)} style={{ padding: 10, display: "flex", flexDirection: "column", alignItems: "center" }}>
                    {item.cat_image === null ?
                      <View style={{ width: 50, height: 50, borderRadius: 50, backgroundColor: "#ebebeb" }}>
                      </View> :
                      <Image source={item.cat_image} style={{ width: 30, height: 30, borderRadius: 50 }} />
                    }
                    <Text
                      style={{
                        fontWeight: item.cat_name === this.state.selectedCategory.cat_name ? "500" : "300",
                        color: item.cat_name === this.state.selectedCategory.cat_name ? "black" : "grey",
                        textAlign: "center"
                      }}>{item.cat_name}</Text>
                  </TouchableOpacity>
                </View>
              }
              keyExtractor={(item, index) => index}
            />
          </View>
          <View style={{ paddingTop: 3, display: "flex", flexDirection: "column", alignItems: "center",width: "80%" }}>
            {this.state.loading ? <ActivityIndicator color={"#66ac34"} /> :
              <FlatList
                data={this.state.products}
                numColumns={2}
                ListEmptyComponent={this.EmptyList}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => <ProductCard 
                  padding={3}
                  isProducts={true}
                  productPadding={10}
                  ShowDet={false} UpdateParentCart={this.UpdateCart} Cart={this.Cart} AddtoCart={this.AddtoCart} Item={item} Related={[]} />}
                keyExtractor={(item, index) => index}
              />
            }
          </View>
        </View>
        }
      </View>
    )
  }
}
const mapStateToProps = state => ({
  productCaller: state.productCaller,
  subCategories: state.subCategories,
  categoryWiseProducts: state.categoryWiseProducts,
  selectedCategoryName: state.selectedCategoryName
})
export default connect(mapStateToProps, { loadCategoryWiseProducts })(Products)
