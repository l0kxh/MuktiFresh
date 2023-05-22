import React, { Component } from 'react'
import { Image, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Header from "./Header"
import { connect } from 'react-redux'
import { TouchableOpacity } from 'react-native'
import { FlatList } from 'react-native'
import Spinner from 'react-native-loading-spinner-overlay'
import ProductCard from '../UI/ProductCard'
import { loadFeaturedProducts } from '../../redux/actions'

export class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      loading: false,
      selectedCategory : 0,
    }
  }
  async componentDidMount() {
    this.setState({ products: this.props.featuredProducts[0]?.products });
  }
  HeaderComponent = () => {
    return (
      <View >
        <ScrollView showsHorizontalScrollIndicator={false} style={{ paddingLeft: 20,paddingTop:40 }} horizontal={true}>
          <Image source={require('../../assets/slider2.jpg')} style={{ width: 330, marginRight: 20, height: 120, borderRadius: 10, resizeMode: 'contain' }} />
          <Image source={require('../../assets/slider1.jpg')} style={{ width: 330, marginRight: 20, height: 120, borderRadius: 10, resizeMode: 'contain' }} />
          <Image source={require('../../assets/slider3.jpg')} style={{ width: 330, marginRight: 20, height: 120, borderRadius: 10, resizeMode: 'contain' }} />
          <Image source={require('../../assets/slider4.jpg')} style={{ width: 330, height: 120, marginRight: 20, borderRadius: 10, resizeMode: 'contain' }} />
        </ScrollView>
        <View>
          <Text style={{ fontWeight: '500', textAlign: 'center', marginTop: 25, fontSize: 15 }}>Trending Categories</Text>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{ marginTop: 8, paddingHorizontal: 5 }}>
            {
              this.props.featuredProducts.map((val, i) => {
                return (
                  <TouchableOpacity key={i} onPress={() => { this.setState({ products: this.props.featuredProducts[i].products }); 
                  this.setState({selectedCategory:i})
                  }} style={{ flex: 3, padding: 10, width: 110, justifyContent: 'center', alignItems: 'center', margin: 5, backgroundColor: '#4eaa4a2b', borderRadius: 10, borderWidth:this.state.selectedCategory===i? 1:0, borderColor:"#4CBB17" }}>
                    <Image style={{ height: 35, width: 35, alignItems: 'center', justifyContent: 'center' }} source={{ uri: val.cat_icon }} />
                    <Text numberOfLines={1} style={{ fontSize: 10, marginTop: 5, color: '#4eaa4a' }}>{val.cat_name}</Text>
                  </TouchableOpacity>
                );
              })
            }
          </ScrollView>
        </View>
      </View>
    )
  }
  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <Spinner visible={this.state.loading} />
        <Header drawerToggle={this.props.drawerToggle} />
        <FlatList
          data={this.state.products}
          numColumns={2}
          renderItem={({ item }) => (
            <ProductCard ShowDet={true} padding={8} UpdateParentCart={this.UpdateCart} Cart={this.Cart} AddtoCart={this.AddtoCart} Item={item} Related={this.state.products} />
          )}
          keyExtractor={(item, index) => index}
          ListHeaderComponent={<this.HeaderComponent />}
        />
      </SafeAreaView>
    )
  }
}
const mapStateToProps = state => ({
  featuredProducts: state.featuredProducts,
})
export default connect(mapStateToProps, { loadFeaturedProducts })(Home)
