
var React = require('react'),
    PureRenderMixin = require('react/addons').addons.PureRenderMixin,
    Immutable = require('immutable'),
    Icon = require('../../mdl').Icon,
    Checkbox = require('../../mdl').Checkbox,
    AddToList;

AddToList = React.createClass({

    displayName: 'AddToList',

    propTypes : {
        user: React.PropTypes.instanceOf(Immutable.Record).isRequired,
        product: React.PropTypes.instanceOf(Immutable.Record).isRequired,
        onAdd: React.PropTypes.func
    },

    componentDidMount: function(){
        if (this.props.todo === 'remove') {
            this.refs.wishBut.setChecked(true);
        }
    },

    mixins: [PureRenderMixin],

    _getList: function () {
        return this.props.user.getListByName('default');
    },

    _handleAddOrRemove: function (event) {
        event.preventDefault();
        var userList = this._getList();
        if (!userList.getProduct(this.props.product)) {
            this.refs.wishBut.setChecked(true);     // for instant reaction
            userList = userList.addProduct(this.props.product);
        } else {
            this.refs.wishBut.setChecked(false);    // for instant reaction
            userList = userList.removeProduct(this.props.product);
        }
        if (this.props.onAdd) this.props.onAdd();
    },

    render: function () {
        var defaultList,
            wishStyle = {
                position: 'absolute',
                top: 0,
                right: 20
            },
            isChecked = (this._getList().getProduct(this.props.product));

        return (
            <div style={wishStyle} className="wish">
                    <span>
                    <Checkbox
                        ref="wishBut"
                        defaultChecked={isChecked}
                        checkedIcon={<Icon name='star_rate'/>}
                        unCheckedIcon={<Icon name='star_border'/>}
                        onClick={this._handleAddOrRemove}
                        />
                    </span>
            </div>
        );
    }
});

module.exports = AddToList;
