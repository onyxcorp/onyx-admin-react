
var OnyxData = require('../OnyxData'),
    UserAddresseSchema,
    UserAddressDefaultValue,
    UserAddressRecordFactory,
    UserAddressFactory;

UserAddresseSchema = {
    base: {
        id: {
            type: 'string',
            match: /^[a-zA-Z0-9._-]+/,
            properties: {
                label: 'ID',
                exampleMessage: '-JouU2zky90T1-wJf4IV'
            }
        },
        name: {
            type: 'string',
            properties: {
                label: 'Nome',
                exampleMessage: 'Casa, Escritório, etc'
            }
        },
        cep: {
            type: 'string',
            match: /^[0-9]{2}[0-9]{3}-[0-9]{3}$/,
            properties: {
                label: 'CEP',
                exampleMessage: '12345-678',
                mask: '99999-999'
            }
        },
        state: {
            type: 'string',
            match: /^[a-zA-Z]+/,
            properties: {
                label: 'Estado',
                exampleMessage: 'SP',
                mask: 'AA'
            }
        },
        city: {
            type: 'string',
            properties: {
                label: 'Cidade',
                exampleMessage: 'Jundiaí'
            }
        },
        street: {
            type: 'string',
            properties: {
                label: 'Logradouro',
                exampleMessage: 'Av. Paulista, n. 1555'
            }
        }
    },
    register: {
        name: { required: true },
        cep: { required: true },
        state: { required: true },
        city: { required: true },
        street: { required: true }
    }
};

UserAddressDefaultValue = {
    id: undefined,
    name: undefined,
    cep: undefined,
    state: undefined,
    city: undefined,
    street: undefined
};

UserAddressRecordFactory = OnyxData.Record();

UserAddressFactory = new UserAddressRecordFactory('UserAddress', 'id', UserAddressDefaultValue, UserAddresseSchema);

module.exports = UserAddressFactory;
