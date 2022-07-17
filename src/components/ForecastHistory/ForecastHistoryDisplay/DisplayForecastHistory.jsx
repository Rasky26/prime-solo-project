// Import the core libraries and function
import { useState } from "react"

// Import the used components
import ForecastHistorySubitemArray from "../ForecastHistoryLogic/ForecastHistorySubitemArray"

// Import utility functions
import setForecastFieldsForDisplay from "../../Utilities/FormatForecastFields"

// Component that displays the forecast history for the
// latest forecast for a specific location and `forecast_for_date`
//
// Passes along the other forecast history array if objects
// exist within it
export default function DisplayForecastHistory({ forecastHistoryObj, additionalForecastHistoryArray }) {

  // Initialize the state value for the `<li>` dropdown
  const [hideHistoryItems, setHideHistoryItems] = useState(true)
  const [positionDropDownIconDownward, setPositionDropDownIconDownward] = useState(true)

  // Get the forecast information set to strings for display
  const forecastForDisplay = setForecastFieldsForDisplay(forecastHistoryObj)

  // Listener function to either show or hide a `forecast_for_date`
  // history list
  const toggleHideHistoryItems = () => {
    setHideHistoryItems(!hideHistoryItems)
    setPositionDropDownIconDownward(!positionDropDownIconDownward)
  }


  // Build the DOM elements
  return (
    <>
      {(additionalForecastHistoryArray.length > 0) ?
        <div className="history-forecast-dropdown-container">
          <button
            type="button"
            className={
              positionDropDownIconDownward ?
              "history-forecast-dropdown history-forecast-dropdown-rotated"
              :
              "history-forecast-dropdown"
            }
            onClick={toggleHideHistoryItems}
          >
            ^
          </button>
        </div>
        :
        null
      }
      <li className="history-main-li">
        <div>

          <div className="history-forecast-date-main">
            {forecastForDisplay.forecastForDate}
          </div>

          <div className="history-fields-container">
            <div className="history-high-temp-main">
              {forecastForDisplay.highTemp}
            </div>
            <div className="history-low-temp-main">
              {forecastForDisplay.lowTemp}
            </div>
            <div className="history-pop-main">
              {forecastForDisplay.pop ?
                forecastForDisplay.pop
                :
                "---"
              }
            </div>
            <div className="history-cloud-cover-main">
              <img src={forecastForDisplay.cloudCoverImg} /> {forecastForDisplay.cloudCover}
            </div>
            <div className="history-wind-speed-main">
              {forecastForDisplay.windString}
            </div>
            <div className="history-created-on-main-date">
              {forecastForDisplay.forecastCreationDateTime}
            </div>
          </div>
          {(additionalForecastHistoryArray.length > 0) ?
            // If forecast objects exist, then call this component
            <div className={hideHistoryItems ? "hide" : ""}>
              <ForecastHistorySubitemArray
                forecastHistoryArray={additionalForecastHistoryArray}
              />
            </div>
            :
            null
          }
        </div>
      </li>
    </>
  )
}