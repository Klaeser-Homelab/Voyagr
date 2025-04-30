import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '../config/api';
import { useSession } from '../context/SessionContext';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

  async function init(appState) {
    
    // Check if the user is new
    const response = await axios.get('/api/user'); // Example API call
    const isNewUser = response.data.isNewUser;
    console.log('user_id', appState.user_id);
    if (appState.isNewUser) {

      await axios.post(api.endpoints.breaks + '/init', { id: appState.user_id });

      console.log('init appState', appState);

      if (appState.value_name && appState.value_color && appState.habit_name && appState.habit_duration) {
        console.log('here');
        await axios.post(api.endpoints.values + '/init', {
          user_id: appState.user_id,
          name: appState.value_name,
          color: appState.value_color,
          habit_name: appState.habit_name,
          habit_duration: appState.habit_duration,
        });
      }
        
    }


  }

const Init = () => {
  const hasRun = useRef(false); // 🧠 remember if we've run once

  const navigate = useNavigate();
  const { checkInitialSession } = useSession();
  const query = new URLSearchParams(location.search); // Then safely called here
  useEffect(() => {
    const checkSession = async () => {
      if (hasRun.current) return; // 👈 skip if already ran
      hasRun.current = true;
      await checkInitialSession();
      console.log('Full URL:', window.location.href);
      const appState = {
        value_name: query.get('value_name'),
        value_color: query.get('value_color'),
        habit_name: query.get('habit_name'),
        habit_duration: query.get('habit_duration'),
        isNewUser: query.get('isNewUser') === 'true',
        user_id: query.get('user_id'),
      };
      console.log(appState);
      const isValid = Object.values(appState).every((v) => v !== null);
      await init(isValid ? appState : null);
      navigate('/home');
    }
    checkSession();
  }, []);

  return <div className="text-center">Initializing...</div>;
};

export default Init;