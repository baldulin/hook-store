import {useCallback, useReducer, useRef} from 'react';
import {reducer} from './reducer';
import {reproxify} from './proxy';


const useProxyState = (initialState) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const ref = useRef(null);
    ref.current = reproxify(ref.current, state, [], dispatch);
    const updateState = useCallback((value) => dispatch({
            type: "update",
            values: value,
            keys: [],
        })
    , [dispatch]);
    return [ref.current, updateState]
};


export default useProxyState;
