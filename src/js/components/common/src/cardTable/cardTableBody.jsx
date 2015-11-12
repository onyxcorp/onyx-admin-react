var React = require('react'),
    PureRenderMixin = require('react/addons').addons.PureRenderMixin,
    assign = require('object-assign'),
    CardTableRow = require('./cardTableRow.jsx'),
    CardTableBody;

CardTableBody = React.createClass({

    displayName: 'CardTableBody',

    propTypes: {
        className: React.PropTypes.string,
        style: React.PropTypes.object,
        selectable: React.PropTypes.bool,
        columns: React.PropTypes.number,
        onSelect: React.PropTypes.func,
        children: React.PropTypes.arrayOf(function(props, propName, componentName) {
            if (props[propName].type !== CardTableRow) {
                return new Error('`' + componentName + '` only accepts `CardTableRow` as children.');
            }
        })
    },

    mixins: [PureRenderMixin],

    getDefaultProps: function () {
        return {
            columns: 2
        };
    },

    defaultStyles: {
        color: 'rgb(117, 117, 117)'
    },

    _handleSelect: function (callback, checked) {
        if (callback) callback(checked);
        if (this.props.onSelect) this.props.onSelect(checked);
    },

    render: function () {
        var {
            className,
            style,
            selectable,
            columns,
            onSelect,
            children,
            ...otherProps
        } = this.props;

        var content;

        if (React.Children.count(children)) {
            content = React.Children.map(children, function (child, index) {
                return (
                    React.cloneElement(child, {
                        key: index,
                        selectable: selectable || child.props.selectable,
                        onSelect: this._handleSelect.bind(this, child.props.onSelect)
                    })
                );
            }.bind(this));
        } else {
            content = (
                <td colSpan={columns} style={{textAlign: 'center'}}>
                    Tabela vazia
                </td>
            );
        }

        return (
            <tbody style={assign({}, this.defaultStyles, style)} className={className} {...otherProps}>
                {content}
            </tbody>
        );
    }
});

module.exports = CardTableBody;
