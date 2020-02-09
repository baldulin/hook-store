import {useCallback, useEffect, useReducer, useState} from 'react';
import Axios from 'axios';

const turnLazy = (dispatch, baseKey, data) => {
    let currentData = data;

    if(!data || typeof data !== "object"){
        return data;
    }

    // this is wrong iterate object if data is object
    for(let key of Object.keys(data)){
        currentData[key] = turnLazy(dispatch, baseKey.concat([key]), currentData[key]);
    }

    if(Array.isArray(data)){
        return data;
    }
    return {...data, $dispatch: (key, data) => dispatch({dispatch, baseKey, key, data})};
};

const lazyReducer = (state, action) => {
    const {data, dispatch} = action;
    let {baseKey, key} = action;

    // Maybe key can be None so the last key is used?
    let currentState = state;
    console.log("STATE UPDATE", state, action);

    if(!key){
        if(baseKey && baseKey.length){
            key = Array.lastIndexOf(baseKey);
            baseKey = baseKey.slice(0, -1);
        }
    }
    if(baseKey){
        for(let k of baseKey){
            if(Array.isArray(currentState[k])){
                currentState = [...currentState[k]];
            }
            else{
                currentState = {...currentState[k]};
            }
            currentState = currentState[k];
        }
    }
    else{
        baseKey = [];
    }

    if(key){
        const turnedLazy = turnLazy(dispatch, baseKey.concat([key]), data);
        currentState[key] = turnedLazy;
    }
    else{
        return turnLazy(dispatch, [], data);
    }

    return {...state};
};

export const useStore = (initialState) => {
    const [state, dispatch] = useReducer(lazyReducer, initialState ? initialState : {});
    const $dispatch = useCallback(
        (key, data) => dispatch({dispatch, baseKey: undefined, key, data}), [dispatch]
    );
    return [{...state, $dispatch}, $dispatch];
};

export const useStoreLoad = (state, key, url, params, defaultValue) => {
    const oldObject = key ? state[key] : state;
    const [error, setError] = useState();
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        if(!oldObject && defaultValue){
            state.$dispatch(key, defaultValue);
        }
    }, [defaultValue]);

    useEffect(() => {
        setLoading(true);
        let cancler;

        Axios(url, {...params, cancelToken: new Axios.CancelToken((c) => {cancler=c})})
        .then((response) => {
            if(!response.data.error){
                state.$dispatch(key, response.data);
                setLoading(false);
                setError(null);
            }
            else{
                state.$dispatch(undefined, key, null);
                setLoading(false);
                // TODO this is not an axios error result
                setError(response);
            }
        })
        .catch((error) => {
            setLoading(false);
            setError(error);
        });

        return () => {
            cancler(); 
        };
    }, []);

    return [oldObject, oldObject ? oldObject.$dispatch : oldObject, loading, error];
};

export const useRootStoreLoad = (url, params, defaultValue) => {
    const [store, realDispatch] = useStore(defaultValue);
    const [, dispatch, loading, error] = useStoreLoad(store, null, url, params);
    return [store, dispatch, loading, error];
};
