
var React = require('react'),
    PureRenderMixin = require('react/addons').addons.PureRenderMixin,
    assign = require('object-assign'),
    AddSubtractQuantityButton = require('./addSubtractQuantityButton.jsx'),
    TextField = require('../../mdl').TextField,
    UpdateQuantity;

UpdateQuantity = React.createClass({

    displayName: 'UpdateQuantity',

    propTypes: {
        className: React.PropTypes.string,
        style: React.PropTypes.object,
        quantity: React.PropTypes.number,
        onAdd: React.PropTypes.func,
        onSubtract: React.PropTypes.func,
        onChange: React.PropTypes.func
    },

    getDefaultProps: function () {
        return {
            quantity: 1
        };
    },

    getInitialState: function () {
        return {
            quantity: this.props.quantity
        };
    },

    mixins: [PureRenderMixin],

    defaultStyles: {
        display: 'inline-flex',
        boxSizing: 'border-box',
        WebkitAlignItems: 'center',
        alignItems: 'center',
        WebkitJustifyContent: 'space-between',
        justifyContent: 'space-between'
    },

    _handleAdd: function () {
        this.setState({
            quantity: this.state.quantity + 1
        });
        if (this.props.onAdd) this.props.onAdd();
    },

    _handleSubtract: function () {
        if (this.state.quantity > 1) {
            this.setState({
                quantity: this.state.quantity - 1
            });
            if (this.props.onSubtract) this.props.onSubtract();
        }
    },

    _handleChange: function (event) {
        var numberRegex=/^[0-9]+$/;
        var newQuantity = event.target.value;
        var finalQuantity;
        if (newQuantity === '') {
            finalQuantity = 1;
        } else if (!newQuantity.match(numberRegex)) {
            return false;
        } else {
            finalQuantity = newQuantity;
        }
        this.setState({
            quantity: parseInt(finalQuantity)
        });
        if (this.props.onChange) this.props.onChange(finalQuantity);
    },

    render: function () {

        var {
            className,
            style,
            quantity,
            onAdd,
            onSubtract,
            onChange,
            ...otherProps
        } = this.props;

        return (
            <form style={assign({}, this.defaultStyles, style)} id="quantityForm" className={className} {...otherProps}>
                <AddSubtractQuantityButton type='remove' onClick={this._handleSubtract} />
                <TextField
                    name='quantity'
                    value={this.state.quantity}
                    onChange={this._handleChange}
                    style={{input: {textAlign: 'center', width: '50px'}}} />
                <AddSubtractQuantityButton type='add' onClick={this._handleAdd} />
            </form>
        );
    }
});

module.exports = UpdateQuantity;
