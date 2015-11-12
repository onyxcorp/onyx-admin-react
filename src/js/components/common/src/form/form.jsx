
var React = require('react'),
    PureRenderMixin = require('react/addons').addons.PureRenderMixin,
    assign = require('object-assign'),
    Form;

Form = React.createClass({

    displayName: 'Form',

    propTypes: {
        className: React.PropTypes.string,
        style: React.PropTypes.object,
        onSubmit: React.PropTypes.func
    },

    mixins: [PureRenderMixin],  // automatically uses shouldComponentUpdate

    defaultStyles: {},

    _handleSubmit: function (event) {
        event.preventDefault();
        if (document.activeElement) document.activeElement.blur();
        if (this.props.onSubmit) this.props.onSubmit();
    },

    render: function () {

        var {
            className,
            style,
            children,
            onSubmit,
            ...otherProps
        } = this.props;

        return (
            <form style={assign({}, this.defaultStyles, style)} className={className} onSubmit={this._handleSubmit} {...otherProps}>
                {children}
            </form>
        );
    }
});

module.exports = Form;
