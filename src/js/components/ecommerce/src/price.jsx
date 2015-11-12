
var React = require('react'),
    PureRenderMixin = require('react/addons').addons.PureRenderMixin,
    assign = require('object-assign'),
    Price;

Price = React.createClass({

    displayName: 'OldPrice',

    propTypes : {
        className: React.PropTypes.string,
        style: React.PropTypes.object,
        old: React.PropTypes.bool,
        format: React.PropTypes.string
    },

    getDefaultProps: function () {
        return {
            format: 'R$',
            old: false
        };
    },

    mixins: [PureRenderMixin],

    defaultStyles: {
        fontSize: 24,
        fontWeight: 400,
        marginRight: '10px',
        lineHeight: '30px'
    },

    render: function () {

        var {
            className,
            style,
            old,
            format,
            ...otherProps
        } = this.props;

        return (
            <span style={assign({}, this.defaultStyles, style)} className={className} {...otherProps}>
                {old ? 'de' : null} <span style={old ? { textDecoration: 'line-through'} : {}}> {format} {this.props.children}</span>
            </span>

        );
    }
});

module.exports = Price;
