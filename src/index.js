import React, {useReducer, useRef} from 'react';
import {reducer} from './reducer';
import {reproxify} from './proxy';


const useProxyState = (initialState) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const ref = useRef(null);
    ref.current = reproxify(ref.current, state, [], dispatch);
    return ref.current
};


export default useProxyState;
