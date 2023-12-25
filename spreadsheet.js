// const SHEET_NAME = 'LifeList';

async function authorizeUser() {
  try {
    const accessToken = await chrome.identity.getAuthToken({ interactive: true });
    
    if (!accessToken) {
      throw new Error('User not authorized.');
    }
    
    return accessToken;
  } catch (error) {
    
    throw error;
  }
}

export async function pushTodoInSpreadsheet(todoData) {
  
  try {
    const authorized = await authorizeUser();
    const accessToken = authorized.token;
    const spreadsheetId = await getSpreadsheetId(accessToken);

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/A:F:append?valueInputOption=USER_ENTERED`;

    
    // Prepare the body data
    const body = {
      values: [[
        todoData.todo,
        todoData.createdAt,
        todoData.doneAt,
        todoData.startTime,
        todoData.endTime,
        todoData.isDone ? 'true' : 'false',
      ]],
    };

    // Send the request
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    // console.log('response from push todos', response);
    if (response.ok) {
      // console.log('Todo data successfully added to spreadsheet.');
    }
  } catch (error) {
    console.error(error)
    
    throw error;
  }
}


async function createSpreadsheet(token) {
  try {
    const response = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        properties: {
          title: 'LifeList'
        },
        sheets: [
          {
            properties: {
              title: 'LifeList01',
              gridProperties: {
                // rowCount: 10,
                columnCount: 7
              }
            },
            data: [
              {
                startRow: 0,
                startColumn: 0,
                rowData: {
                  values: [
                    {
                      userEnteredValue: { stringValue: 'Todos' },
                      userEnteredFormat: {
                        textFormat: {
                          bold: true,
                          fontSize: 12 
                        }
                      }
                    },
                    {
                      userEnteredValue: { stringValue: 'createdAt' },
                      userEnteredFormat: {
                        textFormat: {
                          bold: true,
                          fontSize: 12
                        }
                      }
                    },
                    {
                      userEnteredValue: { stringValue: 'doneAt'},
                      userEnteredFormat: {
                        textFormat: {
                          bold: true,
                          fontSize: 12
                        }
                      }
                    },
                    {
                      userEnteredValue: { stringValue: 'startTime'},
                      userEnteredFormat: {
                        textFormat: {
                          bold: true,
                          fontSize: 12
                        }
                      }
                    },
                    {
                      userEnteredValue: { stringValue: 'endTime'},
                      userEnteredFormat: {
                        textFormat: {
                          bold: true,
                          fontSize: 12
                        }
                      }
                    },
                    {
                      userEnteredValue: { stringValue: 'isDone'},
                      userEnteredFormat: {
                        textFormat: {
                          bold: true,
                          fontSize: 12
                        }
                      }
                    }
                    
                  ]
                }
              }
            ]
          }
        ]
      })
    });

    const data = await response.json();
    const spreadsheetId = data.spreadsheetId;
    return spreadsheetId;
  } catch (error) {
    throw new Error('Failed to create spreadsheet with formatted data');
  }
}



///////////////////
// async function getSpreadsheetIdByTitle(accessToken, title) {
//   try {
//       const url = 'https://sheets.googleapis.com/v4/spreadsheets';

//       const headers = new Headers();
//       headers.append('Authorization', `Bearer ${accessToken}`);

//       const response = await fetch(url, {
//           method: 'GET',
//           headers,
//       });

//       if (response.ok) {
//           const data = await response.json();
//           if (data.spreadsheets && data.spreadsheets.length > 0) {
//               const titles = data.spreadsheets.map(sheet => sheet.properties.title);
//               return titles;
//           } else {
//               return []; // No spreadsheets found
//           }
//       } else {
//           const errorData = await response.json();
//           console.error('Failed to fetch spreadsheets:', response.status, errorData.error);
//           return null;
//       }
//   } catch (error) {
//       console.error('Error:', error);
//       return null;
//   }
// }




////////////////////////////////////
async function getSpreadsheetId(accessToken){
  try {
    // console.log('getting id');
    const storedSheetId = localStorage.getItem('spreadsheetId');
  if(storedSheetId){
    return storedSheetId;
  }
  // const spreadsheetId = await getSpreadsheetIdByTitle(accessToken, 'Sheet1');
  // console.log('spreadsheetId from getSpreadsheetId', spreadsheetId);
  const spreadsheetId = await createSpreadsheet(accessToken)
  if(spreadsheetId){
    localStorage.setItem('spreadsheetId', spreadsheetId);
  }
  return spreadsheetId;

  } catch (err) {
    throw new Error(err);
  }
  
}