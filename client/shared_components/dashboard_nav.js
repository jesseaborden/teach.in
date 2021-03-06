import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { logOut } from '../actions/sign_in_actions.js';
import { browserHistory } from 'react-router';

  class DashboardNav extends React.Component {
  constructor (props) {
    super(props);
    if (_.includes(window.location.href, 'studentDashboard')) {
      this.state = { userType: 'student' };
    } else {
      this.state = { userType: 'teacher' };
    };
    this.handleClick = this.handleClick.bind(this);
  };

  handleClick(){
    sessionStorage.setItem('isAuthenticated', false);
    this.props.logOut(this.state.userType);
  }

  render () {
    return (
      <nav className="navbar navbar-default">
        <div className="row" id="dashboard-nav">
          <Link to="/home" className="nav-logo">Teach.in</Link>
          <section className="teacher-dashboard-nav">
            <Link to="/dashboard" className="btn">DASHBOARD</Link>
            <Link to="/home" className="btn" onClick={this.handleClick}>SIGNOUT</Link>
          </section>
        </div>
      </nav>
    );
  }
}

function mapStateToProps(state){
  return {
    isAuthenticated: state.isAuthenticated.isAuthenticated,
    userType: state.userType.userType,
  };
};

var DashboardNavContainer = connect(mapStateToProps, { logOut: logOut })(DashboardNav);
export default DashboardNavContainer;
