const fs = require('fs')
const readline = require('readline')

// Initialize a counter (lazy-version)
let count = 0
let sqlQuery


// MUST use an async function to process these files
async function processLineByLine() {
  
  // Get the file that is to be processed
  const fileStream = fs.createReadStream('./WX_Station_List.txt');

  // Set the params for the readline function
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });
  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') in input.txt as a single line break.

  for await (const line of rl) {
    // If the row count is greater than zero, add these lines
    if (count > 0) {
        // Each line in input.txt will be successively available here as `line`.
        // Split each line on the `tab` delimiter.
        const splitLine = line.split('\t')

        let name = splitLine[1]
        if (name.indexOf("'") > -1) {
          const apostropheIndexOf = name.indexOf("'")
          name = name.substring(0, apostropheIndexOf) + "'" + name.substring(apostropheIndexOf, name.length+1)
        }

        // Construct the SQL insert values line from the text file
        const formattedLine = `\t('${splitLine[0].trim()}', '${name.trim()}', '${splitLine[2].trim()}', '${splitLine[3].trim()}', '${splitLine[4].trim()}', '${splitLine[5].trim()}', '${splitLine[6].trim()}', '${splitLine[7] ? splitLine[7].trim() : 0}'),
`
        // Append that SQL line to the existing `sqlQuery` variable
        sqlQuery += formattedLine
    }

    // Handle the header function
    else {
        // Generate the column names into the file
        const formattedLine = `\t("station", "name", "state", "timezone", "daylight_saving", "latitude", "longitude", "elevation")`
        // Start the SQL insert lines with the core information
        sqlQuery = `INSERT INTO "asos_awos_us_locations"
  ${formattedLine}
VALUES
`

      // Increment the count
      count++
      // if (count > 10) {
      //     console.log(sqlQuery)
      //     break
      // }
      
    }  
  }

  console.log(sqlQuery)

  // Find the last comma in this giant string and replace it with the closing
  // values for our SQL insert statement
  const lastCommaIndex = sqlQuery.lastIndexOf(',')
  sqlQuery = sqlQuery.substring(0, lastCommaIndex) + `;`
  console.log(sqlQuery)

  // Write to the SQL file
  fs.writeFile(
    "wx_station_database_dump.sql", sqlQuery,
    // Check for errors on the write / document
    function(err) {
      if(err) {
        return console.log(err)
      }
    }
  )

}

processLineByLine();