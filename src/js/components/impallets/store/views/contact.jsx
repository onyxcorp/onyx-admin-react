
var React = require('react'),
    Immutable = require('immutable'),
    PureRenderMixin = require('react/addons').addons.PureRenderMixin,
    titleSetMixin = require('../../../mixin/titleMixin'),
    Texts = require('../../texts.js'),
    ContactForm = require('../../../form').Contact.ContactForm,
    Grid = require('../../../mdl').Grid,
    Paper = require('../../../mdl').Paper,
    Contact;

Contact = React.createClass({

    displayName: 'Contact',

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
                            <h2>{Texts.contact.pageTitle}</h2>
                        </div>
                    </Grid>
                </div>
                <Grid>
                    <div className='paperContent'>
                        <Paper shadow={2}>
                            <ContactForm contact={this.props.contact} onSubmit={this._onSubmit} />
                        </Paper>
                    </div>
                </Grid>
            </div>
        );
    }
});

module.exports = Contact;
