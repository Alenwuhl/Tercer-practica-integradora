export default class CartRepository {
    constructor(dao) {
        this.dao = dao;
    }
    getAll = () => {
        return this.dao.getAll();
    }
    save = (cart) => {
        return this.dao.save(cart);
    }
    getCartById = (cartId) => {
        return this.dao.getCartById(cartId)
    }
    createCart = (cart) => {
        return this.dao.createCart(cart)
    }
};