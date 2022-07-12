// Import the core libraries and functions
import { format } from "date-fns"
import { useSelector } from "react-redux"

// Import the used components
import NestedForecastHistory from "./NestedForecastHistory"

// Import utility functions
import buildWindSpeedString from "../Utilities/CreateWindSpeedString"
import setForecastFieldsForDisplay from "../Utilities/FormatForecastFields"


// Component that displays the forecast history for the
// various dates.
//
// Takes in the current `forecastHistoryObj` that will be
// rendered to the DOM.
// If an array of forecast history objects is passed in via
// the `additionalForecastHistoryArray` param, that will
// be processed within the containing `<li>` element that
// will keep all the dates together.
export default function DisplayForecastHistory({ forecastHistoryObj, additionalForecastHistoryArray }) {

  // Get the forecast information set to strings for display
  const forecastForDisplay = setForecastFieldsForDisplay(forecastHistoryObj)

  // Determine the CSS class names based on the existance
  // of `additionalForecastHistoryArray`
  const cssListLabel = (additionalForecastHistoryArray.length > 0) ? "main-forecast-line" : "past-forecast-line"
  const cssDivLabel = (additionalForecastHistoryArray.length > 0) ? "forecast-history-line" : "forecast-history-line sub-history-line"


  // Build the DOM elements
  return (
    <li className={cssListLabel}>
      <div className={cssDivLabel}>
        {additionalForecastHistoryArray.length > 0 ?
          <div>
            {forecastForDisplay.forecastForDate}
          </div>
          :
          null
        }
        <div>
          {forecastForDisplay.highTemp}
        </div>
        <div>
          {forecastForDisplay.lowTemp}
        </div>
        <div>
          {forecastForDisplay.pop}
        </div>
        <div>
          {forecastForDisplay.cloudCover}
        </div>
        <div>
          {forecastForDisplay.windString}
        </div>
        <div>
          {forecastForDisplay.forecastCreationDate}
        </div>
        {(additionalForecastHistoryArray) ?
          <NestedForecastHistory
            forecastHistoryArray={additionalForecastHistoryArray}
          />
          :
          null
        }
      </div>
    </li>
  )
}