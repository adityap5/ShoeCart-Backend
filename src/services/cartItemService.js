const userService=require('../services/userService')

async function updateCartItem(userId, cartItemId,cartItemData){
    try {
        const item = await findCartById(cartItemId);

        if(!item){
            throw new Error("cart item not found :", cartItemId);
        }
        const user = await userService.findUserById(item.userId);

        if(!user){
            throw new Error("user not found :", userId);
        }

        if(user._id.toString() === userId.toString()) {
            item.quantity = cartItemData.quantity;
            item.price = item.quantity*item.product.price;
            item.disscountedPrice=item.quantity*item.product.disscountedPrice;
            const updatedCartItem = await item.save();
            return updatedCartItem;
        }else{
            throw new Error("You can not update this cart item")
        }
    } catch (error) {
        throw new Error(error.message)
    }
}

async function removeCartItem(userId,cartItemId) {
    const cartItem = await findCartItemById(cartItemId);
    const user = await userService.findByUserId(userId);

    if(user._id.toString()===cartItem.userId.toString()){
        await cartItem.findByIdAndDelete(cartItemId)
    }
    throw new Error("you can't remove another user's item")
}
async function findCartItemById(cartItemId) {
    const cartItem = await findCartItemById(cartItemId);
    if(cartItem){
      return cartItem;
    }else{

        throw new Error("cartitem not found with id " + cartItem)
    }
}

module.exports={updateCartItem,removeCartItem,findCartItemById}