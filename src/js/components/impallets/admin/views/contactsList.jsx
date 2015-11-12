
var React = require('react'),
    Immutable = require('immutable'),
    PureRenderMixin = require('react/addons').addons.PureRenderMixin,
    titleSetMixin = require('../../../mixin/titleMixin'),
    Table = require('../../../common').Table,
    Progress = require('../../../common').Progress,
    LoadMore = require('../../../common').LoadMore,
    Grid = require('../../../mdl').Grid,
    Paper = require('../../../mdl').Paper,
    ContactsList;

ContactsList =
    React.createClass({

        contextTypes: {
            flux: React.PropTypes.object
        },

        propTypes: {
            contacts: React.PropTypes.instanceOf(Immutable.Record).isRequired,
            pending: React.PropTypes.oneOfType([ React.PropTypes.string, React.PropTypes.bool ])
        },

        mixins: [PureRenderMixin, titleSetMixin],

        _loadMore: function () {
            this.context.flux.getActions('contact').setContacts(this.props.contacts, 3);
        },

        render: function () {

            var isLoading = this.props.pending ? this.props.pending.containsOr('isLoading', 'isLoadingContacts') : false,
                isLoadingMore = this.props.pending ? this.props.pending.contains('isLoadingMoreContacts') : false;

            return (

            <div>
                <div className="page-title-wrapper">
                    <Grid style={{margin: '0 auto', maxWidth: 1280}}>
                        <div className="page-title">
                            <h2>Lista de Contatos</h2>
                        </div>
                    </Grid>
                </div>
                <Grid style={{margin: '0 auto', maxWidth: 1280}}>
                    <div className='paperContent' style={{width: '100%'}}>
                        <Paper shadow={2}>
                            <Progress loading={isLoading} size={2}>
                                <Table list={this.props.contacts.get('list')} fields={['id', 'name', 'email','description']} />
                            </Progress>
                        </Paper>
                        <div className="admin-load-more">
                            <LoadMore label={'Carregar mais Contatos'} loading={isLoadingMore} onClick={this._loadMore} />
                        </div>
                    </div>
                </Grid>
            </div>
            );
        }
    });

module.exports = ContactsList;
