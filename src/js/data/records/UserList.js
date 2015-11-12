
var OnyxData = require('../OnyxData'),
    ProductList = require('../lists/Products').create(),
    UserListSchema,
    UserListDefaultValue,
    UserListRecordFactory,
    UserListFactory;

UserListSchema = {
    base: {
        name: {
            type: 'string',
            properties: {
                example: 'Produtos Preferidos'
            }
        },
        products: {
            type: 'object',      // Immutable.List but validate as Object because should be keyed
            properties: {
                label: 'Produtos'
            }
        }
    }
};

UserListDefaultValue = {
    name: 'default',                    // User list name
    products: ProductList
};

UserListRecordFactory = OnyxData.Record({

    getProduct: function (product) {
        return this.get('products').getIndexDataById(product.get('id'));
    },

    addProduct: function (product) {
        return this.set('products', this.get('products').update(product));
    },

    removeProduct: function (product) {
        return this.set('products', this.get('products').remove(product));
    }
});

UserListFactory = new UserListRecordFactory('UserList', 'name', UserListDefaultValue, UserListSchema);

module.exports = UserListFactory;
