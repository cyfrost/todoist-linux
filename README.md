# Todoist for Linux

[![GitHub release](https://img.shields.io/badge/current%20release-v1.0-blue.svg)](https://github.com/cyfrost/todoist-linux/releases/latest)
[![license](https://img.shields.io/badge/license-MIT-orange.svg)](https://github.com/cyfrost/easyrun/blob/master/LICENSE)
[![HitCount](http://hits.dwyl.com/cyfrost/todoist-linux.svg)](http://hits.dwyl.com/cyfrost/todoist-linux)

[Todoist](https://todoist.com) is a productivity app used by millions around the world. Unfortunately, there's no official app for Todoist for Linux. This project project creates a simple wrapper application around the [Official Todoist web app](https://todoist.com/app) using the [Electron JS](https://electronjs.org) framework with additional features.

## Features

  * Auto start Todoist on startup (Minmize on startup available).
  * Nifty keyboard shortcuts to globally access Todoist actions such as quickly adding tasks to Todoist.
  * Nifty toggleable Tray icon with useful actions (TrayContextMenu, Single click to activate, etc).
  * Always Up-to-date!

Note: I use [this](https://www.gnome-look.org/p/1013714/) macOS theme on my GNOME desktop, hence the screencap's titlebars ;)

![img](https://i.imgur.com/yfNZ50m.png)

## Download

This project currently provides `DEB` and `RPM` packages in both `x86` and `x64` architectures. Most commonly-used GNU/Linux distros use either `DEB` or `RPM` packaging format (such as Debian; and its derivatives, the Red-Hat ecosystem --Fedora, CentOS, RHEL etc., and OpenSUSE too).

[Go to the Releases page](https://github.com/cyfrost/todoist-linux/releases) and grab the latest compatible package for your machine.


## Installation

For `.DEB` users:

   `$ sudo apt install <file_name.deb>` (ex: `sudo apt install Todoist_1.0.0_amd64.deb`)

For `.RPM` users:

   `$ sudo yum install <file_name.rpm>` (ex: `sudo dnf install Todoist_1.0.0.x86_x64.rpm`)
   

## Usage Instructions

Todoist is accessible from Installed Applications list, you can change settings by either `right-clicking on the tray icon > Options` or in the main window `hit Alt key and go to File > Options`. The configuration is saved in `~/.config/Todoist/settings.json`.
   
   
## Global Keyboard Shortcuts

These bindings may not always work, for example, in cases where current bindings are globally registered by another application inb4 Todoist gets a chance --you'll have to quit or unregister those bindings and run Todoist again.

* Ctrl + Alt + A - global shortcut to open the "Add Quick Task" action in Todoist app. 
* Ctrl + Alt + T - Shows or hides the Todoist window.
* ESC - hides the window if isFocused() promises true.
* All other Todoist's shortcuts are accessible inside the window.

## Removal Instructions

If you'd like to remove Todoist for Linux from your machine:

* run `$ sudo apt remove Todoist` if you installed the .deb package

* run `$ sudo yum remove Todoist` if you installed the .rpm package

The configuration/App data is stored in `~/.config/Todoist`.


## Build Instructions

Before anything else, you'll need `npm` and `make` packages to be able to build this project. See [Installing Node.js via Package Manager](https://nodejs.org/en/download/package-manager). Although `make` is probably installed, it is also bundled with `build-essential` pkg.

Pretty simple to build the project:

* run `$ npm install` in the project root directory to install project dependencies.

* run `$ npm install` in the `src` directory to install app dependencies/modules.

* run `$ npm run start` in the `src` directory to run the app (or `$ make run` in the project root).

* [Optional] If you're looking for a way to build `DEB` and `RPM` packages yourself, run `$ make packages` in the project root directory. This will create (32bit + 64bit) DEB and RPM packages in the `dist` directory.

## Contributing

Feel free to poke around the code base and see if you can improve the app, which is probably the best part of FOSS devel. If you need help, feel free to reach out to me at [cyrus.frost@hotmail.com](mailto:cyrus.frost@hotmail.com). Good luck!

I originally found [this](https://github.com/KryDos/todoist-linux) by [Ruslan Bekenev](https://github.com/KryDos) in attempt to use Todoist for Linux, liked it very well, got inspired: forked it and added new features under the current project.

## License

This project is made available under the MIT License, you can obtain a full copy of it [here](https://opensource.org/licenses/MIT).
