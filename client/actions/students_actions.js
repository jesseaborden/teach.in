import axios from 'axios';

import { ALL_STUDENTS } from './types';

export function getStudents(className) {
	return function (dispatch) {
		axios({
			method: 'GET',
			url: '/api/teacher/classes/class',
			params: {
				className: className,
			},
		}).then(function (students) {
			dispatch({ type: ALL_STUDENTS, payload: students.data });
		});
	};
}
