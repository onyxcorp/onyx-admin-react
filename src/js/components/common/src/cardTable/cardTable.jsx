
/**
 *      REFERENCES
 *      http://www.getmdl.io/components/index.html#tables-section
 *      https://github.com/google/material-design-lite/tree/master/src/data-table
 *
 *      The card table guideline can be found here
 *      http://www.google.com.br/design/spec/components/data-tables.html#data-tables-tables-within-cards
 */

var React = require('react'),
    PureRenderMixin = require('react/addons').addons.PureRenderMixin,
    classNames = require('classnames'),
    assign = require('object-assign'),
    CardTableHeader = require('./cardTableHeader.jsx'),
    CardTableBody = require('./cardTableBody.jsx'),
    CardTableFoot = require('./cardTableFoot.jsx'),
    CardTableActions = require('./cardTableActions.jsx'),
    Card = require('../../../mdl').Card,
    CardSupportingText = require('../../../mdl').CardSupportingText,
    CardTable;

CardTable = React.createClass({

    displayName: 'CardTable',

    propTypes: {
        className: React.PropTypes.string,
        style: React.PropTypes.shape({
            base: React.PropTypes.object,
            table: React.PropTypes.object,
            thead: React.PropTypes.object
        }),
        columns: React.PropTypes.arrayOf(
            React.PropTypes.shape({
                label: React.PropTypes.string,
                name: React.PropTypes.string,
                numeric: React.PropTypes.bool
            })).isRequired,
        selectable: React.PropTypes.bool,
        primaryHeader: function (props, propName, componentName) {
            if (props[propName].type !== CardTableHeader) {
                return new Error('`' + componentName + '` only accepts `CardTableHeader` as primaryHeader prop.');
            }
        },
        secondaryHeader: function (props, propName, componentName) {
            if (props[propName].type !== CardTableHeader) {
                return new Error('`' + componentName + '` only accepts `CardTableHeader` as secondaryHeader prop.');
            }
        },
        body: function (props, propName, componentName) {
            if (props[propName].type !== CardTableBody) {
                return new Error('`' + componentName + '` only accepts `CardTableBody` as body prop.');
            }
        },
        foot: function (props, propName, componentName) {
            if (props[propName].type !== CardTableFoot) {
                return new Error('`' + componentName + '` only accepts `CardTableFoot` as footer prop.');
            }
        },
        actions: function (props, propName, componentName) {
            if (props[propName].type !== CardTableActions) {
                return new Error('`' + componentName + '` only accepts `CardTableActions` as actions prop.');
            }
        },
        onSelect: React.PropTypes.func
    },

    getDefaultProps: function () {
        return {
            selectable: false
        };
    },

    getInitialState: function () {
        return {
            totalSelectedLines: 0
        };
    },

    mixins: [PureRenderMixin],

    defaultStyles: {    // those styles are the same from the mdl css...
        base: {},
        table: {
            border: 0,
            width: '100%',
            textAlign: 'center',
            position: 'relative',
            borderCollapse: 'collapse',
            whiteSpace: 'nowrap',
            fontSize: '13px',
            backgroundColor: '#fff'
        },
        thead: {
            textAlign: 'center',
            paddingBottom: '3px'
        }
    },

    _getCellClass: function (column) {
        return !column.numeric ? 'mdl-data-table__cell--non-numeric' : '';
    },

    _handleSelect: function (callback, checked) {
        if (callback) callback(checked);
        var updatedSelected;
        if (checked) {
            updatedSelected = this.state.totalSelectedLines + 1;
        } else {
            updatedSelected = this.state.totalSelectedLines - 1;
        }
        this.setState({
            totalSelectedLines: updatedSelected < 0 ? 0 : updatedSelected
        });
    },

    render: function () {
        var {
            className,
            style,
            columns,
            selectable,
            primaryHeader,
            secondaryHeader,
            body,
            foot,
            actions,
            onSelect,
            children,
            ...otherProps
        } = this.props;

        var classes,
            thead,
            tfoot,
            tbody,
            baseStyle,
            secondaryHeaderStyle,
            tableStyle,
            theadStyle;

        classes = classNames(['mdl-data-table', 'mdl-js-data-table'], className);

        baseStyle = style && style.base ? assign({}, this.defaultStyles.base, style.base) : this.defaultStyles.base;
        secondaryHeaderStyle = style && style.secondaryHeader ? assing({}, this.defaultStyles.secondaryHeader, style.secondaryHeader) : this.defaultStyles.secondaryHeader;
        tableStyle = style && style.table ? assign({}, this.defaultStyles.table, style.table) : this.defaultStyles.table;
        theadStyle = style && style.thead ? assign({}, this.defaultStyles.thead, style.thead) : this.defaultStyles.thead;

        thead = (
            <thead style={theadStyle}>
                <tr>
                    {columns.map( function (column) {
                        return (
                            <th key={column.name} className={this._getCellClass(column)}>{column.label}</th>
                        );
                    }.bind(this))}
                </tr>
            </thead>
        );

        // clone the tableLines so the table can controll and have a callback on the selected items
        if (body) {
            tbody = React.cloneElement(body, {
                selectable: selectable || body.props.selectable,
                columns: columns.length,
                onSelect: this._handleSelect.bind(this, body.props.onSelect)
            });
        }

        if (foot) {
            tfoot = React.cloneElement(foot, {});
        }

        return (
            <Card style={baseStyle} {...otherProps}>
                {this.state.totalSelectedLines ?
                    React.cloneElement(secondaryHeader, {
                        subtitle: this.state.totalSelectedLines + (this.state.totalSelectedLines > 1 ? ' itens selecionados' : ' item selecionado'),
                        primary: false
                    }) : primaryHeader}
                <CardSupportingText style={{padding: 0, width: '100%'}}>
                    <table style={tableStyle} className={classes}>
                        {thead}
                        {tfoot}
                        {tbody}
                    </table>
                </CardSupportingText>
                {actions}
            </Card>
        );
    }
});

module.exports = CardTable;
