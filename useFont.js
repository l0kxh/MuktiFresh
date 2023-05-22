import * as Font from "expo-font"
export const useFont = async () => {
    await Font.loadAsync({
        Roboto_100Thin,
        Roboto_300Light,
        Roboto_400Regular,
        Roboto_500Medium,
        Roboto_700Bold,
        Roboto_900Black
    })
}