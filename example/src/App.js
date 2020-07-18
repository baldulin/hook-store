import React, {useState} from 'react';
import useProxyState from 'hook-store';

const ObjectExample = () => {
    const state = useProxyState({
        title: "Title",
        content: "Content text",
        subObject: {
            title: "Haha Subtitle",
            content: "Haha Subcontent",
        },
    });

    return <article>
        <h1>{state.title}</h1>
        <p>{state.content}</p>
        {state.subObject && 
            <article>
                <h2>{state.subObject.title}</h2>
                <p>{state.subObject.content}</p>
            </article>
        }
        <article>
            <input type="text" value={state.title} onChange={(ev) => state.title = ev.target.value}/>
            <input type="text" value={state.content} onChange={(ev) => state.content = ev.target.value}/>
            <input type="text" value={state.subObject.title} onChange={(ev) => state.subObject.title = ev.target.value}/>
            <input type="text" value={state.subObject.content} onChange={(ev) => state.subObject.content = ev.target.value}/>
        </article>
    </article>
};

const ListExample = () => {
    const state = useProxyState([]);
    const [selected, setSelected] = useState(null);

    return <article style={{border: "1px solid black"}}>
        <table>
            <thead>
                <tr>
                    <th>a</th>
                    <th>b</th>
                </tr>
            </thead>
            <tbody>
                {state.map((item, i) => (
                    <tr key={i}>
                        <td>{item.a}</td>
                        <td>{item.b}</td>
                    </tr>
                ))}
            </tbody>
        </table>
        {state.map((item, i) => (
            <div key={i}>
                {selected !== i
                    ? <button onClick={() => {
                            if(selected === null){
                                setSelected(i)
                            }
                            else{
                                setSelected(null);
                                state.$dispatch((oldState) => {
                                    const a = oldState[i];
                                    const b = oldState[selected];
                                    const newState = [...oldState];
                                    newState[i] = b;
                                    newState[selected] = a;
                                    return newState;
                                });
                            }
                        }}>
                        Select to Switch
                    </button>
                    : <span>Select another element</span>
                }
                <input type="text" value={item.a} onChange={(ev) => item.a = ev.target.value}/>
                <input type="text" value={item.b} onChange={(ev) => item.b = ev.target.value}/>
                <button onClick={item.$delete}>
                    Delete
                </button>
            </div>
        ))}
        <button onClick={state.$dispatcher((oldState) => [...oldState, {a: "a", b: "b"}])}>
            Add
        </button>
    </article>
};

const App = () => (
    <div>
        <ObjectExample/>
        <ListExample/>
    </div>
);
export default App;
