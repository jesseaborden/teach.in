//Libs
import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { addClass } from '../../actions/create_class_action';

class AddClass extends Component {
	constructor (props) {
		super(props);

		this.state = {name: '', start: '', end: '', date: ''};
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit (e) {
		e.preventDefault();
		this.props.addClass(this.state.name);
	}

	render () {
		return (
			<div>
				<p className='classListHeader'>My Classes</p>
				<form className='addClassForm input-group'>
					<input 	
						type='text'
						name='class-name'
						placeholder='Enter class name' 
						value={this.state.name} 
						onChange={nameEvent => this.setState({ name: nameEvent.target.value })}
						className='form-control'
					/>
					<div className='input-group-btn'>
					<button className='btn btn-secondary' type='submit' onSubmit={this.handleSubmit} onClick={this.handleSubmit}>Add</button>
					</div>
				</form>
			</div>
		);
	}
};

function mapStateToProps(state) {
	return {
		classes: state.classEvents.classEvents,
	}
}

var CreateClassContainer = connect(mapStateToProps, { addClass: addClass })(AddClass);
export default CreateClassContainer;