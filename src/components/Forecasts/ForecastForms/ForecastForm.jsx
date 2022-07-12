// Import the core libraries and components
import * as Yup from 'yup'
import { format } from 'date-fns'
import { Form, Formik, useFormikContext } from 'formik'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

// Import the used components
import { InputField, Selection } from '../../FormikUtils/Components'

// Import utility functions
import { kelvinToCelsius, kelvinToFahrenheit } from '../../Utilities/TemperatureConversion'


// Component that handles the building and handling of each day's
// forecast forms
function ForecastForm({ locationId, forecastDate }) {

  // Set the forecast limits in local STATE
  // const [lowTemperatureLimit, setLowTemperatureLimit] = useState(-Infinity)
  // const [highTemperatureLimit, setHighTemperatureLimit] = useState(Infinity)
  const [forecastForDate, setForecastForDate] = useState({})
  const [previousForecastForDate, setPreviousForecastForDate] = useState({})

  // Get the user from the store
  const user = useSelector(store => store.user)
  // Get the array of available cloud cover selections
  const cloudCover = useSelector(store => store.config.cloudCover)
  // Get the various forecast limits that will be used for validation
  const forecastLimits = useSelector(store => store.config.forecastFieldLimits)
  // Get the array of available wind directions
  const windDirection = useSelector(store => store.config.windDirection)
  
  // Set the initial values for the form
  const initialValues = {
    cloud_cover: '',
    pop: '',
    high_temp: '',
    low_temp: '',
    wind_speed: '',
    wind_direction: '',
  }

  // // Initialize the high temperature limit for validation
  // const lowTemperatureLimit = (user.metric) ?
  //   // Round to the nearest integer
  //   Math.round(
  //     // Convert Kelvin to Celsius
  //     kelvinToCelsius(forecastLimits.LOW_TEMP_LIMIT)
  //   )
  //   :
  //   Math.round(kelvinToFahrenheit(forecastLimits.LOW_TEMP_LIMIT))

  // // Initialize the high temperature limit for validation
  // const highTemperatureLimit = (user.metric) ?
  //   Math.round(kelvinToCelsius(forecastLimits.HIGH_TEMP_LIMIT))
  //   :
  //   Math.round(kelvinToFahrenheit(forecastLimits.HIGH_TEMP_LIMIT))


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
        'Entry needs similar format to: 5-15mph G25-35'
    ),
    wind_direction: Yup.number()
      .oneOf(windDirection.map(wind => wind.id), "Invalid selection"),
  }


  // Function that handles the submission of the form data
  const handleFormSave = (values) => {
    console.log(values, "This is values@@@@@@@@")
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


  return (
    <div>
      <h3>{format(forecastDate, "E. MMM dd, yyyy")}</h3>
      <Formik
        initialValues={initialValues}
        validationSchema={Yup.object(validationSchema)}
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
          <FormObserver />
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
            onChange={formik.handleChange}
          />
          <InputField
            label="Max"
            name="high_temp"
            type="text"
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
        </Form>
        }
      </Formik>
    </div>
  )
}

export default ForecastForm