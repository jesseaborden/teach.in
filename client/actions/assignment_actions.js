import axios from 'axios';
import {HANDLE_SUBMIT_ASSIGNMENTS} from './types';
import {ALL_TEACHER_ASSIGNMENTS} from './types';
import {SELECT_ASSIGNMENTS} from './types';

export function getAssignments (classId) {
	return function(dispatch) {
		axios({
			method: 'GET',
			url: '/api/teacher/classes/class/assignment',
			params: {
				classId: classId
			}
		}).then(function(assignments){
			console.log('assignments:', assignments.data);
			dispatch({type: ALL_TEACHER_ASSIGNMENTS, payload: assignments.data})
		})
	}

}

export function handleSubmitAssignment (name, classTitle, type, date) {
	return function(dispatch) {
		axios.post('/api/teacher/classes/class/assignment', {
					name: name,
					className: classTitle,
					type: type,
					dueDate: date,
				})
			  .then(function (response) {
					console.log('assignments:', assignments.data);
					dispatch({type: HANDLE_SUBMIT_ASSIGNMENTS})
  			})
  	  	.catch(function (error) {
  	  		console.log("error with the assignment post");
  	  	})
	}

}

export function selectAssignment (assignment) {
	return function(dispatch) {
		dispatch({type: SELECT_ASSIGNMENTS, payload: assignment})
	}

}