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
    <li className="past-daily-forecast-list-item">
      <button type="button" onClick={sendCurrentValueToInput}>{dailyForecastElement.string ? dailyForecastElement.string : "0%"}</button>
      <p><span>Made on</span>: {dailyForecastElement.created_on}</p>
    </li>
  )
}