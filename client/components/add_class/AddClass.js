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
		// console.log(this,"this this this")
		this.props.addClass(this.state.name);
	}

	render () {
		console.log('this is props', this.props)
		return (
			<div>
				<form className='addClassForm'>
					Class Name:
					<input 	
						type='text'
						name='class-name'
						placeholder='Enter class name' 
						value={this.state.name} 
						onChange={nameEvent => this.setState({ name: nameEvent.target.value })}
					/>
					<div>
					<button onClick={this.handleSubmit}>Submit</button>
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