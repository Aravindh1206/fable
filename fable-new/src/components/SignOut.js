import React from 'react';
import {doSignOut} from '../firebase/FirebaseFunctions';

const SignOutButton = () => {
  return (
    <button type='button' onClick={doSignOut} class="button">
      Sign Out
    </button>
  );
};

export default SignOutButton;