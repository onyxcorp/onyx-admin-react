
var React = require('react'),
    Immutable = require('immutable'),
    PureRenderMixin = require('react/addons').addons.PureRenderMixin,
    titleSetMixin = require('../../../mixin/titleMixin'),
    Texts = require('../../texts.js'),
    ContactForm = require('../../../form').Contact.ContactForm,
    Grid = require('../../../mdl').Grid,
    Paper = require('../../../mdl').Paper,
    ContactCorporative;

ContactCorporative = React.createClass({

    displayName: 'ContactCorporative',

    contextTypes: {
        flux: React.PropTypes.object
    },

    propTypes: {
        contact: React.PropTypes.instanceOf(Immutable.Record).isRequired
    },

    mixins: [PureRenderMixin, titleSetMixin],

    _onSubmit: function (contact) {
        this.context.flux.getActions('contact').updateContact(contact);
    },

    render: function () {

        return (
            <div>
                <div className="page-title-wrapper">
                    <Grid>
                        <div className="page-title">
                            <h2>VENDA CORPORATIVA</h2>
                        </div>
                    </Grid>
                </div>
                <Grid>
                    <div className='paperContent'>
                        <Paper shadow={2}>
                            <p>
                                Para pedidos com valores acima de 1.000 unidades fale conosco pelo formulário abaixo
                                ou pelos telefones (11) 2868-2988 ou Nextel (11) 7876-5940 ID 84*88136
                            </p>
                            <ContactForm contact={this.props.contact} onSubmit={this._onSubmit} />
                        </Paper>
                    </div>
                </Grid>
            </div>
        );
    }
});

module.exports = ContactCorporative;
