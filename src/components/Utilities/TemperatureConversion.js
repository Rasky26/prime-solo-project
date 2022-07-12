// Function that converts temperature from Kelvin
// to degree Celsius.
function kelvinToCelsius(inputTemperature) {

  // °Celsius = Kelvin - 273.15
  return inputTemperature - 273.15
}

// Function that converts temperature from Kelvin
// to degrees Fahrenheit, returning that value
function kelvinToFahrenheit(inputTemperature) {

  // Convert the temperature from Kelvin to °Celsius
  const celsiusTemp = kelvinToCelsius(inputTemperature)

  // °Fahrenheit = ((9 / 5) * °Celsius) + 32
  return (1.8 * celsiusTemp) + 32
}


export { kelvinToCelsius, kelvinToFahrenheit }