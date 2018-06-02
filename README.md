# Todoist for Linux

[![build_status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com/cyfrost/todoist-linux/releases/latest)
[![GitHub release](https://img.shields.io/badge/current%20release-v1.0-blue.svg)](https://github.com/cyfrost/todoist-linux/releases/latest)
[![license](https://img.shields.io/badge/license-MIT-orange.svg)](https://github.com/cyfrost/easyrun/blob/master/LICENSE)
[![HitCount](http://hits.dwyl.com/cyfrost/todoist-linux.svg)](http://hits.dwyl.com/cyfrost/todoist-linux)

[Todoist](https://todoist.com) is a productivity app used by millions around the world. It's kinda sad they don't (yet) make Todoist for Linux. This is an open-source project to build a simple wrapper application around the [Official Todoist web app](https://todoist.com/app) using the [Electron JS](https://electronjs.org) framework.

## Features

The following features are available:

  * Auto start Todoist on startup (Minmize on startup available).
  * Nifty keyboard shortcuts to globally access Todoist actions such as quickly adding tasks to Todoist.
  * Nifty toggleable Tray icon with useful actions (TrayContextMenu, Single click to activate, etc).
  * Always Up-to-date!

![img](https://i.imgur.com/MyeKIuO.png) ![img](https://i.imgur.com/piZhFpA.png)

![img](https://i.imgur.com/nIWqIa8.png)          


## Download

This project currently provides `DEB` and `RPM` packages in both `x86` and `x64` architectures. Most commonly-used GNU/Linux distros use either `DEB` or `RPM` packaging format (such as Debian; and its derivatives, the Red-Hat ecosystem --Fedora, CentOS, RHEL etc., and OpenSUSE too).

[Go to the Releases page](https://github.com/cyfrost/todoist-linux/releases) and grab the latest compatible package for your machine.


## Installation

For `.DEB` users:

   `$ sudo apt install <file_name.deb>` (ex: `sudo apt install Todoist_1.0.0_amd64.deb`)

For `.RPM` users:

   `$ sudo yum install <file_name.rpm>` (ex: `sudo dnf install Todoist_1.0.0.x86_x64.rpm`)
   

## Usage Instructions

Todoist is accessible from Installed Applications list, you can change settings by either `right-clicking on the tray icon > Options` or `hit Alt key and go to File > Options`. The configuration is saved in `~/.config/Todoist/settings.json`.
   
   
## Global Keyboard Shortcuts

These bindings may not always work, for example, in cases where current bindings are globally registered by another application inb4 Todoist gets a chance --you'll have to quit or unregister those bindings and run Todoist again.

* Ctrl + Alt + A - global shortcut to open the "Add Quick Task" action in Todoist app. 
* Ctrl + Alt + T - Shows or hides the Todoist window.
* ESC - hides the window if isFocused() promises true.
* All other Todoist's shortcuts are accessible inside the window.

# Build Instructions

Pretty simple:

* 1. run `$ npm install` in the project root directory to install project dependencies.

* 2. run `$ npm install` in the `src` directory to install app dependencies/modules.

* 3. run `$ npm run start` in the `src` directory to run the app.

* [Optional] If you're looking for a way to build `DEB` and `RPM` packages yourself, run `$ make packages` in the project root directory. This will create (32bit + 64bit) DEB and RPM packages in the `dist` directory.

# Contributing

Feel free to poke around this code base and see if you can improve the app, this is probably the best part of Open-Source dev. If you need help, reach out to me at [cyrus.frost@hotmail.com](mailto:cyrus.frost@hotmail.com). Good luck!

# License

This project is made available under the MIT License, obtain a full copy of it [here](https://opensource.org/licenses/MIT).