## Integrating with the current development workflow:

### Xcode:

Log in to https://developer.apple.com/account/overview.action
Go to 'Certificates, Identifiers & Profiles'
Go to 'Certificates'
Click on the latest iOS Development certificate
Click 'Download'
Once the file has downloaded, open it. This should open keychain and add the certificate to your keychain.
Next, under 'Provisioning Profiles', click 'Development'
Click on the 'Multco Bridge Alerts Dev' profile
Click 'Download'
Once the file has downloaded, open it. This should open xcode and add the profile to your dev environment.
At this point, in xcode, go to the top-level .xcodeproject file,
Go to 'Build Settings'
Under 'Code Signing,' select the iOS Development certificate you downloaded above.
Under 'Provisioning Profile', select 'Automatic'
You should be able to build now.
If xcode errors, and prompts you to resolve issues, click okay and have xcode resolve them for you.

## Starting from scratch:

Install xcode from the apple app store
Install the Android studio from https://developer.android.com/sdk/index.html#top

Open both, and install all prompted deps

Install cordova via
(requires that node and npm are installed)

```console
sudo npm install -g cordova
```

Follow:
http://cordova.apache.org/docs/en/5.1.1/guide_cli_index.md.html#The%20Command-Line%20Interface
to setup the rest of cordova. Add plugins for device hooks to system hardware.

Once you try to build a project for android, it might prompt to add some additional sdks, do so with
the instructions provided from the error message.

## iOS build/dev

Go to https://developer.apple.com/account/overview.action

After that, you can register a device with apple.
Follow this:
http://cordova.apache.org/docs/en/5.1.1/guide_platforms_ios_index.md.html#iOS%20Platform%20Guide
It's not very explicit, so I will illuminate some sticking points here

create iOS develpment cert in web
They say to create the app certificate in x-code, but
that doesn't seem to be a good workflow in cordova.
https://developer.apple.com/account/ios/certificate/certificateList.action?type=development
Download it, and add to your keychain

register device
https://developer.apple.com/account/ios/device/deviceList.action?deviceClasses=iphone

create provisioning profile, this can inclide multiple devices
download
double click (opens x-code, doesn't do anything)

code signing is in xcodeproject file, select the code signing identity, and choose the one that you made and downloaded earlier.

scheme is in the top navbar, this is the phone or simulator you want to build to. Choose a phone that is connected via usb.

## Android Build/Dev

Following http://cordova.apache.org/docs/en/5.1.1/guide_platforms_android_index.md.html#Android%20Platform%20Guide

The instructions above for installing android studio should have gotten you this far.

In your bash profile, you will need the android tools in your path. Add the following to your ~/.bash_profile

```shell
export PATH="/Users/macdoni/Library/Android/sdk/platform-tools:$PATH"
export PATH="/Users/macdoni/Library/Android/sdk/tools:$PATH"
```

After that, setup the device to be in developer mode:
http://developer.android.com/tools/building/building-studio.html
Be sure to accept the key from your machine when you first plug it in via usb.
If you run:
```console
adb devices
```
you should see something like this:
```console
$ adb devices
List of devices attached
090bc6b6	device

```
After that, you can import the app into Android studio, and build and run from there, or you can use cordova from the command line:
```console
cordova run android
```

## Push Notifications
Using:
https://github.com/cranberrygame/cordova-plugin-pushnotification-parsepushnotification
SWITCHED TO THIS FORK:
https://github.com/anzovin-brian/cordova-plugin-pushnotification-parsepushnotification
and Parse:
https://www.parse.com/tutorials/ios-push-notifications
up until step three

If you already have a provisioning profile installed in xcode, you will need to delete it (Xcode > preferences > accounts > View Details ). right click on profile > show in finder. Delete it there, and wherever you first downloaded it. Or you can just create a new provisioning profile at developers.apple.com and install that in xcode, and just sign everything with that.
