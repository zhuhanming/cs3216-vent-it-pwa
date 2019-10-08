import { SIGN_IN, SIGN_OUT, SIGN_IN_FACEBOOK } from './types';
import toh from '../apis/toh';
import { Event } from '../components/Tracking/index';

export const signOut = () => {
    window.location.reload();
    Event('User', 'Logout', '');
    return {
        type: SIGN_OUT
    };
};

export const signInWithFacebook = (response) => async (dispatch) => { // remember that both dispatch and getState are passed to reducer
    dispatch({ type: SIGN_IN_FACEBOOK, payload: response.data });
    Event('User', "Login", "Facebook");
    window.location.reload('/home');
};

export const verifyEmail = (oldToken) => async (dispatch) => {
    try {
        const response = await toh.post('/auth/confirm', {}, {
            headers: {
                Authorization: 'Bearer ' + oldToken //the token is a variable which holds the token
            }
        });
        if (response.data && response.data.success) {
            // dispatch({ type: SIGN_IN, payload: response.data });
            Event("User", "Signup", "Email verification");
        }
    } catch (e) {
        // console.log(e.response);
        return e.response;
    }
}

export const signIn = formValues => async (dispatch) => { // remember that both dispatch and getState are passed to reducer
    try {
        const response = await toh.post('/auth/login', {
            email: formValues.email.toLowerCase(),
            password: formValues.password
        });

        if (response.data.success) {
            dispatch({ type: SIGN_IN, payload: response.data });
            Event("User", "Login", "Email");
            window.location.reload('/home');
        } else {
            return "Error";
        }
    }
    catch (e) {
        console.log(e.response);
        return "Error";
    }
};

export const signUp = formValues => async (dispatch) => { // remember that both dispatch and getState are passed to reducer
    const response = await toh.post('/auth/signup', {
        email: formValues.email.toLowerCase(),
        password: formValues.password,
        full_name: formValues.name,
        username: formValues.username,
    });

    if (response.data.error) {
        if (response.data.error.message === "User already exists.") {
            return "User Already Exists";
        } else {
            return "Error";
        }
    } else if (response.data.success) {
        dispatch({ type: SIGN_IN, payload: response.data });
        Event("User", "Signup", "Account creation");
        window.location.reload('/home');
    } else {
        return "Error";
    }
};