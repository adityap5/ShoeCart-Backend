const Cart = require('../models/cartmodel');
const CartItem = require('../models/cartItemsmodel');
const Product = require('../models/productmodel');

async function createCart(user) {
    try {
        const cart = new Cart({ user: user });
        const createdCart = await cart.save();
        return createdCart;

    } catch (error) {
        throw new Error(error.message);
    }

}
async function findUserCart(userId) {
    try {
        const cart = await Cart.findOne({ user });
        const cartItems = await CartItem.find({ cart: cart._id }).populate("product")
        cart.cartItems = cartItems;

        let totalPrice = 0;
        let totalDiscountedPrice = 0;
        let totalItem = 0;

        for (let cartItem of cart.cartItems) {
            totalPrice += cartItem.price;
            totalDiscountedPrice += cartItem.discountedPrice;
            totalItem += cartItem.quantity;
        }
        cart.totalPrice = totalPrice;
        cart.disscount = totalDiscountedPrice;
        cart.totalItem = totalItem;
    } catch (error) {
        throw new Error(error.message);
    }

}
async function addCartItem(userId, req) {
    try {
        const cart = await Cart.findOne({ user: userId });
        const product = await Product.findById(req.productId);
        const isPresent = CartItem.findOne({ cart: cart.id, product: product._id, userId })

        if (!isPresent) {
            const cartItem = new CartItem({
                product: product._id,
                cart: cart.id,
                quantity: 1,
                userId,
                price: product.price,
                size: req.size,
                disscountedPrice: product.disscountedPrice,
            })

            const createdCartItem = await cartItem.save();
            cart.cartItems.push(createdCartItem);
            await cart.save();
            return "Item added to cart"
        }
    } catch (error) {
        throw new Error(error.message);
    }

}
module.exports = { createCart, findUserCart, addCartItem };