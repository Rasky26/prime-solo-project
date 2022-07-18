// Component that shows the buttons above the forecast
// input forms and selections what location the current
// forecast is being created for
export default function LocationSelection({ locations, currentStationId, onSelectLocation }) {


  // Build the DOM elements. On click, pass the station's
  // ID value back up to be stored in the form
  // container's STATE value
  return (
    <div className="forecast-location-button-container">
      {locations.map(location => (
        
        <div
          key={location.id}
          className="forecast-location-container"
        >
          <button 
            value={location.id}
            className={`forecast-location-button${
              (Number(currentStationId) === location.id) ?
              " active-forecast-location"
              :
              ""
            }`}
            onClick={e => onSelectLocation(e.target.value)
          }>{location.station}</button>
        </div>

      ))}
    </div>
  )
}