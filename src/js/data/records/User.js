
var OnyxData = require('../OnyxData'),
    Types = require('../../utils/Types'),
    ApiEndpoints = require('../../utils/ApiEndpoints.js'),
    Immutable = require('immutable'),
    UserLists = require('../lists/UserLists').create(),
    UserAddressesList = require('../lists/UserAddresses').create(),
    UserSchema,
    UserDefaultValues,
    UserRecordFactory,
    UserFactory;

UserSchema = {
    base : {
        uid: {
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
        password: {
            type: 'string',
            match: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
            properties: {
                label: 'Senha',
                exampleMessage: 'exemplo182'
            }
        },
        avatar: {
            type: 'string',
            // match: 'isURL',
            properties: {
                label: 'Avatar',
                exampleMessage: 'http://www.linkavatar.com/foo/avatar.jpg',
                errorMessage: 'precisa ser texto e um link válido.'
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
        lastName: {
            type: 'string',
            // match: 'isAlpha',  problems with á é ...
            properties: {
                label: 'Sobrenome',
                min: 2,
                exampleMessage: 'Silva',
                errorMessage: 'precisa ser texto e um nome válido.'
            }
        },
        phone: {
            type: 'string',
            // match: /^\([1-9]{2}\) [2-9][0-9]{3,4}\-[0-9]{4}$/,  // based on http://pt.stackoverflow.com/questions/46672/como-fazer-uma-express%C3%A3o-regular-para-telefone-celular
            match: /^\([1-9]{2}\) [0-9]{8,9}$/,    // a version from above that don't want space nor hyphen
            properties: {
                label: 'Telefone',
                // mask: ['(99) 9 9999-9999', '(99) 9999-9999'],    // TODO implement OnyxData mask switch inteligence
                mask: '(99) 999999999',
                exampleMessage: '(11) 999559501 ou (11) 45822885',
                errorMessage: 'precisa ser um número de telefone válido'
            }
        },
        gender: {
            type: 'string',
            match: 'isAlpha',
            properties: {
                label: 'Sexo',
                exampleMessage: 'Masculino ou Feminino',
                errorMessage: 'precisa ser texto e um sexo válido.'
            }
        },
        bDay: {
            type: 'string',
            match: 'isDate',
            properties: {
                label: 'Aniversário',
                format: 'DD/MM/YYYY',
                mask: '99/99/9999',
                exampleMessage: '14/12/1990',
                errorMessage: 'precisa ser data e em formato válido.'
            }
        },
        rg: {
            type: 'string',
            match: /^[0-9.\-xX]+/,
            properties: {
                label: 'RG',
                exampleMessage: '44.555.353-5',
                errorMessage: 'precisa ser texto e em formato válido.'
            }
        },
        cpf: {
            type: 'string',
            match: /^d{3}.d{3}.d{3}-d{2}$/,
            properties: {
                label: 'CPF',
                mask: '999.999.999-99',
                exampleMessage: '311.312.392-38',
                errorMessage: 'precisa ser texto e em formato válido.'
            }
        },
        currentAddress: {
            type: 'object',
            properties: {
                label: 'Endereço atual'
            }
        },
        is_admin: {
            type: 'boolean',
            properties: {
                label: 'Endereço atual'
            }
        },
        addresses: {
            type: 'object',     // Immutable.Record
            properties: {
                label: 'Endereços'
            }
        },
        provider: {
            type: 'string',
            match: 'isAlphanumeric',
            properties: {
                label: 'Provider',
                exampleMessage: 'facebook',
                errorMessage: 'precisa ser texto e em formato válido.'
            }
        },
        lists: {
            type: 'object',      // Immutable.Record
            properties: {
                label: 'Listas'
            }
        }
    },
    login: {
        email: { required: true },
        password: { required: true }
    },
    register: {
        email: { required: true },
        password: { required: true }
    },
    profile: {
        name: { required: true },
        lastName: { required: true },
        phone: {required: true}
    }
};

UserDefaultValues = {
    uid: undefined,
    password: undefined,   // used only to update user password data
    avatar: undefined,
    name: undefined,
    lastName: undefined,
    phone: undefined,
    gender: 'male',
    bDay: undefined,
    email: undefined,
    cpf: undefined,
    rg: undefined,
    addresses: UserAddressesList,
    provider: undefined,   // password, anonymous or facebook,
    is_admin: false,
    lists: UserLists
};

UserRecordFactory = OnyxData.Record({

    isValidLogin: function () {
        var isValid;
        if (this.get('provider') !== undefined) {
            isValid = true;
        }
        return isValid;
    },

    isValidUser: function () {
        return (this.isValidLogin() && this.get('provider') !== 'anonymous');
    },

    getListByName: function (listName) {
        return this.get('lists').getByName(listName) || UserLists.newRecord();
    },

    addAvatarAsync: function (image, formCallback) {
        ApiEndpoints.uploadFile('Users', User.get('uid'), image[0], function completed(err, res) {
            if (!Types.isError(err)) {
                this.setAsync('avatar', res.text, formCallback);
            } else {
                // on error just return the current object data
                console.log('Avatar error!');
                formCallback(this);
            }
        }.bind(this));
    },

    addAddress: function (address) {
        return this.set('addresses', this.get('addresses').update(address));
    },

    updateList: function (list) {
        return this.set('lists', this.get('lists').update(list));
    }
});

UserFactory = new UserRecordFactory('User', 'uid', UserDefaultValues, UserSchema);

module.exports = UserFactory;
