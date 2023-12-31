import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getAuth } from 'firebase/auth';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const EventDetail = () => {
  const [eventDetail, setEventDetail] = useState({});
  const [editedEvent, setEditedEvent] = useState({});
  const [initialEventDetail, setInitialEventDetail] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [shareEventEmails, setShareEventEmails] = useState('');
  const [isSharing, setIsSharing] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);  const [userCount,setUserCount] = useState(1);


  const { eventId } = useParams();
  let auth = getAuth();
  const navigate = useNavigate();

  const formatDate = (dateTimeString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    const date = new Date(dateTimeString);
    return date.toLocaleDateString('en-US', options);
  };

  const formatDateForInput = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const pad = (num) => (num < 10 ? `0${num}` : num);

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const fetchEventDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/event/detail/${eventId}`);
      const event = response.data.events[0];
      setEventDetail(event);
      setInitialEventDetail(event);
    } catch (error) {
      console.error('Error fetching event details:', error);
      setErrorMessage('Error fetching event details. Please try again.');
    }
  };

  const fetchEventUserCount = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/event/${eventId}/user-count`);
      setUserCount(response.data.userCount);
    } catch (error) {
      console.error('Error fetching event user count:', error);
    }
  };

  useEffect(() => {
    fetchEventDetails();
    fetchEventUserCount();
  }, [eventId]);

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3000/event/${eventId}`);
      navigate('/all-events');
    } catch (error) {
      console.error('Error deleting event:', error);
      setErrorMessage('Error deleting event. Please try again.');
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();

    console.log(editedEvent)
    if(typeof editedEvent.event_name !== "string" ){
      setErrorMessage('Event name must be a string')
      return;
    }

    if(editedEvent.event_name.trim().length === 0){
      setErrorMessage('Event name must be a non-empty string.')
      return;
    }

    if (!/^[A-Za-z0-9\s]*$/.test(editedEvent.event_name.trim())) {
      setErrorMessage('Event name must be a alphanumeric with spaces.' );
      return;
    }


    if(typeof editedEvent.classification !== "string" ){
      setErrorMessage('Description must be a string')
      return;
    }

    if(editedEvent.classification.trim().length === 0){
      setErrorMessage('Description must be a non-empty string.')
      return;
    }

    if (!/^[A-Za-z0-9\s]*$/.test(editedEvent.classification.trim())) {
      setErrorMessage('Description must be a alphanumeric with spaces.' );
      return;
    }
    const validColors = ["Red", "Yellow", "Blue"];

    if (!validColors.includes(editedEvent.color_code)) {
      setErrorMessage('Color Code must be "Red," "Yellow," or "Blue."');
      return;
    }

    if (new Date(editedEvent.start_datetime) < new Date()) {
      setErrorMessage('Start date cannot be before Current Date & Time');
      return;
    }

    if (new Date(editedEvent.end_datetime) < new Date()) {
      setErrorMessage('End date cannot be before Current Time');
      return;
    }

    if (new Date(editedEvent.end_datetime) < new Date(editedEvent.start_datetime)) {
      setErrorMessage('End date cannot be before start date');
      return;
    }

    try {
      await axios.patch(`http://localhost:3000/event/${eventId}`, editedEvent);
      fetchEventDetails();
      setIsEditing(false);
      setShowModal(false);
      setErrorMessage('');
    } catch (error) {
      console.error('Error editing event:', error);
      setErrorMessage('Error editing event. Please try again.');
    }
  };

  const handleCloseModal = () => {
    console.log('Closing modal...');
    setEventDetail(initialEventDetail);
    setIsEditing(false);
    setErrorMessage('');
    setShowModal(false);
    setShowShareModal(false);
  };

  const handleEditClick = () => {
    const { start_datetime, end_datetime, ...otherDetails } = eventDetail;
    const formattedStartDate = start_datetime ? formatDateForInput(start_datetime) : '';
    const formattedEndDate = end_datetime ? formatDateForInput(end_datetime) : '';

    setEditedEvent({
      ...otherDetails,
      start_datetime: formattedStartDate,
      end_datetime: formattedEndDate,
    });

    setIsEditing(true);
    setShowModal(true);
  };

  const handleShareClick = () => {
    setIsSharing((prevIsSharing) => !prevIsSharing);
    setShowShareModal((prevShowShareModal) => !prevShowShareModal);
  };

  const handleShareEvent = async () => {

    if(shareEventEmails.trim().length == 0){
      setErrorMessage('Please Enter atleast one valid Email Id');
      return;
    }

    // let splitShareEvents = shareEventEmails.split(',').map(email => email.trim())

    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regex to validate email address
    // if (!emailRegex.test(splitShareEvents.trim())) {
    //   setErrorMessage('Please Enter atleast one valid Email Id');
    //   return;
    // }
    // if(email.length > 30 || email.length < 0){
    //   setErrorMessage('Please Enter atleast one valid Email Id');
    //   return;
    // }


    // receivers = eventData.shareEvent.split(',').map(email => email.trim());
    //   console.log(receivers);
    //   for (let receiver_emailId of receivers) {
    //       let receiver = await userCollection.findOne({ email: receiver_emailId });
    //       if (!receiver) {
    //           throw [404, `No user exists with emailId: ${receiver_emailId}`];
    //       }
    //   }  
    try {
      const response = await axios.post('http://localhost:3000/requests/multiple', {
        sender_email: auth.currentUser.email,
        event: eventDetail,
        inviteEmails: shareEventEmails.split(',').map(email => email.trim())
      });

      console.log("Invites sent");
    } catch (error) {
      // console.error('Error sending invites:', error);
      console.log(error)
      setErrorMessage(error.message);
      return;
    }

    console.log('Sharing event with emails:', shareEventEmails);
    setShareEventEmails('');
    setIsSharing((prevIsSharing) => !prevIsSharing);
    setShowShareModal((prevShowShareModal) => !prevShowShareModal); 
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
    <div style={{ width: '80vw' }}>
      {errorMessage && typeof errorMessage === 'string' && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {!isEditing ? (
        <div>
          <h2>{eventDetail.event_name}</h2>
          <p>
          <span style={{ fontWeight: 'bold' }}>Start Date and Time:</span> {formatDate(eventDetail.start_datetime)}
          </p>
          <p>
          <span style={{ fontWeight: 'bold' }}>End Date and Time:</span> {formatDate(eventDetail.end_datetime)}
          </p>
          <p>
          <span style={{ fontWeight: 'bold' }}>Color Code:</span> {eventDetail.color_code}
          </p>
          <p>
          <span style={{ fontWeight: 'bold' }}>Description:</span> {eventDetail.classification}
          </p>
          <p>
          <span style={{ fontWeight: 'bold' }}>People attending:</span> {userCount}
          </p>
          <button onClick={handleEditClick}>Edit Event</button>
          <button onClick={handleDelete}>Delete Event</button>
          <button onClick={handleShareClick}>Share Event</button>
          {isSharing && (
            <div>
              <label>
                Emails (comma-separated):
                <input
                  type="text"
                  value={shareEventEmails}
                  onChange={(e) => setShareEventEmails(e.target.value)}
                />
              </label>
              <button onClick={handleShareEvent}>Share</button>
            </div>
          )}
        </div>
      ) : (
        showModal && (
          <div className={`modal ${showModal ? 'active' : ''}`}>
            <button onClick={handleCloseModal}>Close Modal</button>
            <h2>Edit Event</h2>
            <form onSubmit={handleEdit}>
              <label>
                Event Name:
                <input
                  type="text"
                  value={editedEvent.event_name || ''}
                  onChange={(e) => setEditedEvent({ ...editedEvent, event_name: e.target.value })}
                />
              </label>
              <label>
                Start Date and Time:
                <input
                  type="datetime-local"
                  value={editedEvent.start_datetime || ''}
                  onChange={(e) => setEditedEvent({ ...editedEvent, start_datetime: e.target.value })}
                />
              </label>
              <label>
                End Date and Time:
                <input
                  type="datetime-local"
                  value={editedEvent.end_datetime || ''}
                  onChange={(e) => setEditedEvent({ ...editedEvent, end_datetime: e.target.value })}
                />
              </label>
              {/* <label>
                Color Code:
                <input
                  type="text"
                  value={editedEvent.color_code || ''}
                  onChange={(e) => setEditedEvent({ ...editedEvent, color_code: e.target.value })}
                />
              </label> */}
              <label>
                Color Code:
                <select
                  value={editedEvent.color_code || ''}
                  onChange={(e) => setEditedEvent({ ...editedEvent, color_code: e.target.value })}
                >
                  <option value="Red">Red</option>
                  <option value="Yellow">Yellow</option>
                  <option value="Blue">Blue</option>
                </select>
              </label>
              <label>
                Description:
                <textarea
                  style={{ width: '80vw'}}
                  rows={4}
                  value={editedEvent.classification || ''}
                  onChange={(e) => setEditedEvent({ ...editedEvent, classification: e.target.value })}
                />
              </label>
              <button type="submit">Save Changes</button>
            </form>
          </div>
        )
      )}

      
    </div>
    </div>
  );
};

export default EventDetail;
