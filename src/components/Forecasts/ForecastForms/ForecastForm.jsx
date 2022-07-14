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
  const [cloudCoverState, setCloudCoverState] = useState("")
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
      .min(0, "Can not have negative PoP %")
      .max(100, "PoP % can not exceed 100%"),
    high_temp: Yup.number()
      .min(forecastLimits.LOW_TEMP_LIMIT, "Too improbable")
      .max(forecastLimits.HIGH_TEMP_LIMIT, "Too improbable"),
    low_temp: Yup.number()
      .min(forecastLimits.LOW_TEMP_LIMIT, "Too improbable")
      .max(forecastLimits.HIGH_TEMP_LIMIT, "Too improbable"),
    wind_speed: Yup.string()
      .matches(
        /^(\d{1,3})[\s-]*(\d{1,3}[\s]*)*(mph){0,1}\s*[gG]{0,1}(\d{0,3})[\s-]*(\d{0,3})$/,
        // /^(\d{1,3})[\s-]*(\d{1,3}[\s]*)*(mph|m\/s|ms|kn|kt|kts){0,1}\s*[gG]{0,1}(\d{0,3})[\s-]*(\d{0,3})$/,
        "Entry needs similar format to: 5-15mph G25-35"
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

  // REF: https://javascript.plainenglish.io/how-to-listen-to-formik-onchange-event-in-react-df00c4d09be
  // Option #2
  // const FormObserver = () => {
  //   const { values } = useFormikContext()
  //   useEffect(() => {
  //     console.log("FormObserver::values", values)
  //   }, [values])
  //   return null
  // }

  const onBlurListener = (value) => {
    // console.log(`In the Blur listener with ${value}`)
    setCurrentInputName("")
  }

  const onFocusListener = (value) => {
    // console.log(`In the Focus listener with ${value}`)
    setCurrentInputName(value)
  }


  return (
    <div>
      <img src={cloudCover[2].image} alt="" />
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
        <Form>
          {/* <FormObserver /> */}
          <Selection
            label="Cloud Cover"
            name="cloud_cover"
            onFocus={e => onFocusListener(e.target.name)}
            onBlur={e => onBlurListener(e.target.name)}
          >
            <option value='-1'></option>
            {cloudCover.map(cloud => (
              <option key={cloud.id} value={cloud.id}>{cloud.name}</option>
            ))}
          </Selection>
          <InputField
            label="PoP %"
            name="pop"
            type="text"
            onFocus={e => onFocusListener(e.target.name)}
            onBlur={e => onBlurListener(e.target.name)}
          />
          <InputField
            label="Max"
            name="high_temp"
            type="text"
            onFocus={e => onFocusListener(e.target.name)}
            onBlur={e => onBlurListener(e.target.name)}
          />
          <InputField
            label="Min"
            name="low_temp"
            type="text"
            onFocus={e => onFocusListener(e.target.name)}
            onBlur={e => onBlurListener(e.target.name)}
          />
          <InputField
            label="Wind Speed"
            name="wind_speed"
            type="text"
            onFocus={e => onFocusListener(e.target.name)}
            onBlur={e => onBlurListener(e.target.name)}
          />
          <Selection
            label="Wind Direction"
            name="wind_direction"
            onFocus={e => onFocusListener(e.target.name)}
            onBlur={e => onBlurListener(e.target.name)}
          >
            <option value="-1"></option>
            {windDirection.map(wind => (
              <option key={wind.id} value={wind.id}>{wind.abbreviation}</option>
            ))}
          </Selection>

          <button type="submit">Submit</button>

          <DisplayFullPreviousForecasts
            // Drill down the function to populate local state
            populateFormWithPreviousForecast={populateFormWithPreviousForecast}
            // Send the forecast-specific values
            locationId={locationId}
            forecastDate={forecastDate}
            // Pass in the formik props
            formik={formik}
          />

          {currentInputName ?
            <DisplayVariableFromPreviousForecast
              // Drill down the function to populate the specific local state
              pushSpecificValueToInput={pushSpecificValueToInput}
              // Send the forecast-specific values
              locationId={locationId}
              forecastDate={forecastDate}
              // Send the target input name
              currentInputName={currentInputName}
            />
            :
            null
          }

        </Form>
        }
      </Formik>
    </div>
  )
}

export default ForecastForm