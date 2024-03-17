function countEmptyStringFields(obj) {
  let count = 0;

  for (let key in obj) {
    // eslint-disable-next-line no-prototype-builtins
    if (obj.hasOwnProperty(key)) {
      if (typeof obj[key] === "string" || typeof obj[key] === "boolean") {
        count++;
      } else if (typeof obj[key] === "object") {
        count += countEmptyStringFields(obj[key]); // Recursively count empty string fields within nested objects
      }
    }
  }

  return count;
}
function countEmptyProductValues(obj) {
  let count = 0;

  for (let key in obj) {
    // eslint-disable-next-line no-prototype-builtins
    console.log(key);
    if (obj.hasOwnProperty(key)) {
      if (key === "value" && (typeof obj[key] === "string" || typeof obj[key] === "boolean")) {
        count++;
      } else if (typeof obj[key] === "object") {
        console.log(key);
        count += countEmptyStringFields(obj[key]); // Recursively count empty string fields within nested objects
      }
    }
  }

  return count;
}

function countValueOccurrences(obj) {
  let count = 0;

  function explore(obj) {
      if (obj !== null && typeof obj === 'object') {
          Object.keys(obj).forEach(key => {
              if (key === 'value') {
                  count++;
              } else {
                  explore(obj[key]);
              }
          });
      }
  }

  explore(obj);
  return count;
}


const revertFormatProductName = (name) => {
  if (!name) {
    return null;
  }

  switch (name) {
    case "Rice(50kg)":
      return "Rice_50-kg";
    case "Rice(1cup)":
      return "Rice_1-cup";
    case "Beans(1cup)":
      return "Beans_1-cup";
    case "Beans(50kg)":
      return "Beans_50-kg";
    case "Garri(1cup)":
      return "Garri_1-cup";
    case "Garri(50kg)":
      return "Garri_50-kg";
    case "Tomatoes(4seeds)":
      return "Tomatoes_4-seeds";
    case "Tomatoes(bigbasket)":
      return "Tomatoes_big-basket";
    case "Cooking Gas(12kg)":
      return "Cooking Gas_12-kg";
    case "Kerosene(1Litre)":
      return "Kerosene_1-Litre";
    case "Cement(50kg)":
      return "Cement_50kg";
    case "Diesel/AGO(1Litre)":
      return "Diesel/AGO_1-Litre";
    case "Petrol/PMS(1Litre)":
      return "Petrol/PMS_1-Litre";

    default:
      return name;
  }
};

function countValidFields(obj) {
  let count = 0;

  for (let key in obj) {
    // eslint-disable-next-line no-prototype-builtins
    if (obj.hasOwnProperty(key)) {
      if (
        (typeof obj[key] === "string" && obj[key].length > 0) ||
        typeof obj[key] === "boolean"
      ) {
        count++;
      } else if (typeof obj[key] === "object") {
        count += countValidFields(obj[key]); // Recursively count fields within nested objects
      }
    }
  }

  return count;
}
function countValidValueKeys(obj) {
  let count = 0;

  function explore(obj) {
      if (obj !== null && typeof obj === 'object') {
          Object.keys(obj).forEach(key => {
              if (key === 'value' && (typeof obj[key] === 'string' && obj[key].length > 0 || typeof obj[key] === 'boolean')) {
                  count++;
              } else {
                  explore(obj[key]);
              }
          });
      }
  }

  explore(obj);
  return count;
}

function deepCopy(obj) {
  // Check if obj is an object
  if (typeof obj !== 'object' || obj === null) {
      return obj; // Return primitive values directly
  }

  // Create a new object or array to store the copied values
  const copiedObj = Array.isArray(obj) ? [] : {};

  // Iterate over each key in the original object
  for (let key in obj) {
      // Recursively copy each property of the object
      copiedObj[key] = deepCopy(obj[key]);
  }

  return copiedObj;
}

function deepCompare(obj1, obj2, propertyToIgnore) {
  // Check if both parameters are objects
  if (typeof obj1 !== 'object' || typeof obj2 !== 'object' || obj1 === null || obj2 === null) {
      return obj1 === obj2; // Compare primitive values directly
  }

  // Get keys from both objects
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  // Check if number of keys match
  if (keys1.length !== keys2.length) {
      return false;
  }

  // Iterate over keys and compare values recursively
  for (let key of keys1) {
      // If the key is the property to ignore, skip this iteration
      if (key === propertyToIgnore) {
          continue;
      }

      // If the key doesn't exist in obj2 or values don't match, return false
      if (!obj2.hasOwnProperty(key) || !deepCompare(obj1[key], obj2[key], propertyToIgnore)) {
          return false;
      }
  }

  // If all keys and values match, return true
  return true;
}

export { countEmptyStringFields, countValidFields, revertFormatProductName, countEmptyProductValues, countValueOccurrences, countValidValueKeys, deepCopy, deepCompare };
