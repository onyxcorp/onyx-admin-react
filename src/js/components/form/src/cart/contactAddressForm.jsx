
var React = require('react'),
    PureRenderMixin = require('react/addons').addons.PureRenderMixin,
    Immutable = require('immutable'),
    ImmutableFormMixin = require('../../../mixin/ImmutableForm'),
    Form = require('../../../common').Form,
    FormActions = require('../../../common').FormActions,
    Button = require('../../../mdl').Button,
    TextField = require('../../../mdl').TextField,
    ContactAddressForm;

ContactAddressForm = React.createClass({

    displayName: 'ContactAddressForm',

    propTypes: {
        user : React.PropTypes.instanceOf(Immutable.Record).isRequired,
        address: React.PropTypes.instanceOf(Immutable.Record).isRequired,
        actions: React.PropTypes.bool,
        onSubmit: React.PropTypes.func
    },

    getDefaultProps: function () {
        return {
            actions: true
        };
    },

    mixins: [PureRenderMixin, ImmutableFormMixin(['user', 'address'])],  // automatically uses shouldComponentUpdate

    triggerSubmit: function () {
        this._handleSubmit();
    },

    _handleSubmit: function () {
        var userInvalidState = this.getLinkedState('user').invalidateSchema('profile');
        var addressInvalidState = this.getLinkedState('address').invalidateSchema('register');
        if (userInvalidState.isInvalid() || addressInvalidState.isInvalid()) {
            this.setErrorState('user', userInvalidState);
            this.setErrorState('address', addressInvalidState);
        } else {
            if (this.props.onSubmit) this.props.onSubmit(this.getLinkedState('user'), this.getLinkedState('address'));
        }
    },

    render: function () {

        var {
            actions,
            ...otherProps
        } = this.props;

        return (
            <Form onSubmit={this._handleSubmit} {...otherProps}>
                <TextField
                    name={this.setFieldName('user', 'name')}
                    valueLink={this.linkState('user', 'name')}
                    label="Nome"
                    onFocus={this.clearErrorState}
                    errorText={this.getErrorStateMessage('user', 'name')} />
                <TextField
                    name={this.setFieldName('user', 'lastName')}
                    valueLink={this.linkState('user', 'lastName')}
                    label="Sobrenome"
                    onFocus={this.clearErrorState}
                    errorText={this.getErrorStateMessage('user', 'lastName')} />
                <TextField
                    name={this.setFieldName('user', 'phone')}
                    valueLink={this.linkState('user', 'phone')}
                    label="Telefone"
                    onFocus={this.clearErrorState}
                    errorText={this.getErrorStateMessage('user', 'phone')} />
                <TextField
                    name={this.setFieldName('address', 'name')}
                    valueLink={this.linkState('address', 'name')}
                    label="Local do endereço: Casa, Trabalho, etc"
                    onFocus={this.clearErrorState}
                    errorText={this.getErrorStateMessage('address', 'name')} />
                <TextField
                    name={this.setFieldName('address', 'cep')}
                    valueLink={this.linkState('address', 'cep')}
                    label="CEP"
                    onFocus={this.clearErrorState}
                    errorText={this.getErrorStateMessage('address', 'cep')} />
                <TextField
                    name={this.setFieldName('address', 'city')}
                    valueLink={this.linkState('address', 'city')}
                    label="Cidade"
                    onFocus={this.clearErrorState}
                    errorText={this.getErrorStateMessage('address', 'city')} />
                <TextField
                    name={this.setFieldName('address', 'state')}
                    valueLink={this.linkState('address', 'state')}
                    label="UF"
                    onFocus={this.clearErrorState}
                    errorText={this.getErrorStateMessage('address', 'state')} />
                <TextField
                    name={this.setFieldName('address', 'street')}
                    valueLink={this.linkState('address', 'street')}
                    label="Endere&ccedil;o"
                    onFocus={this.clearErrorState}
                    errorText={this.getErrorStateMessage('address', 'street')} />
                {actions ?
                    (<FormActions>
                        <Button type="submit">Salvar Informações</Button>
                    </FormActions>) :  null
                }
            </Form>
        );
    }
});

module.exports = ContactAddressForm;
