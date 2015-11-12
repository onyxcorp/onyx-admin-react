
/**
 *      REFERENCE https://github.com/google/material-design-lite/tree/master/src/shadow
 *
 */
var React = require('react'),
    PureRenderMixin = require('react/addons').addons.PureRenderMixin,
    classNames = require('classnames'),
    assign = require('object-assign'),
    UpgradeMixin = require('../../upgradeMixin.jsx'),
    Progress;

Progress = React.createClass({

    displayName: 'Progress',

    propTypes: {
        className: React.PropTypes.string,
        style: React.PropTypes.object,
        buffer: React.PropTypes.number,
        progress: React.PropTypes.number,
        isIndeterminate: React.PropTypes.bool
    },

    getDefaultProps: function () {
        return {
            isIndeterminate: true
        };
    },

    mixins: [PureRenderMixin, UpgradeMixin('progress')],

    defaultStyles: {},

    componentDidMount: function (){
        this._setProgress(this.props.progress);
        this._setBuffer(this.props.buffer);
    },

    componentDidUpdate: function () {
        this._setProgress(this.props.progress);
        this._setBuffer(this.props.buffer);
    },

    _setProgress: function (progress) {
        if(!this.props.indeterminate && progress !== undefined) {
            React.findDOMNode(this).MaterialProgress.setProgress(progress);
        }
    },

    _setBuffer: function (buffer) {
        if(buffer !== undefined) {
            React.findDOMNode(this).MaterialProgress.setBuffer(buffer);
        }
    },

    render: function () {
        var {
            className,
            buffer,
            progress,
            isIndeterminate,
            style,
            ...otherProps
        } = this.props;

        var classes = classNames(['mdl-progress', 'mdl-js-progress'], {
            'mdl-progress__indeterminate': isIndeterminate
        }, className);

        return (
            <div ref={this.theRef()}  style={assign({}, this.defaultStyles, style)} className={classes} {...otherProps} />
        );
    }
});

module.exports = Progress;
