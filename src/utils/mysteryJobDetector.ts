// Smart detection for mystery jobs based on keywords
export const detectServiceFromKeywords = (title?: string, description?: string): { 
  suggestion?: string; 
  annetteMessage?: string; 
} => {
  const text = `${title || ''} ${description || ''}`.toLowerCase();

  // Appliance keywords
  if (text.match(/\b(fridge|refrigerator|freezer|cooling|cold|ice)\b/)) {
    return {
      suggestion: 'Appliance Repair',
      annetteMessage: "Hmm… sounds like a fridge thing. Wanna label it before I get frostbite?"
    };
  }

  if (text.match(/\b(washer|washing machine|dryer|laundry|spin|rinse)\b/)) {
    return {
      suggestion: 'Appliance Repair',
      annetteMessage: "Laundry trouble? Let me guess - it's making weird noises or eating socks again?"
    };
  }

  if (text.match(/\b(dishwasher|dishes|clean|soap|rinse cycle)\b/)) {
    return {
      suggestion: 'Appliance Repair',
      annetteMessage: "Dishwasher drama? I bet it's either not cleaning or flooding your kitchen."
    };
  }

  // Plumbing keywords
  if (text.match(/\b(leak|leaking|drip|water|pipe|plumbing|faucet|toilet|sink)\b/)) {
    return {
      suggestion: 'Plumbing',
      annetteMessage: "Water troubles? Could be plumbing. Unless you're trying to flood the place for fun."
    };
  }

  // Electrical keywords
  if (text.match(/\b(electrical|electric|power|outlet|switch|light|wiring|breaker)\b/)) {
    return {
      suggestion: 'Electrical',
      annetteMessage: "Sparks flying? Sounds electrical. Please don't try to fix it yourself - I need you alive."
    };
  }

  // Cleaning keywords
  if (text.match(/\b(clean|cleaning|dirty|mess|dust|vacuum|mop|scrub)\b/)) {
    return {
      suggestion: 'House Cleaning',
      annetteMessage: "Sounds like cleaning to me. Not judging your housekeeping skills... much."
    };
  }

  // HVAC keywords
  if (text.match(/\b(heating|cooling|hvac|furnace|air conditioning|ac|temperature|hot|cold)\b/)) {
    return {
      suggestion: 'HVAC',
      annetteMessage: "Temperature troubles? HVAC might be your answer. I'm getting climate change vibes."
    };
  }

  // Default for truly mysterious jobs
  return {
    annetteMessage: "No service selected? This one's more mysterious than a 3AM text from your ex."
  };
};