import { createStore , applyMiddleware , compose} from 'redux';
import thunkMiddleware from 'redux-thunk';

const initialState = {
    is_install: false
}

const reducer = ( state = initialState, action) => {
    return state;
};

const store = createStore(reducer, applyMiddleware(thunkMiddleware));

export default { store };

