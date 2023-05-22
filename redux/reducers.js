import { ADD_TO_CART, CHECK_IF_LOGIN, LOAD_CART, LOAD_CATEGORYWISE_PRODUCTS, LOAD_CATRGORIES, LOAD_FEATURED_PRODUCTS, LOGIN, LOGOUT, SET_SELECTED_CATEGORY, categoryWiseProducts } from "./actions"
const initialState = {
    isLogin: false,
    featuredProducts: [],
    cart: [],
    auth: {},
    categories: [],
    selectedCategory: [],
    selectedCategoryProducts: [],
    selectedCategoryId: 0,
    selectedCategoryName : '',
    productCaller: '',
    cartAmount: 0,
    cartPkgId: [],
    cartLoaded: false,
    subCategories: [],
    categoryWiseProducts : [],
    loadedCategoryProducts : [],
}
function storeReducer(state = initialState, action) {
    switch (action.type) {
        case LOAD_FEATURED_PRODUCTS:
            return { ...state, featuredProducts: action.payload }
        case LOGIN:
            return { ...state, auth: action.payload, isLogin: true }
        case CHECK_IF_LOGIN:
            return { ...state, auth: action.payload, isLogin: true }
        case LOGOUT:
            return { ...state, auth: {}, isLogin: false, cart: [], cartAmount: 0, cartPkgId: [] }
        case SET_SELECTED_CATEGORY:
            return {
                ...state,
                subCategories: action.payload.subCategories,
                selectedCategoryId: action.payload.selectedCategoryId,
                productCaller: action.payload.Caller,
                selectedCategoryName : action.payload.selectedCategoryName,
                loadedCategoryProducts : [...state.loadedCategoryProducts, action.payload.selectedCategoryId]
            }
        case LOAD_CATRGORIES:
            return { ...state, categories: action.payload }
        case LOAD_CATEGORYWISE_PRODUCTS:
            return {...state, categoryWiseProducts : [...state.categoryWiseProducts,action.payload]}
        case LOAD_CART:
            const data = action.payload.cart.map(function (e) { return e.pkg_id });
            return { ...state, cart: action.payload.cart, cartAmount: action.payload.amount, cartPkgId: data, cartLoaded: true }
        case ADD_TO_CART:
            const da = action.payload.cart.map(function (e) { return e.pkg_id });
            return { ...state, cart : action.payload.cart, cartAmount : action.payload.amount, cartPkgId : da, cartLoaded : true }
        default:
            return { ...state }
    }
}
export default storeReducer;