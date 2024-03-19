export default class ProductRepository {
    constructor(dao) {
        this.dao = dao;
    }
    getAll = () => {
        return this.dao.getAll();
    }
    save = (product) => {
        return this.dao.save(product);
    }
    productExists = (productId) => {
        return this.dao.productExists(productId)
    }
    getProductById = (productId) => {
        return this.dao.getProductById(productId)
    }
};