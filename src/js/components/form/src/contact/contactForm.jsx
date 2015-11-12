
var React = require('react'),
    Immutable = require('immutable'),
    PureRenderMixin = require('react/addons').addons.PureRenderMixin,
    ImmutableFormMixin = require('../../../mixin/ImmutableForm'),
    Form = require('../../../common').Form,
    FormActions = require('../../../common').FormActions,
    Button = require('../../../mdl').Button,
    TextField = require('../../../mdl').TextField,
    ContactForm;

ContactForm = React.createClass({

    displayName: 'ContactForm',

    propTypes: {
        contact: React.PropTypes.instanceOf(Immutable.Record).isRequired,
        onSubmit: React.PropTypes.func
    },

    mixins: [PureRenderMixin, ImmutableFormMixin(['contact'])],

    _handleSubmit: function () {
        var invalidState = this.getLinkedState('contact').invalidateSchema('send');
        if (invalidState.isInvalid()) {
            this.setErrorState('contact', invalidState);
        } else {
            if (this.props.onSubmit) this.props.onSubmit(this.getLinkedState('contact'));
        }
    },

    render: function () {

        return (
            <Form onSubmit={this._handleSubmit}>
                <TextField
                    name={this.setFieldName('contact', 'name')}
                    valueLink={this.linkState('contact', 'name')}
                    label="Nome ou Empresa"
                    onFocus={this.clearErrorState}
                    errorText={this.getErrorStateMessage('contact', 'name')} />
                <TextField
                    name={this.setFieldName('contact', 'email')}
                    valueLink={this.linkState('contact', 'email')}
                    label="E-mail"
                    onFocus={this.clearErrorState}
                    errorText={this.getErrorStateMessage('contact', 'email')} />
                <TextField
                    name={this.setFieldName('contact', 'phone')}
                    valueLink={this.linkState('contact', 'phone')}
                    label="Telefone"
                    onFocus={this.clearErrorState}
                    errorText={this.getErrorStateMessage('contact', 'phone')} />
                <TextField
                    name={this.setFieldName('contact', 'description')}
                    valueLink={this.linkState('contact', 'description')}
                    label="Mensagem"
                    multiLine={true}
                    onFocus={this.clearErrorState}
                    errorText={this.getErrorStateMessage('contact', 'description')} />
                <FormActions>
                    <Button raised={true} type="submit" icon="send" colored={true}>Enviar</Button>
                </FormActions>
            </Form>
        );
    }
});

module.exports = ContactForm;
