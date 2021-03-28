import { useState } from "react";
import { Switch, Route, Link, useParams, useHistory } from "react-router-dom";

import './App.css';
import { adjectives, nouns, famous } from './constants.js'
var seedrandom = require('seedrandom');

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

export const hexEncode = (s) => {
  let res = "";
  for (let i=0; i<s.length; i++) {
      res += s.charCodeAt(i).toString(16);
  }
  return res
}

export const hexDecode = (s) => {
  var res = "";
  for(let i = 0; i<s.length; i++) {
      res += String.fromCharCode(parseInt(s[i], 16));
  }
  return res;
}

export const generateSlug = (...args) => {
  let s = args.map(function(arg, i) {
    console.log("arg "+i+": ", arg)
    return arg.toString().toLowerCase();
  }).join(' ')
  return btoa(s);
  return hexEncode(s).toString();
}

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

function toIntInRange(r, min, max) {
  console.log("rng: ", r);
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(r * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

const getNameFromSlug = (slug) => {
  if (famous[slug] !== undefined) {
    return famous[slug]
  }

  let rng = seedrandom(slug);
  let adj = adjectives[toIntInRange(rng(), 1, adjectives.length)]
  let noun = nouns[toIntInRange(rng(), 1, nouns.length)]
  return adj + " " + noun
}

const decodeSlug = (slug) => {
  return atob(slug);
  return hexDecode(slug)
}

export function Name() {
  const {slug} = useParams()

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
          <p>{decodeSlug(slug)}</p>
      </div>
  )
}

