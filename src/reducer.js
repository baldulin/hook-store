import {copy, isObject} from './helper';


const recursiveUpdate = (state, keys, values) => {
    if(keys.length > 0){
        const key = keys[0];
        let newState = copy(state);
        newState[key] = recursiveUpdate(newState[key], keys.slice(1), values);
        return newState;
    }
    else if(isObject(state)){
        if(typeof values === "function"){
            return values(state);
        }
        return Object.assign({}, state, values);
    }
    else{
        if(typeof values === "function"){
            return values(state);
        }
        return values;
    }
};


const recursiveDelete = (state, keys) => {
    if(keys.length > 0){
        const key = keys[0];
        let newState = copy(state);

        if(keys.length === 1){
            if(Array.isArray(newState)){
                newState.splice(key, 1);
            }
            else{
                delete newState[key];
            }
        }
        else{
            newState[key] = recursiveDelete(newState[key], keys.slice(1));
        }
        return newState;
    }
};


export const reducer = (state, action) => {
    switch(action.type){
        case "update":
            return recursiveUpdate(state, action.keys, action.values);
        case "delete":
            return recursiveDelete(state, action.keys);
    }
    return state;
};
