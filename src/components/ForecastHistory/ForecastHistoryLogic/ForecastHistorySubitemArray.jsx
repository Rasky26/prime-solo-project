// Import the used components
import DisplayForecastHistorySubitem from "../ForecastHistoryDisplay/DisplayForecastHistorySubitem"


// Component that builds the nested forecast history that
// is contained within the main forecast history container.
// Main purpose of this component it to properly structure
// the `<ul>` item nested within the parent `<li>` item.
export default function ForecastHistorySubitemArray({ forecastHistoryArray }) {


  // Build the DOM elements
  return (
    <ul className="history-subitem-ul">
      {forecastHistoryArray.map(forecastHistoryObj => (
        <DisplayForecastHistorySubitem
          key={forecastHistoryObj.id}
          forecastHistoryObj={forecastHistoryObj}
        />
      ))}
    </ul>
  )
}