// Component that builds the individual button that displays
// the history of the specific forecast field to the DOM
export default function DisplayVariableButtonFromPreviousForecast({ pushSpecificValueToInput, dailyForecastElement }) {


  // console.log(dailyForecastElement)


  const sendCurrentValueToInput = (value) => {
    console.log("HEYO")
    // pushSpecificValueToInput()
  }

  // Build the DOM elements
  return (
    <li>
      <button type="button" onClick={sendCurrentValueToInput}>{dailyForecastElement.string}</button>
      <p>{dailyForecastElement.created_on}</p>
    </li>
  )
}