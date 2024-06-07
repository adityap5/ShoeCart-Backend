const cartService = require('../services/cartService');
const Address = require('../models/addressmodel');
const Order = require('../models/ordermodel');

async function createOrder(user, shippAddress) {
    let address;

    if (shippAddress._id) {
        let existAddress = await Address.findById(shippAddress._id);
        address = existAddress;
    } else {
        address = new Address(shippAddress);
        address.user = user;
        await address.save();

        user.address.push(address);
        await user.save();
    }

    const cart = await cartService.findUserCart(user._id);
    const orderItems = [];
    for (const item of cart.cartItems) {
        const orderItem = new orderItems({
            price: item.price,
            product: item.product,
            quantity: item.quantity,
            size: item.size,
            userId: item.userId,
            disscountedPrice: item.disscountedPrice
        })

        const createdOrderItem = await orderItem.save();
        orderItems.push(createdOrderItem);
    }

    const createOrder = new Order({
        user,
        orderItems,
        totalPrice: cart.totalPrice,
        totalDisscountedPrice: cart.totalDisscountedPrice,
        disscount: cart.disscont,
        totalItem: cart.totalItem,
        shippAddress: address,
    })

    const savedOrder = await createOrder.save();
    return savedOrder;
}

async function placeOrder(orderId) {
    const order = await findOrderById(orderId);

    order.orderStatus = "PLACED";
    order.paymentDetails.status = "COMPLETED";
    return await order.save();
}
async function confirmedOrder(orderId) {
    const order = await findOrderById(orderId);

    order.orderStatus = "CONFIRMED";
    return await order.save();
}
async function shippOrder(orderId) {
    const order = await findOrderById(orderId);

    order.orderStatus = "SHIPPED";
    return await order.save();
}
async function deliveredOrder(orderId) {
    const order = await findOrderById(orderId);

    order.orderStatus = "DELIVERED";
    return await order.save();
}
async function cancelledOrder(orderId) {
    const order = await findOrderById(orderId);

    order.orderStatus = "CANCELLED";
    return await order.save();
}

async function findOrderById(orderId) {
    const order = await Order.findById(orderId)
        .populate("user")
        .populate({ path: "orderItems", populate: { path: "product" } })
        .populate("shippingAddress")

    return order;
}
async function userOrderHistory(userId) {
    try {
        const orders = await Order.find({ user: userId, orderStatus: "PLACED" })
            .populate({ path: "orderItems", populate: { path: "product" } }).lean()
        return orders;

    } catch (error) {
        throw new Error(error.message)
    }
}

async function getAllOrders() {
    return await Order.find()
        .populate({ path: "orderItems", populate: { path: "product" } }).lean()

}
async function delteOrder(orderId) {
    const order = await findOrderById(orderId);
    await Order.findByIdAndDelete(order._id)

}
module.exports = { createOrder, placeOrder, confirmedOrder, shippOrder, deliveredOrder, cancelledOrder, findOrderById, userOrderHistory, getAllOrders, delteOrder }