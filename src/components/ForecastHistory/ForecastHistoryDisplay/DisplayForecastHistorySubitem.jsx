// Import utility functions
import setForecastFieldsForDisplay from "../../Utilities/FormatForecastFields"


// Component that displays the forecast history subitems
// for specific locations and `forecast_for_date`.
export default function DisplayForecastHistorySubitem({ forecastHistoryObj }) {

  // Get the forecast information set to strings for display
  const forecastForDisplay = setForecastFieldsForDisplay(forecastHistoryObj)


  // Build the DOM elements
  return (
    <li className="history-subitem-li">
      <div>
        <div className="history-fields-container">
          <div className="history-high-temp">
            {forecastForDisplay.highTemp}
          </div>
          <div className="history-low-temp">
            {forecastForDisplay.lowTemp}
          </div>
          <div className="history-pop">
            {forecastForDisplay.pop}
          </div>
          <div className="history-cloud-cover">
            <img src={forecastForDisplay.cloudCoverImg} />{forecastForDisplay.cloudCover}
          </div>
          <div className="history-wind-speed">
            {forecastForDisplay.windString}
          </div>
          <div className="history-created-on">
            {forecastForDisplay.forecastCreationDateTime}
          </div>
        </div>
      </div>
    </li>
  )
}