var React = require('react'),
    PureRenderMixin = require('react/addons').addons.PureRenderMixin,
    assign = require('object-assign'),
    classNames = require('classnames'),
    CircularProgress = require('../../mdl').Progress,
    LinearProgress = require('../../mdl').LinearProgress,
    Progress;

Progress = React.createClass({

    displayName: 'Progress',

    propTypes: {
        className: React.PropTypes.string,
        style: React.PropTypes.object,
        loading: React.PropTypes.bool,
        type : React.PropTypes.oneOf(['linear', 'circular']),
        mode: React.PropTypes.oneOf(['determinate', 'indeterminate']),
        value: React.PropTypes.number,
        size: React.PropTypes.number
    },

    getDefaultProps: function () {
        return {
            loading: true,
            type: 'circular',
            mode: 'indeterminate',
            value: 10,
            size: 1
        };
    },

    mixins: [PureRenderMixin],

    defaultStyles: {
        textAlign: 'center',
        marginLeft: 'auto',
        marginRight: 'auto'
    },

    render : function () {

        var {
            className,
            style,
            type,
            loading,
            children,
            ...otherProps
        } = this.props;

        var content,
            classes,
            styles;

        if (loading) {
            // the styles should only be applicable while the loadidng component is being shown
            styles = assign({}, this.defaultStyles, style);
            content = type === 'linear' ? (<LinearProgress />) : (<CircularProgress />);
            classes = className;
        } else {
            content = (children);
            classes = classNames(['animated', 'fadeIn'], className);
        }

        return (
            <div style={styles} className={classes} {...otherProps}>
                {content}
            </div>
        );
    }
});

module.exports = Progress;
