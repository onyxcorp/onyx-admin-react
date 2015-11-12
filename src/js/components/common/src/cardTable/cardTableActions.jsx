var React = require('react'),
    PureRenderMixin = require('react/addons').addons.PureRenderMixin,
    classNames = require('classnames'),
    assign = require('object-assign'),
    CardActions = require('../../../mdl').CardActions,
    CardTableActions;

CardTableActions = React.createClass({

    displayName: 'CardTableActions',

    propTypes: {
        className: React.PropTypes.string,
        style: React.PropTypes.object
    },

    mixins: [PureRenderMixin],

    defaultStyles: {},

    render: function () {
        var {
            className,
            style,
            children,
            ...otherProps
        } = this.props;

        return (
            <CardActions style={assign({}, this.defaultStyles, style)} className={className} {...otherProps}>
                {children}
            </CardActions>
        );
    }
});

module.exports = CardTableActions;
