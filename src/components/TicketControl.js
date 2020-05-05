import React from 'react';
import NewTicketForm from './NewTicketForm';
import TicketList from './TicketList';
import TicketDetail from './TicketDetail';
import EditTicketForm from './EditTicketForm';
import { connect } from 'react-redux';
import PropTypes from "prop-types";
import * as a from './../actions';
import { withFirestore, isLoaded } from 'react-redux-firebase';
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";

class TicketControl extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedTicket: null,
      editing: false
    };
  }

  componentDidMount() {
    this.waitTimeUpdateTimer = setInterval(() =>
      this.updateTicketElapsedWaitTime(),
    60000
    );
  }

  componentWillUnmount(){
    clearInterval(this.waitTimeUpdateTimer);
  }

  updateTicketElapsedWaitTime = () => {
    const { dispatch } = this.props;
    Object.values(this.props.masterTicketList).forEach(ticket => {
      const newFormattedWaitTime = ticket.timeOpen.fromNow(true);
      const action = a.updateTime(ticket.id, newFormattedWaitTime);
      dispatch(action);
    });
  }

  handleClick = () => {
    if (this.state.selectedTicket != null) {
      this.setState({
        selectedTicket: null,
        editing: false
      });
    } else {
      const { dispatch } = this.props;
      const action = a.toggleForm();
      dispatch(action);
    }
  }

  handleAddingNewTicketToList = () => {
    const { dispatch } = this.props;
    const action = a.toggleForm();
    dispatch(action);
  }

  // handleChangingSelectedTicket = (id) => {
  //   const selectedTicket = this.props.masterTicketList[id];
  //   this.setState({selectedTicket: selectedTicket});
  // }

  handleChangingSelectedTicket = (id) => {
    this.props.firestore.get({collection: 'tickets', doc: id}).then((ticket) => {
      const firestoreTicket = {
        names: ticket.get("names"),
        location: ticket.get("location"),
        issue: ticket.get("issue"),
        id: ticket.id
      }
      this.setState({selectedTicket: firestoreTicket });
    });
  }

  handleEditClick = () => {
    this.setState({editing: true});
  }

  // handleEditingTicketInList = (ticketToEdit) => {
  //   const { dispatch } = this.props;
  //   const action = a.addTicket(ticketToEdit);
  //   dispatch(action);
  //   this.setState({
  //     editing: false,
  //     selectedTicket: null
  //   });
  // }

  handleEditingTicketInList = () => {
    this.setState({
      editing: false,
      selectedTicket: null
    });
  }

  // handleDeletingTicket = (id) => {
  //   const { dispatch } = this.props;
  //   const action = a.deleteTicket(id);
  //   dispatch(action);
  //   this.setState({selectedTicket: null});
  // }

  handleDeletingTicket = (id) => {
    this.props.firestore.delete({collection: 'tickets', doc: id});
    this.setState({selectedTicket: null});
  }

  render(){
    const auth = this.props.firebase.auth();
    if (!isLoaded(auth)) {
      return (
        <>
          <h1>Loading...</h1>
        </>  
      )
    }
    if ((isLoaded(auth)) && (auth.currentUser == null)) {
      return (
        <React.Fragment>
          <h1>You must be signed in to access the queue.</h1>
        </React.Fragment>
      )
    } 
    if ((isLoaded(auth)) && (auth.currentUser != null)) {
      // All of the code previously in our render() method should go in this conditional.
      let currentlyVisibleState = null;
      let buttonText = null;
      if (this.state.editing ) {      
        currentlyVisibleState = 
        <EditTicketForm 
          ticket = {this.state.selectedTicket} 
          onEditTicket = {this.handleEditingTicketInList} />
        buttonText = "Return to Ticket List";
      } else if (this.state.selectedTicket != null) {
        currentlyVisibleState = 
        <TicketDetail 
          ticket = {this.state.selectedTicket} 
          onClickingDelete = {this.handleDeletingTicket} 
          onClickingEdit = {this.handleEditClick} />
        buttonText = "Return to Ticket List";
      } else if (this.props.formVisibleOnPage) {
        currentlyVisibleState = 
        <NewTicketForm 
          onNewTicketCreation = {this.handleAddingNewTicketToList}  />;
        buttonText = "Return to Ticket List";
      } else {
        currentlyVisibleState = 
        <TicketList 
          onTicketSelection = {this.handleChangingSelectedTicket} />;
        buttonText = "Add Ticket";
      }
      return (
        <React.Fragment>
          <p>Welcome!</p>
          {currentlyVisibleState}
          <button onClick={this.handleClick}>{buttonText}</button>
        </React.Fragment>
      );
    }
  }  
}

TicketControl.propTypes = {
  masterTicketList: PropTypes.object
};

const mapStateToProps = state => {
  return {
    masterTicketList: state.masterTicketList,
    formVisibleOnPage: state.formVisibleOnPage
  }
}

TicketControl = connect(mapStateToProps)(TicketControl);

export default withFirestore(TicketControl);