import React, {useEffect} from 'react'
import {useStore, useRootStoreLoad, useStoreLoad} from 'hook-store'

const NameChanger = ({obj, k}) => {
    return <input
        type="text"
        onChange={(ev) => obj.$dispatch(k, ev.target.value)}
        value={obj[k]}
        />
};

const App = () => {
    const [store, dispatch] = useStore();

    useEffect(() => {
        dispatch(null, {
            arry: [
                {name: "erster"},
                {name: "zweiter"},
                {name: "dritter"},
                {name: "vierter"}
            ],
            obj1: {
                obj2: {
                    name: "obj2",
                },
                name: "obj1", 
            },
        });
    }, [dispatch]);

    console.log(store);
    if(!store || !store.arry){
        return "Loading";
    }

    return <div>
        <ul>
            {store.arry.map((item, i) => (
                <li key={i}>
                    <NameChanger obj={item} k="name"/>
                </li>
            ))}
        </ul>
    </div>
};

export default App;
