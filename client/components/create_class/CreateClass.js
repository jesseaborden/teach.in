//Libs
import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { createClass } from '../../actions/create_class_action';

class CreateClass extends Component {
	constructor (props) {
		super(props);

		this.state = {name: '', start: '', end: '', date: ''};
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit (e) {
		console.log(this.props.classId, "this.classId")
		e.preventDefault();
		console.log(this,"this this this")
		this.props.createClass(this.state.name,this.state.start,this.state.end,this.state.date,this.props.classId);

		// axios.post('/api/teacher/classes/class/event', {
		// 			name: this.state.name,
		// 			start: this.state.start,
		// 			end: this.state.end,
		// 			date: this.state.date,
		// 			classId: this.props.classId
		// 		})
		// 	  .then(function (response) {
		// 			console.log(response);
  // 	  	})
  // 	  	.catch(function (error) {
  // 	  		console.log(error);
  // 	  	})
	}

	render () {
		return (
			<div>
				<form className='eventForm'>
					<input 	
						type='text'
						name='class-name'
						placeholder='Class Name' 
						value={this.state.name} 
						onChange={nameEvent => this.setState({ name: nameEvent.target.value })}
					/>
					<input 
						type='time'
						name='start-time'
						placeholder='Start Time'
						value={this.state.start} 
						onChange={startEvent => this.setState({ start: startEvent.target.value })}
					/>
					<input
						type='time'
						name='end-time'
						placeholder='End Time'
						value={this.state.end} 
						onChange={endEvent => this.setState({ end: endEvent.target.value })} 
					/>
					<input
						type='date'
						name='class-date'
						value={this.state.date} 
						onChange={date => this.setState({ date: date.target.value })}
					/>
					<div>
					<button onClick={this.handleSubmit}>Submit</button>
					<button>Cancel</button>
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

var CreateClassContainer = connect(mapStateToProps, { createClass: createClass })(CreateClass);
export default CreateClassContainer;