chrome.action.onClicked.addListener(function() {
    chrome.tabs.create({ url: chrome.runtime.getURL('todos.html') });
  });

// Function to create the context menu item
function createContextMenuItem() {
    chrome.contextMenus.create({
      id: 'openDoneLog',
      title: 'DoneLog (Ctrl+Shift+L)',
      contexts: ['page'] 
    });
  }
  
  // Event listener for context menu item click
  chrome.contextMenus.onClicked.addListener(function(info, tab) {
    if (info.menuItemId === 'openDoneLog') {
      chrome.tabs.create({ url: chrome.runtime.getURL('todos.html') });
    }
  });
  
  // Call the function to create the context menu item
  createContextMenuItem();
  


  
// Function to check if the shortcut conflicts with existing browser action shortcuts
async function doesShortcutConflict(shortcut) {
    const commands = await chrome.commands.getAll();
    const conflicts = commands.some(command => command.shortcut === shortcut);
    return conflicts;
  }
  
  // Function to set the shortcut if no conflicts are found
  async function setShortcut() {
    const shortcut = 'Ctrl+Shift+L'; // Define your desired shortcut here
    
    const conflict = await doesShortcutConflict(shortcut);
    // console.log('conflict', conflict);
    if (!conflict) {
      chrome.commands.update({ name: 'openDoneLog', shortcut });
    } else {
      console.error('Shortcut conflicts with existing browser action shortcuts');
      // Handle the conflict or choose a different shortcut
    }
  }
  
  // Set the shortcut on extension load or as required
  setShortcut();
  

chrome.commands.onCommand.addListener(function(command) {
    if (command === 'openDoneLog') {
      chrome.tabs.create({ url: chrome.runtime.getURL('todos.html') });
    }
  });
  