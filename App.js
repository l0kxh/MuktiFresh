import React, { Component } from 'react'
import { ActivityIndicator, Text, View } from 'react-native'
import { Provider } from 'react-redux'
import Route from './Route'
import { store } from './redux/store'
import { useFonts } from "expo-font"
import Lottie from "lottie-react-native"
// export class App extends Component {
//   constructor(props){
//     super(props);
//     this.state={
//       isReady : false,
//     }
//   }
//   componentDidMount = async () => {
//     await useFont();
//     this.setState({ IsReady: true });
//   };
//   render() {
//     const [loaded] = useFonts({

//     })
// return (
//   this.state.isReady ? 
// <Provider store={store}>
//   <Route/>
// </Provider> : <ActivityIndicator color={"#284DD1"} size={"large"} />
// )
//   }
// }

// export default App


export default function componentName() {
  const [loaded] = useFonts({
    RobotoThin: require('./assets/fonts/Roboto-Thin.ttf'),
    RobotoLight: require('./assets/fonts/Roboto-Light.ttf'),
    RobotoRegular: require('./assets/fonts/Roboto-Regular.ttf'),
    RobotoMedium: require('./assets/fonts/Roboto-Medium.ttf'),
    RobotoBold: require('./assets/fonts/Roboto-Bold.ttf'),
    RobotoBlack: require('./assets/fonts/Roboto-Black.ttf'),
  })
  if (!loaded) {
    return <View style={{flex:1, justifyContent:"center", alignItems:"center"}}>
      <Lottie source={require('./assets/loading.json')} style={{ transform: [{ scale: 0.8 }] }} autoPlay loop />
    </View>
  }
  return (
    <Provider store={store}>
      <Route />
    </Provider>
  )
}
