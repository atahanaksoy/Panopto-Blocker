# Panopto Blocker

Panopto Blocker is a Google Chrome extension for blocking the annoying 15-second disclaimer message.

## Updates

20.03.2021 - Updated Viewer.js with the new version

## How it works?

The working principle is very simple.
**script.js** intervenes the request of your browser to the Panopto's **Viewer.js**
file, and replaces it with the modified version where the duration time for waiting is set to 0.

## Installation

1- Install the zip file and extract the folder.

2- Open your Chrome and go to [Extensions](chrome://extensions/).

3- Check the box for **Developer mode** in the top right.

4- Click the **Load unpacked extension** button.

5- Choose the folder you unzipped at step 1.

## Important Note

This extension might require frequent updates since it replaces the script of Panopto with the modified version.

**If you are unable to load the Panopto player, just remove the extension and wait for an update :D**

Also, this is my first Chrome extension, so feel free to leave me feedback or request an update.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
