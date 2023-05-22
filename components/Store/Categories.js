import React, { Component } from 'react'
import { Text, View, ScrollView, FlatList, TouchableOpacity, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { connect } from 'react-redux'
import Header from './Header'
import { HOST } from '../../Init'
import { setSelectedCategory } from "../../redux/actions"
import Spinner from 'react-native-loading-spinner-overlay'


export class Categories extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    }
  }
  handleSelectedCategory = async (id) => {
    this.setState({ loading: true });
    await this.props.setSelectedCategory(this.props.featuredProducts, id, "Categories");
    this.setState({ loading: false });
    this.props.navigation.navigate('Products');
  }
  BottomComponent = () => {
    return (
      this.props.categories.map((cat, key) => {
        var banner = null;
        if (cat.cat_banner != null) {
          banner = HOST + 'assets/frontEnd/images/category/' + cat.cat_banner;
          return (
            <TouchableOpacity key={key} onPress={() => { this.handleSelectedCategory(cat.cat_id); }}>
              <Image style={{ marginBottom: 10, width: '100%', padding: 15, height: 120, borderRadius: 10, resizeMode: 'contain', marginBottom: 10 }} source={{ uri: banner }} />
            </TouchableOpacity>
          )
        }

      })
    )
  }
  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <Spinner />
        <Header drawerToggle={this.props.drawerToggle} />
        <View style={{ paddingHorizontal: 15, paddingTop: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: '500', marginTop: 10, textAlign: 'center', paddingBottom: 10 }}>All Categories</Text>
          <FlatList
            style={{ marginBottom: 120 }}
            showsVerticalScrollIndicator={false}
            data={this.props.categories}
            numColumns={2}
            renderItem={({ item }) => (
              <View style={{ flex: 1, borderWidth: 1, borderColor: '#ebebeb', borderRadius: 8, backgroundColor: '#ffffff', margin: 10 }}>
                <TouchableOpacity onPress={() => { this.handleSelectedCategory(item.cat_id) }} style={{ paddingHorizontal: 10, paddingVertical: 18, alignItems: 'center', justifyContent: 'center' }} >
                  <Image style={{ height: 35, width: 35 }} source={{ uri: item.cat_icon }} />
                  <Text style={{ fontSize: 11, fontWeight: '500', color: '#4eaa4a' }} numberOfLines={1}>{item.cat_name}</Text>
                </TouchableOpacity>
              </View>
            )}
            keyExtractor={(item, key) => key}
            ListFooterComponent={<this.BottomComponent />}
          />
        </View>

      </SafeAreaView>
    )
  }
}
const mapStateToProps = state => ({
  categories: state.categories,
  featuredProducts: state.featuredProducts
})
export default connect(mapStateToProps, { setSelectedCategory })(Categories)
