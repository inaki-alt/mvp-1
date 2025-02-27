import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { supabase } from '@/supabaseClient';
import { toast } from 'react-toastify';

const SingleVolunteerModal = ({ onClose, onConfirm }) => {
    const [volunteerName, setVolunteerName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [dummyEventId, setDummyEventId] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [userEvents, setUserEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState('');
    const [useVolunteerPool, setUseVolunteerPool] = useState(true);

    // Get the current user and create/fetch dummy event
    useEffect(() => {
        const getCurrentUserAndEvent = async () => {
            try {
                // Get current user
                const { data: { user }, error: userError } = await supabase.auth.getUser();
                if (userError) throw userError;
                if (user) setCurrentUser(user);
                
                // Fetch all events for this user
                const { data: events, error: eventsError } = await supabase
                    .from('events')
                    .select('id, title')
                    .eq('user_id', user.id);
                
                if (eventsError) throw eventsError;
                setUserEvents(events || []);
                
                // Check if dummy event exists
                const volunteerPoolEvent = events?.find(event => event.title === 'Volunteer Pool');
                
                if (volunteerPoolEvent) {
                    // Use existing dummy event
                    setDummyEventId(volunteerPoolEvent.id);
                } else {
                    // Create a new dummy event
                    const now = new Date();
                    const oneYearLater = new Date(now);
                    oneYearLater.setFullYear(now.getFullYear() + 1);
                    
                    const { data: newEvent, error: createError } = await supabase
                        .from('events')
                        .insert([
                            {
                                title: 'Volunteer Pool',
                                description: 'Default event for volunteer management',
                                start_time: now.toISOString(),
                                end_time: oneYearLater.toISOString(),
                                user_id: user.id,
                                max_volunteers: 1000,
                                location: 'Virtual',
                                location_name: 'Virtual Location',
                                location_address: 'N/A'
                            }
                        ])
                        .select();
                    
                    if (createError) throw createError;
                    if (newEvent && newEvent.length > 0) {
                        setDummyEventId(newEvent[0].id);
                        // Add to userEvents
                        setUserEvents(prev => [...prev, newEvent[0]]);
                    }
                }
            } catch (error) {
                console.error('Error setting up event:', error);
                toast.error('Error initializing. Please try again.');
            }
        };
        
        getCurrentUserAndEvent();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Determine which event to use
            const targetEventId = useVolunteerPool ? dummyEventId : selectedEvent;
            
            if (!targetEventId) {
                throw new Error('No event available for volunteer assignment');
            }

            // Split the name into first and last name
            const nameParts = volunteerName.trim().split(' ');
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';

            // Generate a unique email if not provided
            const uniqueEmail = email || `volunteer_${Date.now()}_${Math.floor(Math.random() * 10000)}@example.com`;

            // Create a new user in the database
            const { data: userData, error: userError } = await supabase
                .from('Users')
                .insert([
                    {
                        first_name: firstName,
                        last_name: lastName,
                        email: uniqueEmail,
                        password_hash: 'temporary_hash', // Required field
                        phone_number: phone || null
                    }
                ])
                .select();

            if (userError) {
                throw userError;
            }

            // Link the user to the selected event
            const { error: linkError } = await supabase
                .from('event_volunteers')
                .insert([
                    {
                        event_id: targetEventId,
                        user_id: userData[0].id,
                        status: 'pending',
                        note: `Address: ${address || 'N/A'}, Zip Code: ${zipCode || 'N/A'}`
                    }
                ]);

            if (linkError) {
                throw linkError;
            }

            // Format the data for the table
            const formattedData = [{
                volunteer_name: volunteerName,
                email: email || uniqueEmail,
                phone: phone || '',
                address: address || '',
                zip_code: zipCode || '',
                date: new Date().toLocaleDateString(),
                status: 'pending',
                user_id: userData[0].id,
                event_id: targetEventId
            }];

            // Call the onConfirm callback with the formatted data
            onConfirm(formattedData);
            
            // Close the modal
            onClose();
            
            toast.success('Volunteer added successfully!');
        } catch (error) {
            console.error('Error adding volunteer:', error);
            toast.error('Failed to add volunteer. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Styles
    const labelStyle = {
        display: 'block',
        marginBottom: '8px',
        fontWeight: '500',
    };
    
    const inputStyle = {
        width: '100%',
        padding: '12px 16px',
        border: '1px solid #222',
        borderRadius: '0',
        fontSize: '16px',
    };
    
    const buttonStyle = {
        padding: '12px 24px',
        border: 'none',
        fontWeight: '600',
        cursor: 'pointer',
    };

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1000,
            }}
        >
            <div
                style={{
                    backgroundColor: 'white',
                    borderRadius: '0',
                    width: '100%',
                    maxWidth: '600px',
                    maxHeight: '90vh',
                    overflow: 'auto',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                }}
            >
                <div 
                    style={{
                        padding: '24px 32px',
                        borderBottom: '1px solid #eee',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        backgroundColor: 'white',
                        color: 'black',
                    }}
                >
                    <h3 style={{ margin: 0, fontWeight: '600', letterSpacing: '1px' }}>NEW VOLUNTEER</h3>
                    <button 
                        type="button" 
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '24px',
                            color: 'black',
                            cursor: 'pointer',
                            padding: '0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                        aria-label="Close"
                    >
                        ×
                    </button>
                </div>
                <div style={{ padding: '32px' }}>
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '24px' }}>
                            <label htmlFor="volunteerName" style={labelStyle}>
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="volunteerName"
                                value={volunteerName}
                                onChange={(e) => setVolunteerName(e.target.value)}
                                style={inputStyle}
                                placeholder="Enter volunteer's full name"
                                required
                            />
                        </div>
                        <div style={{ marginBottom: '24px' }}>
                            <label htmlFor="email" style={labelStyle}>
                                Email (Optional)
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={inputStyle}
                                placeholder="Enter email address"
                            />
                        </div>
                        <div style={{ marginBottom: '24px' }}>
                            <label htmlFor="phone" style={labelStyle}>
                                Phone (Optional)
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                style={inputStyle}
                                placeholder="Enter phone number"
                            />
                        </div>
                        <div style={{ marginBottom: '24px' }}>
                            <label htmlFor="address" style={labelStyle}>
                                Address (Optional)
                            </label>
                            <input
                                type="text"
                                id="address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                style={inputStyle}
                                placeholder="Enter address"
                            />
                        </div>
                        <div style={{ marginBottom: '24px' }}>
                            <label htmlFor="zipCode" style={labelStyle}>
                                Zip Code (Optional)
                            </label>
                            <input
                                type="text"
                                id="zipCode"
                                value={zipCode}
                                onChange={(e) => setZipCode(e.target.value)}
                                style={inputStyle}
                                placeholder="Enter zip code"
                            />
                        </div>
                        
                        <div style={{ marginBottom: '24px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                                <input
                                    type="checkbox"
                                    id="useVolunteerPool"
                                    checked={useVolunteerPool}
                                    onChange={(e) => setUseVolunteerPool(e.target.checked)}
                                    style={{ marginRight: '8px' }}
                                />
                                <label htmlFor="useVolunteerPool" style={{ fontWeight: '500' }}>
                                    Add to Volunteer Pool
                                </label>
                            </div>
                            
                            {!useVolunteerPool && (
                                <div>
                                    <label htmlFor="eventSelect" style={labelStyle}>
                                        Assign to Event
                                    </label>
                                    <select
                                        id="eventSelect"
                                        value={selectedEvent}
                                        onChange={(e) => setSelectedEvent(e.target.value)}
                                        style={inputStyle}
                                        required={!useVolunteerPool}
                                    >
                                        <option value="">-- Select an Event --</option>
                                        {userEvents
                                            .filter(event => event.title !== 'Volunteer Pool')
                                            .map(event => (
                                                <option key={event.id} value={event.id}>
                                                    {event.title}
                                                </option>
                                            ))}
                                    </select>
                                </div>
                            )}
                        </div>
                        
                        <div 
                            style={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                gap: '16px',
                                marginTop: '16px',
                            }}
                        >
                            <button 
                                type="button" 
                                onClick={onClose}
                                style={{
                                    ...buttonStyle,
                                    backgroundColor: 'white',
                                    color: 'black',
                                    border: '1px solid black',
                                }}
                            >
                                CANCEL
                            </button>
                            <button 
                                type="submit" 
                                disabled={isSubmitting || (!useVolunteerPool && !selectedEvent) || (useVolunteerPool && !dummyEventId)}
                                style={{
                                    ...buttonStyle,
                                    backgroundColor: 'black',
                                    color: 'white',
                                    opacity: (isSubmitting || (!useVolunteerPool && !selectedEvent) || (useVolunteerPool && !dummyEventId)) ? 0.7 : 1,
                                }}
                            >
                                {isSubmitting ? 'ADDING...' : 'ADD VOLUNTEER'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

SingleVolunteerModal.propTypes = {
    onClose: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired
};

export default SingleVolunteerModal; 