// Import the core libraries and components
import * as Yup from "yup"
import { format } from "date-fns"
import { Form, Formik, useFormikContext } from "formik"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

// Import the used components
import { InputField, Selection } from "../../FormikUtils/Components"

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


  // Get the user from the store
  const user = useSelector(store => store.user)
  // Get the array of available cloud cover selections
  const cloudCover = useSelector(store => store.config.cloudCover)
  // Get the various forecast limits that will be used for validation
  const forecastLimits = useSelector(store => store.config.forecastFieldLimits)
  // Get the array of available wind directions
  const windDirection = useSelector(store => store.config.windDirection)
  // Get any historical forecast values for the user, locationId, & forecastDate
  // limited to the last four entries
  const lastForecast = useSelector(store => store.forecastHistory.userForecastHistory
    .filter(forecast => Number(forecast.location_id) === Number(locationId))
    .filter(forecast => format(new Date(forecast.forecast_for_date), "yyyy-MM-dd") === format(forecastDate, "yyyy-MM-dd"))
  ).slice(0, 4)


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

  // Function that handles the submission of the form data
  const handleFormSave = (values) => {

    // Add in the current locationId and the forecast_for_date
    values.locationId = locationId
    values.forecastDate = format(new Date(forecastDate), "yyyy-MM-dd")

    // Send the REDUX dispatch message
    dispatch({
      type: "SAVE_NEW_FORECAST_TO_DATABASE",
      payload: values,
    })
  }

  // Function that allows the user to populate the forecast inputs
  // with their prior forecast input values
  const populateFormWithPreviousForecast = () => {

    setCloudCoverState(lastForecast[0].cloud_cover)
    setPopState(lastForecast[0].pop)
    setHighTempState(Math.round(lastForecast[0].high_temp))
    setLowTempState(Math.round(lastForecast[0].low_temp))
    setWindSpeedState(
      buildWindSpeedString(
        lastForecast[0].wind_speed_low,
        lastForecast[0].wind_speed_high,
        lastForecast[0].wind_gust_low,
        lastForecast[0].wind_gust_high
      )
    )
    setWindDirectionState(lastForecast[0].wind_direction)
  }

  // REF: https://javascript.plainenglish.io/how-to-listen-to-formik-onchange-event-in-react-df00c4d09be
  // Option #2
  const FormObserver = () => {
    const { values } = useFormikContext()
    useEffect(() => {
      console.log("FormObserver::values", values)
    }, [values])
    return null
  }

  const dummyListener = (value) => {
    console.log("In the dummy listner")
  }


  return (
    <div>
      <h3>{format(forecastDate, "E. MMM dd, yyyy")}</h3>
      <Formik
        initialValues={initialValues}
        validationSchema={Yup.object(validationSchema)}
        enableReinitialize={true}
        onSubmit={(values, { setSubmitting }) => {
          setTimeout(() => {
            alert(JSON.stringify(values, null, 2));
            handleFormSave(values)
            setSubmitting(false);
          }, 400);
      }}
      >
        {formik => 
        <Form>
          {/* <FormObserver /> */}
          <Selection label="Cloud Cover" name="cloud_cover">
            <option value='-1'></option>
            {cloudCover.map(cloud => (
              <option key={cloud.id} value={cloud.id}>{cloud.name}</option>
            ))}
          </Selection>
          <InputField
            label="PoP %"
            name="pop"
            type="text"
            // onChange={e => setForecastForDate(
            //   {...forecastForDate, pop: e.target.value})
            // }
            // onChange={formik.handleChange}
            onBlur={dummyListener}
          />
          <InputField
            label="Max"
            name="high_temp"
            type="text"
            onBlur={e => dummyListener(e.target.value)}
          />
          <InputField
            label="Min"
            name="low_temp"
            type="text"
          />
          <InputField
            label="Wind Speed"
            name="wind_speed"
            type="text"
          />
          <Selection label="Wind Direction" name="wind_direction">
            <option value="-1"></option>
            {windDirection.map(wind => (
              <option key={wind.id} value={wind.id}>{wind.abbreviation}</option>
            ))}
          </Selection>
          <button type="submit">Submit</button>
          <button type="button" onClick={() => {
            populateFormWithPreviousForecast()
            console.log(initialValues.cloud_cover, "???????")
            formik.resetForm()}}>^</button>
        </Form>
        }
      </Formik>
    </div>
  )
}

export default ForecastForm