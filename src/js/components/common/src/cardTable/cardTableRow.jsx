var React = require('react'),
    PureRenderMixin = require('react/addons').addons.PureRenderMixin,
    classNames = require('classnames'),
    assign = require('object-assign'),
    Checkbox = require('../../../mdl').Checkbox,
    CardTableRow;

CardTableRow = React.createClass({

    displayName: 'CardTableRow',

    propTypes: {
        className: React.PropTypes.string,
        style: React.PropTypes.object,
        label: React.PropTypes.string,
        selectable: React.PropTypes.bool,
        onSelect: React.PropTypes.func
    },

    mixins: [PureRenderMixin],

    getDefaultProps: function () {
        return {
            selectable: false
        };
    },

    getInitialState: function () {
        return {
            isChecked: false
        };
    },

    defaultStyles: {},

    _handleChange: function (checked) {
        this.setState({
            isChecked: checked
        });
        if (this.props.onSelect) this.props.onSelect(checked);
    },

    render: function () {
        var {
            className,
            style,
            label,
            selectable,
            onSelect,
            children,
            ...otherProps
        } = this.props;

        var checkbox,
            classes;

        if (selectable) {
            checkbox = (
                <td>
                    <Checkbox label={label} onChange={this._handleChange} />
                </td>
            );
        }

        classes = classNames({
            'is-selected': this.state.isChecked
        }, className);

        return (
            <tr style={assign({}, this.defaultStyles, style)} className={classes} {...otherProps}>
                {checkbox}
                {children}
            </tr>
        );
    }
});

module.exports = CardTableRow;
