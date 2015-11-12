
var OnyxData = require('../OnyxData'),
    ProductList = require('../lists/Products').create(),
    UserAddressesList = require('../lists/UserAddresses').create(),
    OrderSchema,
    OrderDefaultValues,
    OrderRecordFactory,
    OrderFactory;

OrderSchema = {
    base: {
        id: {
            type: 'string',
            match: /^[a-zA-Z0-9._-]+/,
            properties: {
                exampleMessage: '-JouU2zky90T1-wJf4IV'
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
        },
        status: {
            type: 'string',
            match: 'isAlpha',
            properties: {
                label: 'Status',
                allow: ['payment', 'completed']
            }
        }
    }
};

OrderDefaultValues = {
    id: undefined,
    uid: undefined,
    address: UserAddressesList,
    products: ProductList,
    total: 0,
    status: 'payment'
};

OrderRecordFactory = OnyxData.Record();

OrderFactory = new OrderRecordFactory('Order', 'id', OrderDefaultValues, OrderSchema);

module.exports = OrderFactory;
