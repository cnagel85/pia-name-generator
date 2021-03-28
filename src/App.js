import { useState } from "react";
import { Switch, Route, Link, useParams, useHistory } from "react-router-dom";

import './App.css';
import { generateSlug, decodeSlug, getNameFromSlug } from './slugs.js'

export default function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Personal Injury Attorney Generator</h1>
      </header>
      <Switch>
        <Route exact path="/" component={Create} />
        <Route path="/:slug" component={Name} />
      </Switch>
    </div>
  );
}

export const useInput = initialValue => {
  const [value, setValue] = useState(initialValue);

  return {
    value,
    setValue,
    reset: () => setValue(""),
    bind: {
      value,
      onChange: event => {
        setValue(event.target.value);
      }
    }
  };
};


function NameForm() {
  let history = useHistory();
  const { value:name, bind:bindName } = useInput('');
  const { value:birthMonth, bind:bindBirthMonth } = useInput('');
  const { value:city, bind:bindCity } = useInput('');

  const handleSubmit = (evt) => {
    evt.preventDefault();
    history.push("/" + generateSlug(name, birthMonth, city));
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        First name:
        <input type="text" {...bindName}/>
      </label>
      <br/>
      <label>
        Birth month: <input type="number" min="1" max="12" {...bindBirthMonth}/>
      </label>
      <br/>
      <label>
        City:
        <input type="text" {...bindCity}/>
      </label>
      <br/>
      <input type="submit" value="Submit" />
    </form>
  );
}

export function Create() {
  return (
      <div className="container">
          <h2>Every Personal Injury Attorney needs a memorable name!</h2>
          <p>Let's get started. First we will need some info.</p>
          <NameForm />
      </div>
  )
}

export const mapArgs = (args) => {
  let res = {
    "name": args[0],
    "birthMonth": args[1],
    "city": args[2],
  }
  return res
}

export function Name() {
  const { slug } = useParams()
  const { name, birthMonth, city } = mapArgs(decodeSlug(slug))

  const capitalize = (s) => {
      return s.split(' ').map(function(w) {
          return w[0].toUpperCase() + w.substr(1);
      }).join(' ')
  }

  const Dub = ({name}) => {
      return (
        <h2>I dub thee 'The {capitalize(name)}'</h2>
      )
    }
  
  return (
      <div className="container">
          <Dub name={getNameFromSlug(slug)} />
          <Link to="/" >Generate Another</Link>
      </div>
  )
}

