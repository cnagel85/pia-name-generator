import { adjectives, nouns } from './constants.js'
var seedrandom = require('seedrandom');

export const generateSlug = (...args) => {
    let s = args.map(function(arg, i) {
      console.log("arg "+i+": ", arg)
      return arg.toString().toLowerCase();
    }).join('&')
    return btoa(s);
  }

function toIntInRange(r, min, max) {
    console.log("rng: ", r);
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(r * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

export const getNameFromSlug = (slug) => {
    let f = getFamousName(slug)
    if (f !== undefined) {
      return f
    }
  
    let rng = seedrandom(slug);
    let adj = adjectives[toIntInRange(rng(), 1, adjectives.length)]
    let noun = nouns[toIntInRange(rng(), 1, nouns.length)]
    return adj + " " + noun
  }
  
  export const decodeSlug = (slug) => {
    return atob(slug).split("&");
  }


const famous = () => {
    let f = {}

    // LegalEagle Youtuber
    f[generateSlug("Devin", 12, "Washington D.C.")] = "Legal Eagle" 
    // Frank Azar
    f[generateSlug("Frank", 4, "Denver")] = "Strong Arm" 

    return f
}

const getFamousName = (slug) => {
    return famous()[slug]
}
