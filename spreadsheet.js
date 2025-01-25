

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

    const body = {
      values: todoData,
    };

   
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
   
    if (response.ok) {
      console.log('Todo data successfully added to spreadsheet.');
    }
  } catch (error) {
    console.error(error)
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
          title: 'DoneLog'
        },
        sheets: [
          {
            properties: {
              title: 'DoneLog01',
              gridProperties: {
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

async function getSpreadsheetId(accessToken){
  
  try {
    const storedSheetId = localStorage.getItem('spreadsheetId');
   
  if(storedSheetId){
    return storedSheetId;
  }
  const spreadsheetId = await createSpreadsheet(accessToken)
  if(spreadsheetId){
    localStorage.setItem('spreadsheetId', spreadsheetId);
  }
  
  return spreadsheetId;

  } catch (err) {
    throw new Error(err);
  }
  
}