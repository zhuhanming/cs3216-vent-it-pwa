import {SIGN_IN, SIGN_OUT, SIGN_IN_FACEBOOK} from '../actions/types'; 

const INITIAL_STATE = {
    isSignedIn: null,
    currentUser: localStorage.getItem('currentUser'),
    name: localStorage.getItem('name'),
    email: localStorage.getItem('email'),
    verified: localStorage.getItem('verified'),
    painPoints: localStorage.getItem('pain_list'),
    // uploadQueue: localStorage.getItem('upload_queue')
    archive: localStorage.getItem('archive'),
};

export default (state=INITIAL_STATE, action) => {
    switch(action.type){
        case SIGN_IN_FACEBOOK:
            localStorage.setItem('currentUser', action.payload.accessToken);
            localStorage.setItem('name', action.payload.user.full_name);
            localStorage.setItem('email', action.payload.user.email);
            localStorage.setItem('verified', true);
            return {...state, isSignedIn: true, currentUser: action.payload.accessToken, name: action.payload.user.full_name, email: action.payload.user.email, verified: true};
        case SIGN_IN:
            localStorage.setItem('currentUser', action.payload.accessToken);
            localStorage.setItem('name', action.payload.user.full_name);
            localStorage.setItem('email', action.payload.user.email);
            localStorage.setItem('verified', action.payload.user.verified);
            return {...state, isSignedIn: true, currentUser: action.payload.accessToken, name: action.payload.user.full_name, email: action.payload.user.email, verified: action.payload.user.verified};
        case SIGN_OUT:
            localStorage.removeItem('currentUser');
            localStorage.removeItem('name');
            localStorage.removeItem('email');
            localStorage.removeItem('verified');
            return  {...state, isSignedIn: false, currentUser: null, name: null, email: null, verified: null, painPoints: null};
        default: 
            if (!state.currentUser) {
                return state;
            } else{
                return {...state, isSignedIn: true};
            }
    }
};