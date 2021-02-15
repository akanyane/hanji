import {data} from './components/data';
import Card from './components/card';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {data.map((data,key) => <Card key={key} hangul={data.hangul} romanization={data.romanization} type={data.type} id={data.id} />)}
      </header>
    </div>
  );
}

export default App;
