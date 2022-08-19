import calendarLogo from './calendar_icon.png';
import './App.css';
import React from 'react';
import {useState, useEffect} from 'react';
import { render } from '@testing-library/react';
import Dialog from "@material-ui/core/Dialog";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Button from "@material-ui/core/Button";

/**
 * @name: Calendar-Module App
 * @brief: Calendar module to display upcoming events based on data from API
 * @author: PPloutarchou
 */
function App() {

  //Inline Styles
  const calendarStyle = {
    color: "black",
    fontWeight: "600",
    fontSize: "20px",
    textAlign: "left",
    margin: "40px"
  };

  const calendarImageStyle = {
    width: 23,
    height: 23
  };

  const calendarDataStyle = {
    color: "black",
    fontWeight: "400",
    fontSize: "14px",
    textAlign: "left",
    cursor: 'pointer',
    listStyleType:'none',
    
  };

  //Constants
  const [open, setOpen] = React.useState(false);
  const [object, setObject] = React.useState({});
  const handleClickToOpen = () => {
    setOpen(true);
  };
  const handleToClose = () => {
    setOpen(false);
  };
  const [calendarEvents, setCalendarEvents] = useState([]);
  const apiUrl = 'https://prod-179.westeurope.logic.azure.com/workflows/7c84997dd6894507a60796acb06e5c43/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=6hFoizfo2w62d0iQK_Zyt7a3Ycr9akAkXdCPAG0ecwQ&usr=50616e6179696f746973';

// Fetch data from API using apiUrl const
const getEvents = async () => {
  fetch(apiUrl, {
    method: 'POST',
    body: JSON.stringify({
      calendarEvents
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  })
  .then((response) => { return response.json()})
  .then((data) => {
    console.log(data);
    setCalendarEvents(data);
  })
  .catch((err) => {
    console.log(err.message);
  });
   
};

useEffect(() => {
  //call getEvents to set 'calendarEvents' from api data
  getEvents();
}, []);

/**
 * 
 * @param {*} dateString 
 * @returns Formatted date to below conditions
 *          - If EventStartDate is less than a week display days remaining
 *          - If EventStartDate is less than a Day display hour remaining
 *          - If EventStartDate is in the past a display proper message of expired event
 */
  const formatDate = (dateString) => {
    const dateFormat = { year: "numeric", month: "numeric", day: "numeric"}

    var dateDifference = new Date(dateString).getTime() - new Date().getTime(); 
    var dateDifferenceDays = Math.floor(dateDifference / (1000 * 60 * 60 * 24));
    var dateDifferenceHours = Math.floor(dateDifference / 1000/60/60);

    if(dateDifferenceDays < 7 && dateDifferenceDays >= 0)
    {
      if(dateDifferenceDays > 1)
        return "in " + dateDifferenceDays + " Days";
      else
        return "in " + dateDifferenceHours + " Hours";
    } 
    /*else if(dateDifferenceDays < 0)
    {
      return "Expired: Date passed";
    }*/

    return (new Date(dateString).toLocaleDateString(undefined, dateFormat))
  };

  return (
    <div className="App">
      <div className="calendar-container">
        <h2 style={calendarStyle}>
        &nbsp;<img style={calendarImageStyle} src={calendarLogo} />
          &nbsp;Upcoming Events
        </h2>
            {Object.values(calendarEvents).map((record, index) => {
              return (
                <div key={index}>
                    <ol style={calendarDataStyle}>
                      {record.map(item => (
                        <li onClick={() => { setObject(item); handleClickToOpen()}}>                    
                          <div className="data-items">
                            <a href="#">{item.Title} - {formatDate(item.EventStartDate)}</a>  
                          </div>
                        </li>
                      ))}
                    </ol>
                </div>
              )
            })}
        <Dialog open={open} onClose={handleToClose}>
            <DialogTitle>{object.Title}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                    <img src={object.BannerUrl} />
                    <div dangerouslySetInnerHTML={{ __html: object.Description}} />
                    <div>Date and Time</div>
                    {formatDate(object.EventStartDate)}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleToClose} 
                    color="primary" autoFocus>
                    Close
                  </Button>
                </DialogActions>
          </Dialog>
      </div>
    </div>
  );
}

export default App;
