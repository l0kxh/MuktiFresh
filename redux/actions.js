import axios from "axios";
import { API_URL } from "../Init"
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
export const LOAD_FEATURED_PRODUCTS = "LOAD_FEATURED_PRODUCTS";
export const ADD_TO_CART = "ADD_TO_CART"
export const LOGIN = "LOGIN"
export const CHECK_IF_LOGIN = "CHECK_IF_LOGIN"
export const LOGOUT = "LOGOUT"
export const SET_SELECTED_CATEGORY = "SET_SELECTED_CATEGORY"
export const LOAD_CATRGORIES = "LOAD_CATEGORIES"
export const UPDATE_CART = "UPDATE_CART"
export const LOAD_CART = "LOAD_CART"
export const LOAD_CATEGORYWISE_PRODUCTS = "LOAD_CATEGORY_PRODUCTS"


export const loadCategoryWiseProducts = (name) => {
    return async dispatch => {
        await axios.get(API_URL + '/productsCategoryWise/' + name)
            .then(res => {
                if (res.data.message.length !== 0) {
                    return dispatch({
                        type: LOAD_CATEGORYWISE_PRODUCTS,
                        payload: res.data.message[0]
                    })
                }
            })
    }
}

export const loadFeaturedProducts = () => {
    return async dispatch => {
        await axios.get(API_URL + 'shopMobile')
            .then(async (res) => {
                const featuredProducts = [];
                await res.data.map((all, i) => {
                    const products = [];
                    var i = 0;
                    for (const key in all.products) {
                        products.push(all.products[key])
                    }
                    featuredProducts.push({
                        cat_id: all.cat_id,
                        cat_name: all.cat_name,
                        cat_icon: all.cat_icon,
                        products: products,
                        cat_banner: all.cat_banner
                    });
                })
                return dispatch({
                    type: LOAD_FEATURED_PRODUCTS,
                    payload: featuredProducts
                })
            })
    }
}

export const login = (email, password) => {
    return async dispatch => {
        const data = new FormData();
        data.append('email', email);
        data.append('password', password);
        await axios({
            method: 'POST',
            url: API_URL + 'login',
            data: data,
            headers: { "Content-Type": "multipart/form-data" },
        }).then(async (res) => {
            const temp = res.data;
            if (temp.response == 'success') {
                temp['login'] = true;
                await AsyncStorage.setItem('auth', JSON.stringify(temp));
                return dispatch({
                    type: LOGIN,
                    payload: temp
                })
            }
            else {
                Alert.alert('Failed', temp.message);
            }
        })
            .catch(err => console.log(err))
    }
}
export const checkIfLogin = () => {
    return async dispatch => {
        const data = await AsyncStorage.getItem('auth');
        if (data !== null && data !== undefined) {
            const auth = JSON.parse(data);
            if (auth.login === true) {
                return dispatch({
                    type: CHECK_IF_LOGIN,
                    payload: auth
                })
            }
        }
    }
}

export const logout = () => {
    return async dispatch => {
        await AsyncStorage.removeItem('auth');
        return dispatch({
            type: LOGOUT,
        })
    }
}


export const setSelectedCategory = (categories, cat_id, cat_name, caller) => {
    return async dispatch => {
        try {
            var subCategories = categories?.filter((item) => item.cat_id === cat_id)[0].children;
            return dispatch({
                type: SET_SELECTED_CATEGORY,
                payload: {
                    subCategories: subCategories,
                    selectedCategoryId: cat_id,
                    selectedCategoryName: cat_name,
                    Caller: caller
                }
            })
        }
        catch (err) {
            console.log(err);
        }
    }
}

export const loadCategories = () => {
    return async dispatch => {
        await axios.post(API_URL + 'categories')
            .then(res => {
                return dispatch({
                    type: LOAD_CATRGORIES,
                    payload: res.data.message
                })
            })
    }
}

export const updateCart = () => {
    return async dispatch => {

    }
}

export const loadCart = (email) => {
    return async dispatch => {
        const formData = new FormData();
        formData.append('c_email', email);
        await axios({
            method: 'POST',
            url: API_URL + 'myCartList',
            data: formData,
            headers: { "Content-Type": "multipart/form-data" },
        })
            .then(async (res) => {
                
                console.log(res.data)
                if (res.data.response === "success") {
                    var amount = 0;
                    await res.data.message.map((item, index) => {
                        amount += item.unit_price * item.qty
                    })
                    return dispatch({
                        type: LOAD_CART,
                        payload: {
                            cart: res.data.message,
                            amount: amount
                        }
                    })
                }
                if (res.data.response === "fail") {
                    return dispatch({
                        type: LOAD_CART,
                        payload: {
                            cart: [],
                            amount : 0
                        }
                    })
                }
            })
    }
}

export const addToCart = (c_email, product_id, pkg_id, qty,setAdded) => {
    return async dispatch => {
        const formData = new FormData();
        formData.append('c_email', c_email);
        formData.append('product_id', product_id);
        formData.append('pkg_id', pkg_id);
        formData.append('qty', qty);
        await axios({
            method: 'POST',
            url: API_URL + 'addToCart',
            data: formData,
            headers: { "Content-Type": "multipart/form-data" },
        }).then(async(res) => {
            if(setAdded){
                setAdded(true);
            }
            const formData = new FormData();
            formData.append('c_email', c_email);
            await axios({
                method: 'POST',
                url: API_URL + 'myCartList',
                data: formData,
                headers: { "Content-Type": "multipart/form-data" },
            })
                .then(async (res) => {

                    console.log(res.data)
                    if (res.data.response === "success") {
                        var amount = 0;
                        await res.data.message.map((item, index) => {
                            amount += item.unit_price * item.qty
                        })
                        return dispatch({
                            type: ADD_TO_CART,
                            payload: {
                                cart: res.data.message,
                                amount: amount
                            }
                        })
                    }
                    if (res.data.response === "fail") {
                        return dispatch({
                            type: ADD_TO_CART,
                            payload: {
                                cart: [],
                                amount: 0
                            }
                        })
                    }
                })
        }).catch(err => {
            console.log(err)
        })
    }
}
