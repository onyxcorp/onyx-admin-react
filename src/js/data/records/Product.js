
var OnyxData = require('../OnyxData'),
    Types = require('../../utils/Types'),
    ApiEndpoints = require('../../utils/ApiEndpoints.js'),
    Immutable = require('immutable'),
    Slugify = require('../../utils/Slugify'),
    ImageList = require('../lists/Images').create(),
    ProductSchema,
    ProductDefaultValues,
    ProductRecordFactory,
    ProductFactory;

ProductSchema = {
    base: {
        id: {
            type: 'string',
            match: /^[a-zA-Z0-9._-]+/,
            properties: {
                label: 'ID',
                exampleMessage: '-JouU2zky90T1-wJf4IV'
            }
        },
        title: {
            type: 'string',
            // match: 'isAlphanumeric',
            properties: {
                label: 'Titulo',
                min: 5,
                errorMessage: 'precisa ser texto e ter no mínimo 5 caracteres'
            }
        },
        slug: {
            type: 'string',
            match: /^[a-zA-Z0-9-]+$/,  // min length of 5
            properties: {
                label: 'Link',
                exampleMessage: 'oi-eu-sou-um-titulo',
                errorMessage: 'precisa ser texto e ter no mínimo 5 caracteres'
            }
        },
        images: {
            type: 'object',      // Immutable.List but validate as Object because should be keyed
            properties: {
                label: 'Imagens'
            }
        },
        description: {
            type: 'string',
            // match: 'isAlphanumeric',
            properties: {
                label: 'Descrição',
                min: 10,
                errorMessage: 'precisa ser texto e ter no mínimo 10 caracteres'
            }
        },
        quantity: {
            type: 'number',
            match: 'isInt',
            properties: {
                label: 'Quantidade',
                min: 1,
                exampleMessage: '1',
                errorMessage: 'precisa ser numérico e valor igual ou maior que 1'
            }
        },
        price: {
            type: 'number',
            match: 'isFloat',
            properties: {
                label: 'Preço',
                min: 0,
                precision: 2,
                decimal: ',',
                exampleMessage: '1,99',
                errorMessage: 'precisa ser um numérico, decimal e acima de 0'
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
        },
        weight: {
            type: 'number',
            match: 'isFloat',
            properties: {
                label: 'Peso',
                min: 0,
                max: 100,
                precision: 3,
                decimal: ',',
                exampleMessage: '1,234',
                errorMessage: 'precisa ser numérico, decimal e acima de 0'
            }
        },
        width: {
            type: 'number',
            match: 'isFloat',
            properties: {
                label: 'Largura',
                min: 0,
                max: 150,
                precision: 2,
                decimal: ',',
                exampleMessage: '10,50',
                errorMessage: 'precisa ser numérico e entre 0 a 150'
            }
        },
        height: {
            type: 'number',
            match: 'isFloat',
            properties: {
                label: 'Altura',
                min: 0,
                max: 150,
                precision: 2,
                decimal: ',',
                exampleMessage: '10,50',
                errorMessage: 'precisa ser numérico e entre 0 a 150'
            }
        },
        depth: {
            type: 'number',
            match: 'isFloat',
            properties: {
                label: 'Profundidade',
                min: 0,
                max: 150,
                precision: 2,
                decimal: ',',
                exampleMessage: '10,50',
                errorMessage: 'precisa ser numérico e entre 0 a 150'
            }
        }
    },
    cart: {
        quantity: { required: true }
    },
    register: {
        title: { required: true },
        images: { required: true },
        description: { required: true },
        price: { required: true },
        weight: { required: true }
    }
};

ProductDefaultValues = {
    id: undefined,
    title: undefined,
    slug: undefined,
    images: ImageList,
    description: undefined,
    quantity: 1,
    price: undefined,
    total: undefined,
    weight: undefined,    // kg
    width: undefined,     // cm
    height: undefined,    // cm
    depth: undefined      // cm
};

ProductRecordFactory = OnyxData.Record({
    // returns null, false or updated value
    beforeSet: function (key, value) {
        value = this.parseData(key, value);
        if (key === 'quantity') value = parseInt(value);
        return value;
    },

    afterSet: function (key, value) {
        if (key === 'quantity' && value > 0) {
            // update total
            return {
                'total': value * this.get('price')
            };
        }
    },

    setTitleWithSlug: function (title) {
        return this.merge({
            slug: Slugify(title),
            title: title
        });
    },
    // this method is async because the image resizing is an async function
    addImageAsync: function (image, formCallback) {
        ApiEndpoints.uploadFile('products', this.get('id'), image[0], function completed(err, res) {
            if (!Types.isError(err)) {
                var imageImmutable = Immutable.Map({src:res.text});
                this.setAsync('images', this.get('images').update(imageImmutable), formCallback);
            } else {
                // on error just return the current object data
                console.log('Error!');
                formCallback(this);
            }
        }.bind(this));
    },

    removeImage: function (image) {
        return this.set('images', this.get('images').remove(image));
    },

    getFirstImage: function () {
        var firstImage = this.get('images').getFirst();
        return firstImage || ImageList.newRecord();
    },

    getImageByType: function (type) {
        // to aviod errors in case a certain type isn't set use the getFirstImage method
        return this.get('images').getByType(type) || this.getFirstImage();
    },

    addQuantity: function (quantity) {
        quantity = quantity || 1;
        var newQuantity = this.get('quantity') + quantity;
        return this.merge({
            'quantity': newQuantity,
            'total': newQuantity * this.get('price')
        });
    },

    removeQuantity: function (quantity) {
        quantity = quantity || 1;
        var currentQuantity = this.get('quantity');
        if (currentQuantity > 1) {
            var newQuantity = currentQuantity - quantity;
            newQuantity = newQuantity >= 1 ? newQuantity : 1;
            newQuantity = currentQuantity - quantity;
            return this.merge({
                'quantity': newQuantity,
                'total': newQuantity * this.get('price')
            });
        }
        return this;
    }
});

ProductFactory = new ProductRecordFactory('Product', 'id', ProductDefaultValues, ProductSchema);

module.exports = ProductFactory;
