var React = require('react'),
    Immutable = require('immutable'),
    PureRenderMixin = require('react/addons').addons.PureRenderMixin,
    titleSetMixin = require('../../../mixin/titleMixin'),
    Grid = require('../../../mdl').Grid,
    Col = require('../../../mdl').Col,
    Paper = require('../../../mdl').Paper,
    Post;

Post =
    React.createClass({

        propTypes: {
            post: React.PropTypes.instanceOf(Immutable.Record).isRequired,
            pending: React.PropTypes.oneOfType([ React.PropTypes.string, React.PropTypes.bool ])
        },

        mixins: [PureRenderMixin, titleSetMixin],

        render: function () {
            return (
                <div>
                    <div className="page-title-wrapper">
                        <Grid style={{margin: '0 auto', maxWidth: 1280}}>
                            <div className="page-title">
                                <h2>{this.props.post.get('title')}</h2>
                            </div>
                        </Grid>
                    </div>
                    <Grid style={{margin: '0 auto', maxWidth: 1280}}>
                        <div className='paperContent' style={{width: '100%'}}>
                            <Paper shadow={2} style={{zIndex: 2, width: '100%'}}>
                                {this.props.post.get('content')}
                            </Paper>
                        </div>
                    </Grid>
                </div>
            );
        }
    });

module.exports = Post;
