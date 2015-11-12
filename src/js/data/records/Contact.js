
var OnyxData = require('../OnyxData'),
    Immutable = require('immutable'),
    ContactSchema,
    ContactDefaultValues,
    ContactRecordFactory,
    ContactFactory;

ContactSchema = {
    base : {
        id: {
            type: 'string',
            match: /^[a-zA-Z0-9.:_-]+/,
            properties: {
                exampleMessage: 'anonymous:-JouU2zky90T1-wJf4IV'
            }
        },
        email: {
            type: 'string',
            match: 'isEmail',
            properties: {
                label: 'E-mail',
                exampleMessage: 'exemplo@gmail.com'
            }
        },
        phone: {
            type: 'string',
            // match: 'isAlpha',  problems with á é ...
            properties: {
                label: 'Phone',
                min: 8,
                mask: '(99)9999-99999',
                errorMessage: 'precisa ser telefone válido.'
            }
        },
        name: {
            type: 'string',
            // match: 'isAlpha',  problems with á é ...
            properties: {
                label: 'Nome',
                min: 2,
                exampleMessage: 'José',
                errorMessage: 'precisa ser texto e um nome válido.'
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
        }
    },
    send: {
        email: { required: true },
        name: { required: true },
        phone: { required: true },
        description: { required: true }
    }
};

ContactDefaultValues = {
    id: undefined,
    name: undefined,
    phone: undefined,
    email: undefined,
    description: undefined
};

ContactRecordFactory = OnyxData.Record();

ContactFactory = new ContactRecordFactory('Contact', 'id', ContactDefaultValues, ContactSchema);

module.exports = ContactFactory;
