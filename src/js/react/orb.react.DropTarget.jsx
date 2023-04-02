/** @jsx React.DOM */

/* global module, require, react */
/*jshint eqnull: true*/

'use strict';

var dtid = 0;

module.exports.DropTarget = React.createClass({
	getInitialState: function () {
		this.dtid = ++dtid;
		return {
			isover: false
		};
	},
  	componentDidMount: function() {
  		dragManager.registerTarget(this, this.props.axetype, this.onDragOver, this.onDragEnd);
  	},
	componentWillUnmount : function() {
		dragManager.unregisterTarget(this);
	},
	onDragOver: function(callback) {
		if(this.isMounted()) {
			this.setState({
				isover: true
			}, callback);
		} else if(callback) {
			callback();
		}
	},
	onDragEnd: function(callback) {
		if(this.isMounted()) {
			this.setState({
				isover: false
			}, callback);
		} else if(callback) {
			callback();
		}
	},
	render: function() {
		var self = this;
		var DropIndicator = module.exports.DropIndicator;

		/*var buttons = this.props.buttons.map(function(button, index) {
			if(index < self.props.buttons.length - 1) {
				return [
					<td><DropIndicator isFirst={index === 0} position={index} axetype={self.props.axetype}></DropIndicator></td>,
					<td>{ button }</td>
				];
			} else {
				return [
					<td><DropIndicator isFirst={index === 0} position={index} axetype={self.props.axetype}></DropIndicator></td>,
					<td>{ button }</td>,
					<td><DropIndicator isLast={true} position={null} axetype={self.props.axetype}></DropIndicator></td>
				];
			}
		});*/
		var dropTarget = []
		var buttons = []

		if (this.props.upperButtons) {
			buttons = this.props.buttons.map(function(button, index) {			
				if(index < self.props.buttons.length - 1) {
					return [
						<div className='drp-trgt-item'><DropIndicator isFirst={index === 0} position={index} axetype={self.props.axetype}></DropIndicator></div>,
						<div className='drp-trgt-item'>{ button }</div>
					];
				} else {
					return [
						<div className='drp-trgt-item'><DropIndicator isFirst={index === 0} position={index} axetype={self.props.axetype}></DropIndicator></div>,
						<div className='drp-trgt-item'>{ button }</div>,
						<div className='drp-trgt-item'><DropIndicator isLast={true} position={null} axetype={self.props.axetype}></DropIndicator></div>
					];
				}
			});
			dropTarget = buttons
		} else {
			buttons = this.props.buttons.map(function(button, index) {			
				if(index < self.props.buttons.length - 1) {
					return [
						<td><DropIndicator isFirst={index === 0} position={index} axetype={self.props.axetype}></DropIndicator></td>,
						<td>{ button }</td>
					];
				} else {
					return [
						<td><DropIndicator isFirst={index === 0} position={index} axetype={self.props.axetype}></DropIndicator></td>,
						<td>{ button }</td>,
						<td><DropIndicator isLast={true} position={null} axetype={self.props.axetype}></DropIndicator></td>
					];
				}
			});
			dropTarget.push(<table key='dropTarget'><tbody><tr>{buttons}</tr></tbody></table>);
		}

		var style = self.props.axetype === axe.Type.ROWS ? { position: 'absolute', left: 0, bottom: 11 } : null;

		return <div className={'drp-trgt' + (this.state.isover ? ' drp-trgt-over' : '') + (buttons.length === 0 ? ' drp-trgt-empty' : '')} style={style}>
			{dropTarget}
		</div>;
	}
});
