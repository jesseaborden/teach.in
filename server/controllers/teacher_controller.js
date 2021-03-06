var teacherController = {};
const Teacher = require('../models/teacher_model');
const sequelize = require('../database').sequelize;
const Class = require('../models/class_model');
const Student = require('../models/student_model');
const Assignment = require('../models/assignment_model');
const AssignmentStudents = require('../models/assignmentStudents_model');
const ClassStudents = require('../models/classStudents_model');
const Event = require('../models/event_model');
const Resource = require('../models/resource_model');
const _ = require('lodash');
const mapPercentToGrade = require('../helpers/helpers').mapPercentToGrade;

teacherController.SIGNUP = (req, res) => {

	console.log('i changed the password from 123 to:', req.body.password);
	Teacher.create({
		name: req.body.name,
		email: req.body.email,
		password: req.body.password,
		picture: 'https://s3.amazonaws.com/teach.in123454321/blank-profile-picture-973460_960_720.png'
	}).then((teacher) => {
		if (req.body.email === 'teacher@edu.com') {
			//seeding two classes automatically for this teacher
			var classArr = [];
			for (let i = 0; i < 2; i++) {
				let classI = Class.build({
					name: 'class ' + i,
					totalPoints: 400,
				});
				classArr.push(classI);
			};

			var studentArr1 = [];
			for (let i = 0; i < 10; i++) {
				let studentI = Student.build({
					name: 'student' + i,
					gpa: 4 - (Math.random() * 3).toFixed(2),
					email: 'email' + i,
					picture_url: 'https://s3.amazonaws.com/teach.in123454321/blank-profile-picture-973460_960_720.png',
				});
				studentArr1.push(studentI.save());
			}

			var studentArr2 = [];
			for (let i = 10; i < 20; i++) {
				let studentI = Student.build({
					name: 'student' + i,
					email: 'email' + i,
					gpa: 4 - (Math.random()*3).toFixed(2),
					picture_url: 'https://s3.amazonaws.com/teach.in123454321/blank-profile-picture-973460_960_720.png',
				});
				studentArr2.push(studentI.save());
			}

			var assignmentArr1 = [];
			for (let i = 0; i < 4; i++) {
				let assignmentI = Assignment.build({
					name: 'Assignment' + i,
					maxPoints: 100,
				});
				assignmentArr1.push(assignmentI.save());
			}

			var student1Assignment1 = studentArr1.concat(assignmentArr1);
			var assignmentArr2 = [];
			for (let i = 4; i < 8; i++) {
				let assignmentI = Assignment.build({
					name: 'Assignment' + i,
					maxPoints: 100,
				});
				assignmentArr2.push(assignmentI.save());
			}
			var student2Assignment2 = studentArr2.concat(assignmentArr2);

			//console.log(teacher,"teacher")

			//Code below seeds two classes to the teacher;
			for (let i = 0; i < classArr.length; i++) {
				classArr[i].save().then(function (savedClass) {
					savedClass.setTeacher(teacher);
					if (i === 0) {
						Promise.all(student1Assignment1)
							.then(function (results) {
								//console.log('the results should be a list of students and the length should be 14', results, results.length);
								var assignmentStudentsGrade = [];
								for (let k = 10; k < results.length; k++) {
									var assignmentK = results[k];
									assignmentK.setClass(savedClass);
									for (let m = 0; m < 10; m++) {
										let studentM = results[m];
										var assignmentGrade = 100 - Math.floor((Math.random() * 40));
										var studentObjWithAssignGrades = {};
										studentObjWithAssignGrades.name = studentM.name;
										studentObjWithAssignGrades.assignmentGrade = assignmentGrade;
										assignmentStudentsGrade.push(studentObjWithAssignGrades);
										assignmentK.addStudent(studentM, {
											grade: assignmentGrade,
										}).then(function(){

										});
									};
								}
								for (let j = 0; j < 10; j++) {
									var studentJ = results[j];
									var studentGrades = [];
									for (var i = 0; i < assignmentStudentsGrade.length; i++) {
										var studentAssignmentPair = assignmentStudentsGrade[i];
										if (studentJ.name === studentAssignmentPair.name){
											studentGrades.push(studentAssignmentPair.assignmentGrade);
										}
									}

									var totalStudentPoints = studentGrades.reduce(function (combine, number) {
										return combine + number;
									}, 0); 
									var totalPoints = 400;
									var percent = totalStudentPoints / totalPoints * 100;
									var grade;
									if (percent < 60) {
										grade = 'F';
									}

									if (percent >= 60 && percent < 70) {
										grade = 'D';
									}

	 								if (percent >= 70 && percent < 80) {
										grade = 'C';
									}

									if (percent >= 80 && percent < 90) {
										grade = 'B';
									}

									if (percent >= 90) {
										grade = 'A';
									}

									// var grades = ['A','B','C','D'];
									// var index = Math.floor(Math.random()*3);
									// var randomGrade = grades[index];
									savedClass.addStudent(studentJ, {
										grade: grade,
										percent: percent,
										points: totalStudentPoints,
									});
								};
							});
					};
					
					let students2 = {};
					if (i === 1) {
						Promise.all(student2Assignment2)
							.then(function (results) {
								//console.log('the results should be a list of students and the length should be 14', results, results.length);

								var assignmentStudentsGrade = [];
								for (let k = 10; k < results.length; k++) {
									var assignmentK = results[k];
									assignmentK.setClass(savedClass);
									for (let m = 0; m < 10; m++) {
										let studentM = results[m];
										var assignmentGrade = 100 - Math.floor((Math.random() * 40));
										var studentObjWithAssignGrades = {};
										studentObjWithAssignGrades.name = studentM.name;
										studentObjWithAssignGrades.assignmentGrade = assignmentGrade;
										assignmentStudentsGrade.push(studentObjWithAssignGrades);
										assignmentK.addStudent(studentM, {
											grade: assignmentGrade,
										}).then(function(){

										});

									};
								};
								for (let j = 0; j < 10; j++) {
									var studentJ = results[j];
									var studentGrades = [];
									for (var i = 0; i < assignmentStudentsGrade.length; i++) {
										var studentAssignmentPair = assignmentStudentsGrade[i];
										if (studentJ.name === studentAssignmentPair.name){
											studentGrades.push(studentAssignmentPair.assignmentGrade);
										}
									}

									var totalStudentPoints = studentGrades.reduce(function (combine, number) {
										return combine + number;
									}, 0); 
									var totalPoints = 400;
									var percent = totalStudentPoints / totalPoints * 100;
									var grade;
									if (percent < 60) {
										grade = 'F';
									}

									if (percent >= 60 && percent < 70) {
										grade = 'D';
									}

	 								if (percent >= 70 && percent < 80) {
										grade = 'C';
									}

									if (percent >= 80 && percent < 90) {
										grade = 'B';
									}

									if (percent >= 90) {
										grade = 'A';
									}

									// var grades = ['A','B','C','D'];
									// var index = Math.floor(Math.random()*3);
									// var randomGrade = grades[index];
									savedClass.addStudent(studentJ, {
										grade: grade,
										percent: percent,
										points: totalStudentPoints,
									});
								};
							});
					};
				});
			};
	        return teacher;
		}
	})
	.catch((err) => {
		console.log('err in creating teacher signup:', err);
	});

	res.send(req.body);
};

teacherController.SIGNIN = (req, res) => {
	console.log('im trying to redirect to dashboard');
	res.send('Authenticated');
};

teacherController.getClassPoints = (req, res) => {
	let totalGrades = [];
	let assignmentCount = 0;
	Assignment.findAll({
		where: { classId: req.query.classId },
		include: { model: Student },
	})
	.then(function (assignments) {
		let classAverage = 0;
		let maxPoints = 0;
		let numAssignments = assignments.length;
			assignments.forEach(function (assignment) {
			  var assignmentTotal = 0;
			  var count = 0;
			  maxPoints += assignment.maxPoints; 
			  assignment.students.forEach(function (student) {
			  	console.log("student.dataValues", student.assignmentStudents);
			  	if(student.assignmentStudents.grade !== null){
			  		assignmentTotal += student.assignmentStudents.grade;
			    	count++;
			  	}
			  });
			  if(assignmentTotal !== 0 && count !== 0){
			  	classAverage += (assignmentTotal / count);
			  }
			} );
			res.send([classAverage.toString(), maxPoints.toString()]);
		});
	};

teacherController.SIGNOUT = (req, res) => {
	console.log(' i should be destroying req session');
	req.session.destroy(function () {
		res.send('i destroyed the user session');
	});
};


teacherController.getStudentGpa = (req, res) => {
	// Class.findAll().then(function(foundClasses){
	// 	foundClasses.forEach(function(Class){
	// 		Class.getStudents().then(function(foundAssociatedStudents){
	// 			foundAssociatedStudents.forEach(function(associatedStudent){
	// 				associatedStudent.update({

	// 				})
	// 			})
	// 		})
	// 	})
	// })


};
teacherController.GETCLASSES = function(req,res) {
	console.log(req.query.teacherEmail, "<----------------- teacher EMAIL")
	Teacher.findOne({where: {email: req.query.teacherEmail}})
	.then(function(teacher){
		var teacherID = teacher.id;
		Class.findAll({
			where: {
				teacherId: teacherID,
			},
			order: [
				['createdAt', 'DESC']
			],
		})
		.then(function(allClasses){
			// allClasses.reverse();
			console.log('---------------', allClasses)
			res.send(allClasses);
		})
		.catch(function(err){
			console.log(err);
	})
	});
};
teacherController.getProfileInformation = (req, res) => {

};

teacherController.UPDATEASSIGNMENTGRADE = (req, res) => {
	var totalPoints;
	Class.findOne({
		where: {
			id: req.body.classId,
		}
	}).then(function(foundClass){
		totalPoints = foundClass.totalPoints;
		foundClass.getStudents({
			order: [
				['createdAt', 'ASC']
			],
		}).then(function(studentsInClass){
			var student = studentsInClass.filter(function(student){
				if (student.id === req.body.studentId){
					return true;
				} else {
					return false;
				}
				// return student.id === req.body.studentId ? true : false;
			})[0];
			// console.log('the student issssss:', student.dataValues);
			// console.log('the student issssss:', student.dataValues.classStudents);
			var previousStudentPointsInClass = student.dataValues.classStudents.points;
			if (previousStudentPointsInClass === null) {
				previousStudentPointsInClass = 0;
			};
			AssignmentStudents.findOne({
				where: {
					studentId: req.body.studentId,
					assignmentId: req.body.assignmentId,
				}
			})
			.then(function(foundInstance){
				var previousAssignmentGrade = foundInstance.dataValues.grade;
				console.log('the previous assignmentGrade is:', previousAssignmentGrade);
				foundInstance.update({
					grade: req.body.grade,
				})
				var newAssignmentGrade = req.body.grade;
				console.log('the new assignment grade is:', newAssignmentGrade);
				var newTotalPoints = Number(previousStudentPointsInClass) - Number(previousAssignmentGrade) + Number(newAssignmentGrade);
				console.log('the old points is:', Number(previousStudentPointsInClass));
				console.log('the new points is:', newTotalPoints);
				var newPercent = newTotalPoints / foundClass.totalPoints * 100;
				console.log('the old percent is:', student.dataValues.classStudents.percent);
				console.log('the new percent is:', newPercent);
				var newGrade = mapPercentToGrade(newPercent);
				console.log('the old grade is:', student.dataValues.classStudents.grade);
				console.log('the new grade is:', newGrade);

				ClassStudents.findOne({
					where:{
						classId: student.classStudents.classId,
						studentId: student.classStudents.studentId,
					}
				})
				.then(function(pair){
					pair.update({
						grade: newGrade,
						percent: newPercent,
						points: newTotalPoints,
					})
				});
			});
		})
	});
	res.send('i made it to class/assignment/student');
};

teacherController.addAssignment = (req, res) => {
	var className = req.body.className;
	Class.findOne({where: {name: req.body.className}})
	.then(function(course){
		//initializing course total to be zero
		if (course.totalPoints === null) {
			var initialPoints = 0;
		}
		var oldTotal = course.totalPoints ? Number(course.totalPoints) : initialPoints;
		var points = Number(req.body.maxPoints)
		course.update({
			totalPoints: oldTotal + points,
		});
		var classId = course.id
		var newAssignment = Assignment.build({
			name: req.body.name,
			classId: classId,
			type: req.body.type,
			dueDate: req.body.date,
			maxPoints: req.body.maxPoints
		});
		newAssignment.save().then(function(response){
			course.getStudents().then(function(foundPairs){
				for (let i = 0; i < foundPairs.length; i++) {
					let foundStudent = foundPairs[i];
					response.addStudent(foundStudent);
				}
				res.send(response)
			});
	})
	}).catch(function(error){
		res.send(error)
	})
};

teacherController.addGrade = (req, res) => {
	var studentId;
	var assignmentId;
	Student.findOne({where: {name: req.body.student}})
	.then(function(student){
		studentId = student.id
	})
	.then(function(){
	Assignment.findOne({where: {name: req.body.assignment}})
	.then(function(assignment){
		assignmentId = assignment.id
		var newGrade = AssignmentStudents.build({
			assignmentId: assignmentId,
			studentId: studentId,
			grade: req.body.grade
		});
		newGrade.save()
		})
		.then(function(success){
			res.send(success);
		})
		.catch(function(error){
			res.send(error)
		});
	})
};

teacherController.getAssignments = (req,res) => {
	// Class.findOne({where: {name: req.query.classId}})
	// .then(function(foundClass){
	// 	classId = foundClass.id
		console.log(req.query.classId, "req.query")
		Assignment.findAll({
			where: {classId: req.query.classId
			},
			order: [
				['createdAt', 'ASC']
			],
		})
		.then(function(response){
			console.log("Assignments here!", response)
			res.send(response)
		});
	// });
}

teacherController.getAllEvents = (req, res) => {
	Teacher.findOne({where: {email: req.query.email}})
	.then(function(teacher){
		console.log("teacher", teacher.id)
		Class.findAll({where:{teacherId: teacher.id}})
		.then(function(classes){
		console.log("classes", classes)
		let finalEvents = [];
		if(classes){
			classes.forEach(function(foundClass){
				console.log("foundClass", foundClass);
				finalEvents.push(Event.findAll({where: {classId: foundClass.id}}))
			});
			Promise.all(finalEvents).then(function(events){
				let flatArray = _.flatten(events)
				console.log('here are the event dataValues ----------------> ', events);
				var mappedDataValues = flatArray.map(function(event){
					return event.dataValues;
				});
				mappedDataValues.forEach(function(object,index,collection){
					object = _.pick(object,['title','start','end'])
					collection[index] = object;
				});
				console.log('mapped data values should contain objects taht have only name,start and end time', mappedDataValues);
				res.send(mappedDataValues);
			});
		}
		else {
			res.send(finalEvents);
		}
	})
	})
};

// teacherController.getAllEvents = (req, res) => {
// 	Teacher.findOne({where: {email: req.query.email}})
// 	.then(function(teacher){
// 		console.log("teacher", teacher.id)
// 		Class.findAll({where:{teacherId: teacher.id}})
// 		.then(function(classes){
// 		console.log("classes", classes)
// 		let finalEvents = [];
// 		if(classes){
// 			classes.forEach(function(foundClass){
// 				console.log("foundClass", foundClass);
// 				finalEvents.push(Event.findAll({where: {classId: foundClass.id}}))
// 			});
// 			Promise.all(finalEvents).then(function(events){
// 				let flatArray = _.flatten(events)
// 				console.log('here are the event dataValues ----------------> ', events);
// 				var mappedDataValues = flatArray.map(function(event){
// 					return event.dataValues;
// 				});
// 				mappedDataValues.forEach(function(object,index,collection){
// 					object = _.pick(object,['title','start','end'])
// 					collection[index] = object;
// 				});
// 				console.log('mapped data values should contain objects taht have only name,start and end time', mappedDataValues);
// 				res.send(mappedDataValues);
// 			});
// 		}
// 		else {
// 			res.send(finalEvents);
// 		}
// 	})
// 	})
// };

teacherController.getClassEvents = (req, res) => {
		Class.findOne({where:{id: req.query.classId}})
		.then(function(classFound){
			if(classFound){
			Event.findAll({where: {classId: classFound.id}})
			.then(function(eventsFound){
				var mappedDataValues = eventsFound.map(function(event){
					return event.dataValues;
				});
				mappedDataValues.forEach(function(object,index,collection){
					object = _.pick(object,['title','start','end'])
					collection[index] = object;
				});
				console.log('mapped data values should contain objects taht have only name,start and end time', mappedDataValues);
				res.send(mappedDataValues);
		});
		}
		else {
			res.send([])
		}
	})
};

teacherController.getClassResources = (req, res) => {
	Resource.findAll({where: {classId: req.query.classId}})
	.then(function(resources){
		console.log('here are the class dataValues ----------------> ');
		res.send(resources);
	}).catch(function(err){
		console.log(err)
	})
};

teacherController.getTeacher = (req, res) => {
	Teacher.findOne({where: {email: req.query.teacherEmail}})
	.then(function(foundTeacher){
		res.send(foundTeacher);
	}).catch(function(err){
		console.log(err)
	})
};

teacherController.GETSTUDENTSFORASSIGNMENT = function(req,res){
	console.log('req.query is:', req.query);
	Assignment.findOne({
		where: {
			name: req.query.assignmentName
		}
	})
	.then(function(assignment){
		var assignmentID = assignment.dataValues.id;
		return AssignmentStudents.findAll({
			where: {
				assignmentId: assignmentID
			},
			order: [
				['createdAt', 'ASC']
			],
		})
	})
	.then(function(assignmentStudentPairs){
		// console.log('the pairs have only the ids?',assignmentStudentPairs);
		var dataObjects = assignmentStudentPairs.map(function(pair){
			return pair.dataValues;
		});
		var PromiseArr = [];
		for (let i = 0; i < dataObjects.length; i++) {
			PromiseArr.push(Student.findOne({
				where: {
					id: dataObjects[i].studentId,
				}
			}));
		}
		Promise.all(PromiseArr)
		.then(function(foundStudents){
			for (let i = 0; i < foundStudents.length; i++) {
				var foundStudent = foundStudents[i];
				var dataObject = dataObjects[i];
				dataObject.name = foundStudent.name;
			}
			res.send(dataObjects);
		})

	})
	//res.send('i made it to assignment/students');
}
module.exports = teacherController;
