
var React = require('react'),
    Immutable = require('immutable'),
    PureRenderMixin = require('react/addons').addons.PureRenderMixin,
    titleSetMixin = require('../../../mixin/titleMixin'),
    Progress = require('../../../common').Progress,
    Grid = require('../../../mdl').Grid,
    Paper = require('../../../mdl').Paper,
    Contact;

Contact =
    React.createClass({
        displayName: 'Adicionar Orçamento',

        contextTypes: {
            flux: React.PropTypes.object,
            router: React.PropTypes.func
        },

        propTypes: {
            contact: React.PropTypes.instanceOf(Immutable.Record).isRequired,
            pending: React.PropTypes.oneOfType([ React.PropTypes.string, React.PropTypes.bool ])
        },

        mixins: [PureRenderMixin, titleSetMixin],

        render: function () {

            var isLoading = this.props.pending ? this.props.pending.containsOr('isLoading') : false;

            return (
                <Grid style={{margin: '0 auto', maxWidth: 1280}}>
                    <Paper shadow={2} style={{width: '100%'}}>
                        <Progress loading={isLoading} size={2}>
                            <h1>Informações do Pedido</h1>
                            <ul>
                                <li>ID: {this.props.order.get('id')}</li>
                                <li>Total: {this.props.order.get('total')}</li>
                                <li>Usuário: {this.props.order.get('uid')}</li>
                            </ul>
                        </Progress>
                    </Paper>
                </Grid>
            );
        }
    });

module.exports = Contact;
