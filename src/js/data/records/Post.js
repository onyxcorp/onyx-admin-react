
var OnyxData = require('../OnyxData'),
    Slugify = require('../../utils/Slugify'),
    PostSchema,
    PostDefaultValues,
    PostRecordFactory,
    PostFactory;

PostSchema = {
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
            match: /^[a-zA-Z0-9-]{5,}$/,  // min length of 5
            properties: {
                label: 'Link',
                exampleMessage: 'oi-eu-sou-um-titulo',
                errorMessage: 'precisa ser texto e ter no mínimo 5 caracteres'
            }
        },
        content: {
            type: 'string',
            properties: {
                label: 'Conteudo',
                min: 10,
                errorMessage: 'precisa ser texto e ter no mínimo 10 caracteres'
            }
        },
        type: {
            type: 'string',
            properties: {
                label: 'Tipo',
                allow: ['pages', 'blogs']
            }
        },
        childs: {
            type: 'array',
            properties: {
                label: 'Children Posts'
            }
        }
    },
    register: {
        title: { required: true },
        slug: { required: true },
        content: { required: true },
        type: {required: true}
    }
};

PostDefaultValues = {
    id: undefined,
    title: undefined,
    slug: undefined,
    childs: [],
    content: undefined,
    type: undefined
};

PostRecordFactory = OnyxData.Record({
    setTitleWithSlug: function (title) {
        return this.merge({
            slug: Slugify(title),
            title: title
        });
    }
});

PostFactory = new PostRecordFactory('Post', 'id', PostDefaultValues, PostSchema);

module.exports = PostFactory;
