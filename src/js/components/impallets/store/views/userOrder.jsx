
var React = require('react'),
    Immutable = require('immutable'),
    PureRenderMixin = require('react/addons').addons.PureRenderMixin,
    Grid = require('../../../mdl').Grid,
    Paper = require('../../../mdl').Paper,
    Order;

Order =
    React.createClass({

        contextTypes: {
            flux: React.PropTypes.object,
            router: React.PropTypes.func
        },

        propTypes: {
            order: React.PropTypes.instanceOf(Immutable.Record).isRequired
        },

        mixins: [PureRenderMixin],  // automatically uses shouldComponentUpdate

        render: function () {

            return (
                <div>
                    <div className="page-title-wrapper">
                        <Grid>
                            <div className="page-title">
                                <h2>Pedido número: {this.props.order.get('id')}</h2>
                            </div>
                        </Grid>
                    </div>
                    <Grid>
                        <div className='paperContent' style={{width: '100%'}}>
                            <Paper shadow={2}>
                                <ul>
                                    <li>ID: {this.props.order.get('id')}</li>
                                    <li>Total: {this.props.order.get('total')}</li>
                                    <li>Usuário: {this.props.order.get('uid')}</li>
                                </ul>
                            </Paper>
                        </div>
                    </Grid>
                </div>
            );
        }
    });

module.exports = Order;
