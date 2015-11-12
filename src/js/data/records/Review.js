
var OnyxData = require('../OnyxData'),
    moment = require('moment'),
    ReviewSchema,
    ReviewDefaultValue,
    ReviewRecordFactory,
    ReviewFactory;

ReviewSchema = {
    base: {
        id: {
            type: 'string',
            match: /^[a-zA-Z0-9._-]+/,
            properties: {
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
        description: {
            type: 'string',
            // match: 'isAlphanumeric',
            properties: {
                label: 'Descrição',
                min: 10,
                errorMessage: 'precisa ser texto e ter no mínimo 10 caracteres'
            }
        },
        product_id: {
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
        score: {
            type: 'number',
            match: 'isInt',
            properties: {
                label: 'Nota',
                min: 1,
                max: 5,
                exampleMessage: '3',
                errorMessage: 'precisa ser numérico e entre 1 e 5'
            }
        }
    },
    productReview: {
        title: { required: true },
        description: { required: true },
        product_id: { required: true },
        uid: { required: true }
    }
};

ReviewDefaultValue = {
    id: undefined,
    product_id: undefined,
    uid: undefined,
    score: 3,
    title: undefined,
    description: undefined
};

ReviewRecordFactory = OnyxData.Record({
    getReviewDateFromNow: function () {
        var currentDate = this.get('date'),
            momentDate = moment(currentDate);
        if (momentDate.isValid()) return momentDate.fromNow();
        return currentDate;
    }
});

ReviewFactory = new ReviewRecordFactory('Review', 'id', ReviewDefaultValue, ReviewSchema);

module.exports = ReviewFactory;
