import React from 'react'
import {useStore, useRootStoreLoad, useStoreLoad} from 'hook-store'

const App = () => {
    const [store, realDispatch] = useStore();

    return <div>
        Test
    </div>
};

export default App;
