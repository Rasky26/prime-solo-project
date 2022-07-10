// Import core libraries and functions
import axios from "axios"
import { useEffect, useState } from "react"

// Import the used components
import ListSearchedForecastLocation from "./ListSearchedForecastLocation"


// Component that allows the user to search for
// an official forecast location in the database
//
// Debounce relies heavily on this reference:
//  https://javascript.plainenglish.io/how-to-create-an-optimized-real-time-search-with-react-6dd4026f4fa9
// 
// << LATER >> Look into the `lodash` library discussed at the bottom
// of the above article
export default function SearchForecastLocations() {

  // Track the search in a local STATE value
  const [searchTerm, setSearchTerm] = useState('')
  // Create a debounce variable to time-gate API calls
  const [debouncedTerm, setDebouncedTerm] = useState(searchTerm)
  // Store the server query results in local state
  const [searchResults, setSearchResults] = useState([])

  // Update the 'searchTerm' STATE value after 1 second
  // from the last update of 'debouncedTerm'
  useEffect(() => {
    const timer = setTimeout(() => setSearchTerm(debouncedTerm), 862)
    return () => clearTimeout(timer)
  }, [debouncedTerm])

  // Set `useEffect` to track the user input and
  // handle calling the API to search for a station
  useEffect(() => {
    // Check if the search bar is blank
    if (searchTerm !== "") {
      onSearchSubmit(searchTerm)
    }
    // Otherwise, clear out the search STATE value
    else {
      onClearSearchResults()
    }
  },
    // Listen for changes of the search term or from the function
    [searchTerm, onSearchSubmit]
  )

  // The main search function that is called as the search
  // term input is changed / updated
  const onSearchSubmit = term => {

    // Build the headers to send along with the server request
    try {
      const config = {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      }

      // Call the server with the search parameter in the URL.
      axios.get(`/api/forecast-locations/${term}`, config)
      .then((result) => {
        setSearchResults(result.data)
      })
      .catch((err) => console.log(`Search error with ${err}`))
      
      // Set the results to local state
      // setSearchResults(apiSearchResults)

      // If errors occur, log them to the console
    } catch (err) {
      console.log(`Error with SearchForecastLocations GET with params &: ${err}`)
    }
  }

  // Clear the search results from local state
  const onClearSearchResults = () => setSearchResults([])


  // Build the DOM element
  return (
    <div>
      <input
        type="text"
        name="stationSearchField"
        // value={searchTerm}
        value={debouncedTerm} // Shows the current value from the user
        // onChange={e => setSearchTerm(e.target.value)}
        onChange={e => setDebouncedTerm(e.target.value)} // References the delayed search method
      />
      <label htmlFor="stationSearchField">Search</label>
      {searchResults ?

        searchResults.map(searchItem => (
          <ListSearchedForecastLocation key={searchItem.id} searchItem={searchItem} />
        ))

        :
        null
      }
    </div>
  )
}