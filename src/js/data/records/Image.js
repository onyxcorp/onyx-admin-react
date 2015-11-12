
var OnyxData = require('../OnyxData'),
    ImageSchema,
    ImageDefaultValue,
    ImageRecordFactory,
    ImageFactory;

ImageSchema = {
    base: {
        id: {
            type: 'string',
            match: /^[a-zA-Z0-9._-]+/,
            properties: {
                example: '-JouU2zky90T1-wJf4IV'
            }
        },
        type: {
            type: 'string',
            properties: {
                label: 'Tipo',
                example: 'large, small...'
            }
        },
        src: {
            type: 'string',
            properties: {
                label: 'Link',
                length: 618000
            },
            required: true
        }
    }
};

ImageDefaultValue = {
    id: undefined,
    type: undefined,
    src: undefined
};

ImageRecordFactory = OnyxData.Record();

ImageFactory = new ImageRecordFactory('Image', 'id', ImageDefaultValue, ImageSchema);

module.exports = ImageFactory;
