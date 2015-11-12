
var React = require('react'),
    Immutable = require('immutable'),
    PureRenderMixin = require('react/addons').addons.PureRenderMixin,
    Reviews = require('../views/reviewsList.jsx'),
    Texts = require('../../texts.js'),
    Progress = require('../../../common').Progress,
    Paper = require('../../../mdl').Paper,
    Tab = require('../../../mdl').Tab,
    Tabs = require('../../../mdl').Tabs,
    ProductTabs;

ProductTabs =
    React.createClass({

        contextTypes: {
            flux: React.PropTypes.object
        },

        propTypes: {
            cart: React.PropTypes.instanceOf(Immutable.Record).isRequired,
            product: React.PropTypes.instanceOf(Immutable.Record).isRequired,
            pending: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.bool])
        },

        mixins: [PureRenderMixin],

        render: function () {

            var tabChildStyle = {
                marginTop: '10'
            };

            return (
                <Tabs backgroundColor='#292a2b' style={{marginTop: 20}} color='#fff' lineColor='#478C37' defaultActiveTab='descricao'>
                    <Tab label={Texts.tabs.descricao} id="descricao">
                        <div style={tabChildStyle}>
                            <Paper>
                                <p>{this.props.product.get('description')}</p>
                                <p style={{fontSize: 11}}><strong>{Texts.tabs.dimensoes}: </strong> {this.props.product.get('weight')}g, {this.props.product.get('width')} x {this.props.product.get('height')} x {this.props.product.get('depth')}  </p>
                            </Paper>
                        </div>
                    </Tab>
                    <Tab label={Texts.tabs.reviews} id="reviews">
                        <div style={tabChildStyle}>
                            <Reviews {...this.props} />
                        </div>
                    </Tab>
                    <Tab label={Texts.tabs.orcamento} id="orcamento">
                        <div style={tabChildStyle}>
                        </div>
                    </Tab>
                </Tabs>
            );
        }
    });

module.exports = ProductTabs;
