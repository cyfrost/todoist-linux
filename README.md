# Todoist for Linux

[Todoist](https://todoist.com) is a To-do app used by many people.

This repo is a fork of [Ruslan Bekenev's](https://github.com/KryDos/todoist-linux) project, plus, some additional niceties that suit my workflow.

## Features

This fork has all the features that [upstream](https://github.com/KryDos/todoist-linux) has, plus:

  * Run at Startup + Minimize on start! (see screenshots below)
  * Nifty keyboard shortcuts to globally access Todoist actions (Quickly add tasks, hide/show window etc).
  * Nifty toggleable system Tray icon with useful actions (Single click to activate, reset app, etc).
  * Always Up-to-date! (Electron/Node runtimes)
  

![img](https://i.imgur.com/lgNoLb7.png)


![img](https://i.imgur.com/skShjnT.png)


## Download

This project currently provides `.DEB`, `.RPM`, and `AppImage` packages in both x86 and x64 platforms. Most commonly-used GNU/Linux distros use either `DEB` or `RPM` packaging format (such as Debian; and its derivatives, the Red-Hat ecosystem --Fedora, CentOS, RHEL etc., and OpenSUSE too). If your distro doesn't use `apt` or `dnf` you can always use the `AppImage` package since it works universally on most major distributions.

[Go to the Releases page](https://github.com/cyfrost/todoist-linux/releases) and grab the latest compatible package for your machine.

For the unininitated, if you're using Ubuntu, get the `.deb` package; or the `.rpm` package if your distro is Fedora/CentOS/RHEL/OpenSUSE, or the `AppImage` if your distro is neither.

## Installation

After downloading the suitable package from the [releases](https://github.com/cyfrost/todoist-linux/releases) page, open up a new Terminal window and use the following instructions to install the downloaded package:

If you downloaded the `.DEB` package, then do:

   `$ sudo apt install <file_name.deb>` (ex: `sudo apt install Todoist_1.0.0_amd64.deb`)

If you downloaded the `.RPM` package then do:

   `$ sudo yum install <file_name.rpm>` (ex: `sudo dnf install Todoist_1.0.0.x86_x64.rpm`)
   
If you downloaded the `.AppImage` package then do:

   `$ chmod a+x <file_name.AppImage>`
   
   `$ ./<file_name.AppImage>`
   

## Usage Instructions

Todoist is accessible from Installed Applications list, you can change settings by either `right-clicking on the tray icon > Options` or in the main window `hit Alt key and go to File > Options`. The configuration is saved in `~/.config/Todoist/settings.json`.
   
   
## Global Keyboard Shortcuts

Keyboard shortcuts come in handy when you need to add a Task to Todoist but without having the window open at the moment.

* Ctrl + Alt + A - global shortcut to open the "Add Quick Task" action in Todoist app. 
* Ctrl + Alt + T - Shows or hides the Todoist window.
* ESC - hides the window if isFocused() promises true.
* All other Todoist's shortcuts are accessible inside the window.

These bindings may not work as intended if they're already registered by another application in active use.


## Removal (Uninstall) Instructions

If you'd like to remove Todoist for Linux from your machine:

* run `$ sudo apt remove Todoist` if you installed the .deb package

* run `$ sudo dnf remove Todoist` if you installed the .rpm package

* Visit [this page](https://stackoverflow.com/questions/43680226/how-can-i-uninstall-an-appimage) for removal instructions if you installed it via the .AppImage package.

If you'd like to remove the config data, it is stored in `~/.config/Todoist`.


# Build Instructions & Contributing

Visit (https://nodejs.org/en/download/package-manager/) and follow your distro-specific instructions to install (Node.js + npm).


### Build project:

* run `$ make build` in the extracted project directory.

The below command will automatically:

1. Download and install project dependencies
2. Download and install app dependencies
3. Build the app
4. Run the app in debug mode

### Building application packages:

If you're looking for a way to build `.deb` or `.rpm` or `.AppImage` or other distro-specific packages yourself:

run `$ make packages` in the extracted project directory. This will create (x86 and x64) LINUX ONLY packages for targets specified in the `package.json` file. The packages can be found in the `<proj_root>/dist` directory.


## Contributing

Feel free to poke around the code base and see if you can improve the app, which is probably the best part of FOSS devel. If you need help, feel free to reach out to me at [cyrus.frost@hotmail.com](mailto:cyrus.frost@hotmail.com). Good luck!

## Reporting Bugs/Issues

If you find an issue while using this app, please open a new Issue in the "Issues" tab and we'll go from there. If you already know how to fix it, please create a new Pull Request, I'll be more than happy to review and merge it sooner than later.

# License / Credits

Since this repo is a fork of [this project](https://github.com/KryDos/todoist-linux), all licensing terms and copyrights apply inherently.
