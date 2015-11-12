
var OnyxData = require('../OnyxData'),
    ProductRecord = require('../records/Product'),
    ProductListFactory,
    ProductFactory;

// get the constructor
ProductListFactory = OnyxData.List({
    getBySlug: function (slug) {
        return this.get('list').find( function(item) {
            return item.get('slug') === slug;
        });
    },
    totalQuantity: function () {
        return this.get('list').reduce(function (memo, item) {
            return memo + item.get('quantity');
        }, 0);
    },
    totalPrice: function () {
        return this.get('list').reduce(function (memo, item) {
            return memo + ( item.get('quantity') * item.get('price') );
        }, 0);
    }
});

ProductFactory = new ProductListFactory(ProductRecord);

module.exports = ProductFactory;
