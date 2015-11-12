
var React = require('react'),
    Immutable = require('immutable'),
    PureRenderMixin = require('react/addons').addons.PureRenderMixin,
    assign = require('object-assign'),
    Table = require('../../mdl').Table,
    CommonTable;

CommonTable = React.createClass({

    displayName: 'CommonTable',

    propTypes: {
        className: React.PropTypes.string,
        style: React.PropTypes.object,
        list: React.PropTypes.instanceOf(Immutable.List).isRequired,
        fields: React.PropTypes.array.isRequired,
        onSelect: React.PropTypes.func
    },

    mixins: [PureRenderMixin],

    defaultStyles: {},

    _onRowSelection: function (data) {
        console.log(this.props.list.get(data[0]));
        if (this.props.onSelect) this.props.onSelect(data);
    },

    render: function () {

        var {
            className,
            style,
            ...otherProps
        } = this.props;

        var defaultColumns = [],
            bodyContent;

        this.props.fields.forEach(function (field, index) {
            defaultColumns.push({
                label: field.capitalize(),
                name: field,
                numeric: false
            });
        });

        bodyContent = this.props.list.map(function (data, index) {
            var rowData = {};
            this.props.fields.forEach(function (value, subIndex) {
                rowData[this.props.fields[subIndex]] = { content: data.getFormatted(value) };
            }.bind(this));
            return rowData;
        }.bind(this)).toJS();

        return (
            <Table
                style={assign({}, this.defaultStyles, style)}
                className={className}
                selectable={true}
                columns={defaultColumns}
                data={bodyContent}
                {...otherProps} />
        );
    }
});

module.exports = CommonTable;
