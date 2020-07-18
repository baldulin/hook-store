import {isObject} from './helper';

const handler = {
    get: (obj, prop) => {
        if(prop === "$dispatch"){
            return (value) => obj.$dispatch({
                type: "update",
                keys: obj.$key,
                values: value,
            });
        }
        else if(prop === "$dispatcher"){
            return (value) => (
                () => obj.$dispatch({
                    type: "update",
                    keys: obj.$key,
                    values: value,
                })
            );
        }
        else if(prop === "$delete"){
            return () => obj.$dispatch({
                type: "delete",
                keys: obj.$key,
            });
        }
        return obj[prop];
    },
    set: (obj, prop, value) => {
        obj.$dispatch(
            {
                type: "update",
                keys: obj.$key,
                values: {[prop]: value},
            }
        );
        return true;
    },
};

export const proxify = (data, keys, dispatch) => {
    if(Array.isArray(data)){
        let newData = data.map(
            (item, i) => (
                proxify(item, [...keys, i], dispatch)
            )
        );
        newData.$ident = data;
        newData.$key = keys.slice();
        newData.$dispatch = dispatch;

        return new Proxy(newData, handler);
    }
    else if(isObject(data)){
        let newData = {
            ...Object.keys(data).reduce(
                (a, i) => (
                    {...a, [i]: proxify(data[i], [...keys, i], dispatch)}
                )
            , {}),
            $ident: data,
            $key: keys.slice(),
            $dispatch: dispatch,
        };

        return new Proxy(newData, handler);
    }
    else{
        return data;
    }
};

export const reproxify = (proxies, data, keys, dispatch) => {
    if(Array.isArray(data) && Array.isArray(proxies) && data.length === proxies.length){
        if(data.some((item, i) => (proxies[i] && proxies[i].$ident !== item))){
            let newData = data.map(
                (item, i) => (
                    (proxies[i] && proxies[i].$ident && proxies[i].$ident === item)
                        ? proxies[i]
                        : reproxify(proxies[i], item, [...keys, i], dispatch)
                )
            );

            newData.$ident = data;
            newData.$key = keys.slice();
            newData.$dispatch = dispatch;

            return new Proxy(newData, handler);
        }
        else{
            return proxies;
        }
    }
    else if(isObject(data) && isObject(proxies)){
        if(Object.keys(data).some((i) => proxies[i].$ident !== data[i])){
            const newData = {
                ...Object.keys(data).reduce((a, i) => (
                    {
                        ...a,
                        [i]: (proxies[i] && proxies[i].$ident && proxies[i].$ident === data[i])
                            ? proxies[i]
                            : reproxify(proxies[i], data[i], [...keys, i], dispatch)
                    }
                ), {}),
                $ident: data,
                $key: keys.slice(),
                $dispatch: dispatch,
            };

            return new Proxy(newData, handler);
        }
        else{
            return proxies;
        }
    }
    else{
        return proxify(data, keys, dispatch);
    }
};

