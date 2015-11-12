
/**
 *      REFERENCES
 *      http://www.getmdl.io/components/index.html#tables-section
 *      https://github.com/google/material-design-lite/tree/master/src/data-table
 *
 */

var React = require('react'),
    PureRenderMixin = require('react/addons').addons.PureRenderMixin,
    classNames = require('classnames'),
    assign = require('object-assign'),
    UpgradeMixin = require('../upgradeMixin.jsx'),
    Table;

Table = React.createClass({

    displayName: 'Table',

    propTypes: {
        className: React.PropTypes.string,
        style: React.PropTypes.object,
        columns: React.PropTypes.arrayOf(
            React.PropTypes.shape({
                label: React.PropTypes.string,
                name: React.PropTypes.string,
                numeric: React.PropTypes.bool
            })).isRequired,
        data: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
        selectable: React.PropTypes.bool,
        onSelect: React.PropTypes.func
    },

    getDefaultProps: function () {
        return {
            selectable: false
        };
    },

    mixins: [PureRenderMixin, UpgradeMixin('table')],

    defaultStyles: {
        width: '100%'
    },

    _getCellClass: function (column) {
        return !column.numeric ? 'mdl-data-table__cell--non-numeric' : '';
    },

    // TODO remove in the future, this was needed because the Google MDl table
    // dont have a callback to get the selected input data
    _hackArea: function (e) {
        var currentTable,
            selectedLinesNodeList,
            selectedLinesArray,
            currentSelectedElements;

        // make sure we are dealing only with the current table
        // var currentTable = this.refs[this.theRef()].getDOMNode();
        currentTable = this.refs.tableBody.getDOMNode();

        setTimeout(function () {

            // get all current selected elements
            selectedLinesNodeList = currentTable.getElementsByClassName('is-selected');
            selectedLinesArray = Array.prototype.slice.call(selectedLinesNodeList);

            if (selectedLinesArray.length) {
                var reactId,
                    elementNumber;
                currentSelectedElements = selectedLinesArray.map( function (lineDOMNode) {
                    reactId = lineDOMNode.getAttribute('data-reactid');
                    return parseInt(reactId.substr(reactId.indexOf("$") + 1));
                });
            } else {
                currentSelectedElements = [];
            }

            console.log(currentSelectedElements);
            if (this.props.onSelect) this.props.onSelect(currentSelectedElements);
        }.bind(this), 120);
    },

    render: function () {
        var {
            className,
            style,
            columns,
            data,
            selectable,
            ...otherProps
        } = this.props;

        var classes = classNames(['mdl-data-table', 'mdl-js-data-table'], {
            'mdl-data-table--selectable': selectable
        }, className);

        return (
            <table ref={this.theRef()} style={assign({}, this.defaultStyles, style)} className={classes} {...otherProps} onClick={this._hackArea}>
                <thead>
                    <tr>
                        {columns.map( function (column) {
                            return (
                                <th key={column.name} className={this._getCellClass(column)}>{column.label}</th>
                            );
                        }.bind(this))}
                    </tr>
                </thead>
                <tbody ref="tableBody">
                    {data.map( function (e, i) {
                        return (
                            <tr key={e.key ? e.key : i}>
                                {columns.map( function (column) {
                                    return (
                                        <td key={column.name} className={this._getCellClass(column)}>{e[column.name]}</td>
                                    );
                                }.bind(this))}
                            </tr>
                        );
                    }.bind(this))}
                </tbody>
            </table>
        );
    }
});

module.exports = Table;
