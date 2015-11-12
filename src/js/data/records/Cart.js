
var OnyxData = require('../OnyxData'),
    ProductList = require('../lists/Products').create(),
    UserAddressesList = require('../lists/UserAddresses').create(),
    CartSchema,
    CartDefaultValues,
    CartRecordFactory,
    CartFactory;

CartSchema = {
    base: {
        id: {
            type: 'string',
            match: /^[a-zA-Z0-9.:_-]+/,
            properties: {
                exampleMessage: 'anonymous:-JouU2zky90T1-wJf4IV'
            }
        },
        uid: {
            type: 'string',
            match: /^[a-zA-Z0-9:._-]+/,
            properties: {
                exampleMessage: 'anonymous:-JouU2zky90T1-wJf4IV'
            }
        },
        address: {
            type: 'object',
            properties: {
                label: 'Endereço'
            }
        },
        products: {
            type: 'object',      // Immutable.List but validate as Object because should be keyed
            properties: {
                label: 'Produtos'
            }
        },
        total: {
            type: 'number',
            match: 'isFloat',
            properties: {
                label: 'Total',
                min: 0,
                precision: 2,
                decimal: ',',
                exampleMessage: '1,99',
                errorMessage: 'precisa ser númerico, decimal e acima de 0'
            }
        }
    },
    completed: {
        id: { required: true },
        uid: { required: true },
        address: { required: true },
        products: { required: true },
        total: { required: true }
    }
};

CartDefaultValues = {
    id: undefined,
    uid: undefined,
    address: UserAddressesList, // this should be changed to a single address, not a list...
    products: ProductList,
    total: 0
};

CartRecordFactory = OnyxData.Record({

    afterSet: function (key, value) {
        if (key === 'products') {
            // update total
            return {
                total: this.get('products').totalPrice()
            };
        }
    },

    updateProduct: function (product, todo) {
        todo = todo || 'update';

        var newProducts,
            currentProducts = this.get('products');

        if (todo !== 'add' && todo !== 'update' && todo !== 'remove') {
            throw new Error('updateProduct invalid todo, should be add, update or delete');
        }
        if (todo === 'remove') {
            newProducts = currentProducts.remove(product);
        } else if (todo === 'add') {
            var existingProduct = currentProducts.getIndexDataById(product.get('id'));
            if (existingProduct) {
                product = product.set('quantity', product.get('quantity') + existingProduct[1].get('quantity'));
            }
            newProducts = currentProducts.update(product);
        } else if (todo === 'update') {
            newProducts = currentProducts.update(product);
        }
        return this.merge({
            products: newProducts,
            total: newProducts.totalPrice()
        });
    },

    updateAddress: function (address) {
        return this.set('address', this.get('address').clear().update(address));
    },

    getAddress: function () {
        return this.get('address').getFirst();
    },

    getSize: function (products) {
        products = products || this.get('products');
        return products.totalQuantity();
    },

    clear: function () {
        return this.merge({
            address: UserAddressesList.clear(),
            products: ProductList.clear(),
            total: 0
        });
    }

});

CartFactory = new CartRecordFactory('Cart', 'id', CartDefaultValues, CartSchema);

module.exports = CartFactory;
