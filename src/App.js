import { useState } from "react";
import { Switch, Route, Link, useParams, useHistory } from "react-router-dom";
import Dropdown from 'react-dropdown';

import './App.css';
import Logo from './scales.svg';
import { generateSlug, decodeSlug, getNameFromSlug } from './slugs.js'
import { monthsOptions } from './constants.js'

export default function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={Logo} alt="Logo" height="128"/>
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

export const useSelectInput = initialValue => {
  const [value, setValue] = useState(initialValue);

  return {
    value,
    setValue,
    reset: () => setValue(""),
    bind: {
      defaultValue: {value},
      onChange: event => {
        console.log(event)
        setValue(event.value);
      }
    }
  };
};

function NameForm() {
  let history = useHistory();
  const { value:name, bind:bindName } = useInput('');
  const { value:birthMonth, bind:bindBirthMonth } = useSelectInput('');
  const { value:city, bind:bindCity } = useInput('');

  const handleSubmit = (evt) => {
    evt.preventDefault();
    history.push("/" + generateSlug(name, birthMonth, city));
  }

  const birthMonthSelectStyles = {
    option: (provided, state) => ({
      ...provided,
      borderBottom: '1px dotted pink',
      color: state.isSelected ? 'red' : 'blue',
      padding: 20,
    }),
    control: () => ({
      // none of react-select's styles are passed to <Control />
      width: 200,
    }),
    singleValue: (provided, state) => {
      const opacity = state.isDisabled ? 0.5 : 1;
      const transition = 'opacity 300ms';
  
      return { ...provided, opacity, transition };
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        First name:
        <input type="text" {...bindName}/>
      </label>
      <br/>
      <label>
        Birth month: 
        <span style={{display:"inline-block",width:"10rem", border:"1px solid rgb(118, 118, 118)", borderRadius:"3px", marginLeft:".5rem"}}>
          <Dropdown options={monthsOptions} {...bindBirthMonth} />
        </span>
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

  const Dub = ({dub, name}) => {
      return (
        <div>
          <p>The verdict is in, {capitalize(name)}! You are</p>
          <h2>The {capitalize(dub)}</h2>
        </div>
      )
    }
  
  return (
      <div className="container">
          <Dub dub={getNameFromSlug(slug)} name={name} />
          <Link to="/" >Generate Another</Link>
      </div>
  )
}

