//var React = require('react'),
//    Immutable = require('immutable'),
//    Tree = require('react-ui-tree'),
//    PureRenderMixin = require('react/addons').addons.PureRenderMixin,
//    titleSetMixin = require('../../shared/mixin/titleMixin'),
//    Grid = require('react-bootstrap').Grid,
//    Row = require('react-bootstrap').Row,
//    Col = require('react-bootstrap').Col,
//    ListGroup = require('react-bootstrap').ListGroup,
//    ListGroupItem = require('react-bootstrap').ListGroupItem,
//    Button = require('../../../mdl').Button,
//    Paper = require('../../../mdl').Paper,
//    SmartMenu;
//
//SmartMenu =
//    React.createClass({
//
//        propTypes: {
//            pages: React.PropTypes.instanceOf(Immutable.Record).isRequired,
//        },
//
//        mixins: [titleSetMixin],
//
//        getInitialState: function(){
//            return {
//                tree: {
//                    module: 'Menu',
//                        id: 'menu',
//                    children: [
//                        {
//                            id: 'walker'
//                        }
//                    ]
//                }
//            };
//        },
//
//        renderNode: function(node) {
//
//            if (node.id === 'menu') {
//                return (
//                    <span className='node'>
//                        <span><strong>{node.module}</strong></span>
//                    </span>
//                );
//            }
//
//            if (node.id !== 'walker') {
//                return (
//                    <span>
//                        <div className='exclude' onClick={this._removeFromMenu.bind(null,node)}>
//                            <h5 style={{display: 'inline', zIndex: 99999}}>X</h5>
//                        </div>
//                        <span>{node.module}</span>
//                  </span>
//                );
//            }
//        },
//
//
//        _generateID: function(){
//            //Temporary ID Generator, usar o do Firebase depois?
//            function s4() {
//                return Math.floor((1 + Math.random()) * 0x10000)
//                    .toString(16)
//                    .substring(1);
//            }
//            return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
//                s4() + '-' + s4() + s4() + s4();
//        },
//
//        _onChange: function(tree) {
//            this.setState({tree: tree});
//        },
//
//        _toTheMenu: function(page){
//            var menuItem = {};
//
//            menuItem.module = page.get('title');
//            menuItem.route = page.get('slug');
//            menuItem.type = 'page';
//
//            var activeTree = this.state.tree;
//
//            if (activeTree.children[0] && activeTree.children[0].id === 'walker'){
//                 activeTree.children.splice(0,1);
//            }
//
//            menuItem.id = this._generateID();
//            activeTree.children.push(menuItem);
//
//            this.setState({tree: activeTree});
//
//        },
//
//        _removeFromMenu: function(item){
//            console.log('wuuut');
//            var newChilds = JSON.stringify(this.state.tree.children);
//            var removalItem = JSON.stringify(item);
//
//                var removalItemStart = ','+removalItem;
//                var removalItemMid = removalItem;
//                var removalItemEnd = removalItem+',';
//
//               newChilds = newChilds.replace(removalItemStart, '');
//               newChilds = newChilds.replace(removalItemMid, '');
//               newChilds =  newChilds.replace(removalItemEnd, '');
//
//
//            newChilds = JSON.parse(newChilds);
//
//            if (newChilds.length === 0){
//                newChilds.push({id: 'walker'});
//            }
//
//            var newTree = this.state.tree;
//            newTree.children = newChilds;
//
//            this.setState({tree: newTree});
//
//        },
//
//        _defaultPreventer: function(e){
//            e.preventDefault();
//        },
//
//        render: function () {
//            return (
//                <Grid>
//                    <Paper shadow={2}>
//                        <Row>
//                            <Col xs={4}>
//                                <ListGroup>
//                                    {this.props.pages.get('list').map( function(page, index) {
//                                        return (
//                                            <ListGroupItem onClick={this._defaultPreventer} key={index}>
//                                                {page.get('title')}
//                                                <div style={{position: 'absolute', top: 0, right: 0}}>
//                                                    <Button iconButton={true}
//                                                        icon="trending_flat"
//                                                        tooltipStyles={{zIndex: 3, top: 0, left: -70}}
//                                                        tooltip='Add to Menu'
//                                                        onClick={this._toTheMenu.bind(null,page)} />
//                                                </div>
//                                            </ListGroupItem>
//                                        );
//                                    }.bind(this))}
//
//                                </ListGroup>
//                            </Col>
//                            <Col xs={8}>
//                                <div className="tree">
//                                    <Tree
//                                        paddingLeft={20}
//                                        tree={this.state.tree}
//                                        onChange={this._onChange}
//                                        renderNode={this.renderNode}/>
//                                </div>
//                            </Col>
//                        </Row>
//                    </Paper>
//                </Grid>
//            );
//        }
//    });
//
//module.exports = SmartMenu;
