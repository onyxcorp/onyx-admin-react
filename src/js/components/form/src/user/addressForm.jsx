
var React = require('react'),
    PureRenderMixin = require('react/addons').addons.PureRenderMixin,
    Immutable = require('immutable'),
    assign = require('object-assign'),
    ImmutableFormMixin = require('../../../mixin/ImmutableForm'),
    Form = require('../../../common').Form,
    FormActions = require('../../../common').FormActions,
    Button = require('../../../mdl').Button,
    TextField = require('../../../mdl').TextField,
    Icon = require('../../../mdl').Icon,
    AddressForm;

AddressForm = React.createClass({

    displayName: 'AddressForm',

    propTypes: {
        className: React.PropTypes.string,
        style: React.PropTypes.object,
        address: React.PropTypes.instanceOf(Immutable.Record).isRequired,
        editMode: React.PropTypes.oneOfType([ React.PropTypes.bool ]),
        onSetAddress: React.PropTypes.func,
        onSaveAddress: React.PropTypes.func
    },

    mixins: [PureRenderMixin, ImmutableFormMixin(['address'])],

    defaultStyles: {
        padding: 10,
        textAlign: 'center'
    },

    getInitialState: function () {
        return {
            editMode: this.props.editMode || false
        };
    },

    _setEdit: function () {
        this.setState({
            editMode: true
        });
    },

    _unsetEdit: function () {
        this.resetLinkedState();    // back to the initial state data
        this.setState({
            editMode: false
        });
    },

    _handleSetAddress: function () {
        if (this.props.onSetAddress) this.props.onSetAddress(this.props.address);
    },

    _handleSaveAddress: function () {
        var invalidState = this.getLinkedState('address').invalidateSchema('register');
        if (invalidState.isInvalid()) {
            this.setErrorState('address', invalidState);
        } else {
            if (this.props.onSaveAddress) this.props.onSaveAddress(this.getLinkedState('address'));
            this._unsetEdit();
        }
    },

    render: function () {
        var {
            className,
            style,
            ...otherProps
        } = this.props;

        var content;

        if (this.state.editMode) {  // edition mode for both new/existing address
            content = (
                <Form onSubmit={this._handleSaveAddress}>
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
                    <FormActions>
                       <Button onClick={this._unsetEdit}>Cancelar</Button>
                       <Button type="submit" colored={true}>Salvar</Button>
                    </FormActions>
                </Form>
            );
        } else if (this.props.address.get('name')) {    // existing address view mode (has a name)
            content = (
                <div>
                    <Icon name="pin_drop" size={60} />
                    <h4 style={{margin: '12px 0'}}>{this.props.address.get('name')}</h4>
                    <span>{this.props.address.get('street')} - {this.props.address.get('city')} - {this.props.address.get('state')}</span>
                    <a onClick={this._setEdit} style={{textAlign: 'right', fontSize: 10, display: 'block'}}> (Editar endere&ccedil;o)</a>
                    <Button raised={true} colored={true} style={{marginTop: 10}} fullWidth={true} onClick={this._handleSetAddress} icon="check">
                        Usar este Endereço
                    </Button>
                </div>
            );
        } else {    // probably an inexisting address but on view mode
            content = (
                <div>
                    <Icon name="place" size={60} />
                    <Button colored={true} fullWidth={true} onClick={this._setEdit} icon="note_add">
                        Cadastrar Novo Endereço
                    </Button>
                </div>
            );
        }
        return (
            <div style={assign({}, this.defaultStyles, style)} className={className} {...otherProps}>
                {content}
            </div>
        );
    }
});

module.exports = AddressForm;
