var React = require('react'),
    PureRenderMixin = require('react/addons').addons.PureRenderMixin,
    assign = require('object-assign'),
    CardTableFoot;

CardTableFoot = React.createClass({

    displayName: 'CardTableFoot',

    propTypes: {
        className: React.PropTypes.string,
        style: React.PropTypes.object
    },

    mixins: [PureRenderMixin],

    defaultStyles: {
        color: 'rgb(117, 117, 117)'
    },

    render: function () {
        var {
            className,
            style,
            children,
            ...otherProps
        } = this.props;

        return (
            <tfoot style={assign({}, this.defaultStyles, style)} className={className} {...otherProps}>
                {children}
            </tfoot>
        );
    }
});

module.exports = CardTableFoot;
