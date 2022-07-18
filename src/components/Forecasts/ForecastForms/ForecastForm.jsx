// Import the core libraries and components
import * as Yup from "yup"
import { format } from "date-fns"
import { Form, Formik, useFormikContext } from "formik"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"

// Import the used components
import { InputField, Selection } from "../../FormikUtils/Components"
import DisplayFullPreviousForecasts from "../PreviousForecasts/DisplayFullPreviousForecasts"
import DisplayVariableFromPreviousForecast from "../PreviousForecasts/DisplayVariableFromPreviousForecast"

// Import utility functions
import buildWindSpeedString from "../../Utilities/CreateWindSpeedString"


// Component that handles the building and handling of each day's
// forecast forms
function ForecastForm({ locationId, forecastDate }) {

  // Initialize the dispatch function
  const dispatch = useDispatch()

  // Set the initial state values
  const [forecastId, setForecastId] = useState(null)
  const [createdOn, setCreatedOn] = useState(null)
  const [cloudCoverState, setCloudCoverState] = useState(-1)
  const [popState, setPopState] = useState("")
  const [highTempState, setHighTempState] = useState("")
  const [lowTempState, setLowTempState] = useState("")
  const [windSpeedState, setWindSpeedState] = useState("")
  const [windDirectionState, setWindDirectionState] = useState("")
  const [currentInputName, setCurrentInputName] = useState("")

  // Get the array of available cloud cover selections
  const cloudCover = useSelector(store => store.config.cloudCover)
  // Get the various forecast limits that will be used for validation
  const forecastLimits = useSelector(store => store.config.forecastFieldLimits)
  // Get the array of available wind directions
  const windDirection = useSelector(store => store.config.windDirection)

  // Set the initial values for the form
  const initialValues = {
    cloud_cover: cloudCoverState,
    pop: popState,
    high_temp: highTempState,
    low_temp: lowTempState,
    wind_speed: windSpeedState,
    wind_direction: windDirectionState,
  }

  // Set validation schemes for each variable
  const validationSchema = {
    cloud_cover: Yup.number()
      .oneOf(cloudCover.map(cloud => cloud.id), "Invalid selection"),
    pop: Yup.number()
      .min(0, "Can not be negative")
      .max(100, "Can not exceed 100%"),
    high_temp: Yup.number()
      .min(forecastLimits.LOW_TEMP_LIMIT, "Too improbably low")
      .max(forecastLimits.HIGH_TEMP_LIMIT, "Too improbably high"),
    low_temp: Yup.number()
      .min(forecastLimits.LOW_TEMP_LIMIT, "Too improbably low")
      .max(forecastLimits.HIGH_TEMP_LIMIT, "Too improbably high"),
    wind_speed: Yup.string()
      .matches(
        /^(\d{1,3})[\s-]*(\d{1,3}[\s]*)*(mph){0,1}\s*[gG]{0,1}(\d{0,3})[\s-]*(\d{0,3})$/,
        // /^(\d{1,3})[\s-]*(\d{1,3}[\s]*)*(mph|m\/s|ms|kn|kt|kts){0,1}\s*[gG]{0,1}(\d{0,3})[\s-]*(\d{0,3})$/,
        "Requires similar format to: 5-15mph G25-35"
    ),
    wind_direction: Yup.number()
      .oneOf(windDirection.map(wind => wind.id), "Invalid selection"),
  }

  // Function that handles the submission of the form data.
  //
  // There are two (2) different approaches here:
  //
  //  1.) POST
  //    1.1) The current forecast should not have an ID
  //    1.2) The forecast has an ID, but the created_on is greater
  //         than 6 hours before the current time
  //  2.) PUT
  //    2.1) The current forecast has an ID and is less than
  //         six (6) hours old
  const handleFormSave = (forecastValues) => {

    // Add in the current locationId and the forecast_for_date
    forecastValues.locationId = locationId
    forecastValues.forecastDate = format(new Date(forecastDate), "yyyy-MM-dd")

    // Set a time of six hours prior as a cut-off
    let sixHourTimeCheck = new Date()
    sixHourTimeCheck.setHours(sixHourTimeCheck.getHours() - 6)

    // PUT route: check if the forecast was made in the last six (6) horus
    if (sixHourTimeCheck < new Date(createdOn)) {

      // Set the forecastId with the values to be dispatched
      forecastValues.id = forecastId

      dispatch({
        type: "UPDATE_EXISTING_FORECAST_IN_DATABASE",
        payload: forecastValues,
      })

      // Exit the function after dispatching the PUT request
      return
    }

    // Otherwise, treat the forecast as a POST
    // Send the REDUX dispatch message
    dispatch({
      type: "SAVE_NEW_FORECAST_TO_DATABASE",
      payload: forecastValues,
    })
  }

  // Function that allows the user to populate the forecast inputs
  // with their prior forecast input values
  const populateFormWithPreviousForecast = (forecastValues) => {

    // Update the initial form state values with the
    // selected values the user choose
    setForecastId(forecastValues.id)
    setCreatedOn(forecastValues.created_on)
    setCloudCoverState(forecastValues.cloud_cover)
    setPopState(forecastValues.pop)
    setHighTempState(Math.round(forecastValues.high_temp))
    setLowTempState(Math.round(forecastValues.low_temp))
    setWindSpeedState(
      buildWindSpeedString(
        forecastValues.wind_speed_low,
        forecastValues.wind_speed_high,
        forecastValues.wind_gust_low,
        forecastValues.wind_gust_high,
      )
    )
    setWindDirectionState(forecastValues.wind_direction)
  }

  // Function that handles pushing the a specific forecast
  // value into the target input field
  const pushSpecificValueToInput = (forecastValue) => {
    
    console.log(forecastValue)
  }

  // Cloud cover selection handler. Controls which
  // cloud cover icon will be shown.
  const cloudCoverIdListener = (value) => {
    setCloudCoverState(Number(value))
  }

  // Function that adds the `currentInputName` state
  // value, which controls the display of the list of
  // previous forecast DOM list values
  const onFocusListener = (value) => {
    setCurrentInputName(value)
  }

  // Function that removes the `currentInputName` state
  // value, which controls the removal of the list of
  // previous forecast DOM list values
  const onBlurListener = (value) => {
    setCurrentInputName("")
  }


  // Build the DOM elements
  return (
    <section className="forecast-form-container">
      <h3>{format(forecastDate, "E. MMM dd, yyyy")}</h3>
      <Formik
        initialValues={initialValues}
        validationSchema={Yup.object(validationSchema)}
        enableReinitialize={true}
        onSubmit={(forecastValues, { setSubmitting }) => {
          // setTimeout(() => {
            // alert(JSON.stringify(forecastValues, null, 2));
          handleFormSave(forecastValues)
          setSubmitting(false)
          // }, 400);
      }}
      >
        {formik =>
        <Form className="forecast-form">
          <div className="forecast-form-card">
            <img src={(cloudCoverState > -1) ? cloudCover[cloudCoverState].image : "../images/cloud_icons/default-icon.png"} alt="" />
            <div className="cloud-cover-selection-container">
              <Selection
                name="cloud_cover"
                className="cloud-cover-selection"
                onFocus={e => onFocusListener(e.target.name)}
                onChange={e => cloudCoverIdListener(e.target.value)}
                onBlur={e => {
                  formik.handleBlur(e)
                  onBlurListener(e.target.name)
                }}
              >
                <option value='-1' className="cloud-cover-selection-option">&nbsp;{`<Cloud Cover>`}</option>
                {cloudCover.map(cloud => (
                  <option key={cloud.id} value={cloud.id}>&nbsp;{cloud.name}</option>
                ))}
              </Selection>
            </div>
            <div className="pop-input-container">
              <InputField
                name="pop"
                type="text"
                className="pop-input"
                onFocus={e => onFocusListener(e.target.name)}
                onBlur={e => {
                  formik.handleBlur(e)
                  onBlurListener(e.target.name)
                }}
              />
            </div>
            <div className="high-temp-container">
              <InputField
                name="high_temp"
                type="text"
                className="high-temp"
                onFocus={e => onFocusListener(e.target.name)}
                onBlur={e => {
                  formik.handleBlur(e)
                  onBlurListener(e.target.name)
                }}
              />
            </div>
            <div className="low-temp-container">
              <InputField
                name="low_temp"
                type="text"
                className="low-temp"
                onFocus={e => onFocusListener(e.target.name)}
                onBlur={e => {
                  formik.handleBlur(e)
                  onBlurListener(e.target.name)
                }}
              />
            </div>
            <div className="wind-speed-container">
              <InputField
                name="wind_speed"
                type="text"
                className="wind-speed"
                onFocus={e => onFocusListener(e.target.name)}
                onBlur={e => {
                  formik.handleBlur(e)
                  onBlurListener(e.target.name)
                }}
              />
            </div>
            <div className="wind-direction-container">
              <Selection
                name="wind_direction"
                className="wind-direction"
                onFocus={e => onFocusListener(e.target.name)}
                onBlur={e => {
                  formik.handleBlur(e)
                  onBlurListener(e.target.name)
                }}
              >
                <option value="-1">&nbsp;{`<DIR>`}</option>
                {windDirection.map(wind => (
                  <option key={wind.id} value={wind.id}>&nbsp;{wind.abbreviation}</option>
                ))}
              </Selection>
            </div>

            <div className="forecast-submission-container">
              <button type="submit">Submit</button>
            </div>

          </div>

          <div className="past-full-forecast-container">
            <DisplayFullPreviousForecasts
              // Drill down the function to populate local state
              populateFormWithPreviousForecast={populateFormWithPreviousForecast}
              // Send the forecast-specific values
              locationId={locationId}
              forecastDate={forecastDate}
              // Pass in the formik props
              formik={formik}
            />
          </div>

          {currentInputName ?
            <div className="past-daily-forecast-container">
              <DisplayVariableFromPreviousForecast
                // Drill down the function to populate the specific local state
                pushSpecificValueToInput={pushSpecificValueToInput}
                // Send the forecast-specific values
                locationId={locationId}
                forecastDate={forecastDate}
                // Send the target input name
                currentInputName={currentInputName}
              />
            </div>
            :
            null
          }

        </Form>
        }
      </Formik>
    </section>
  )
}

export default ForecastForm