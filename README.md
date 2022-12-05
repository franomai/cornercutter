![Cornercutter banner](./screenshots/logo/CornercutterBanner.png?raw=true)

# Cornercutter

Cornercutter is a mod for the Steam version of the game [Going Under](https://aggrocrab.com/Going-Under) that, along with many other exciting things, lets you control the spawning of skills within dungeons. Get ready to cut some corners!

Features include:
* Create mods to control where skills spawn and what skills they are - All skills are Bomb Dropper? Sure! No items at all? Why not!
* Modify dungeon rules, from blocking healing to having stores always stock skills.
* Modify out-of-dungeon rules, like shop restocks and skill cubit costs. You can also turn off achievements and highscores to leave your saves factory new.
* Share your mods with your friends with easy to copy game codes. Make new friends by sharing the same codes as well!
* Access extra Going Under features through the Debug menu, which lets you spawn in items, set enemy health to one, and more.

And even more than that! Check out some of the screenshots below:

![General mod settings](./screenshots/in-app/GeneralPage.png?raw=true "Setup your mod with lots of cool settings and also ones that make the game way harder!")
![Configure skills per floor](./screenshots/in-app/FloorsPage.png?raw=true "Pick skills to show up on each floor! They're all there, we checked!")

![Multiple starting skills](./screenshots/in-game/MultipleStartingSkills.jpg?raw=true "Start with mutiple skills! Become legendary right out the gate!")
![Shops with only skills](./screenshots/in-game/AllSkillShops.jpg?raw=true "Rig stores to overstock all the skills you could ever want! Be unable to afford any of them!")
![First floor curse rooms](./screenshots/in-game/FloorOneCurseRoom.jpg?raw=true "Spawn special rooms in places they shouldn't be! Rig those as well!")
![Duplicate skill example 1](./screenshots/in-game/DuplicateSkills1.jpg?raw=true "Get 'free' skills out of pedestal rooms!")
![Duplicate skill example 2](./screenshots/in-game/DuplicateSkills2.jpg?raw=true "Double down on your favourite skills!")
![Debug menu](./screenshots/in-game/DebugMenu.jpg?raw=true "Use the debug menu for even more fun! Or softlock the game!")

## Sounds cool, how do I get it?

The newest release of Cornercutter will always be at [our releases page](https://github.com/franomai/cornercutter/releases).
Installing is as simple as running the msi installer - mod files should be dropped to the Going Under folder automatically.
In the case they are not, please check the folder permissions. The files inside the built-mod folder of the installer directory can be manually copied if required.
New versions of Cornercutter will be pushed to your app automatically.
To check if Cornercutter is running, a visual indicator will display once you load into a Going Under save, like the one below:
![Cornercutter indicator](./screenshots/in-game/CornercutterIndicator.jpg?raw=true "The Cornercutter indicator is in the top left. It will change depending on if you are in a dungeon and if you have mods loaded.")

The currently selected mod will be loaded into your next run. Note that mod activations/deactivations and changes to settings will only come into effect **after the dungeon is finished or the next dungeon is started**.

## Credits

The Cornercutter team (franomai/Squiddles & pumbas600) would like to thank and shout out:
* Hotkoin (check them out at [their insta](https://www.instagram.com/hotkoin)) for the amazing art.
* slyllama (check them out at [their website](https://www.slyllama.net/)) for their graphics help and artistic direction.
* Sabertwooth, Jowee, Logan, and Boxness for their playtesting and feedback.
* The Aggro Crab Discord community (especially #speefruns and #modding) for keeping a two year old game alive.
* Jowee again, for the original inspiration for skill manipulation and their work in maintaining Going Under resources.
* Aggro Crab, for making an amazing game, but especially Caelan and Paige for their support.
* You, for reading and playing! We hope you like it!

## User metrics

Hi there! You probably arrived here through the Cornercutter app, and you're thinking, what the frick, they're taking my data? Do they want to sell me sparkling beverages based on my interests? Not at all! Cornercutter is a passion project, and we'd like to know when someone out there is enjoying it, so we can work on other parts of the app that they will enjoy, or flex to someone we know IRL when we are gunning for an unpaid internship that someone enjoyed something we made. To do that, we get a ping when you open and close Cornercutter, as well as when you make, use, or share mods. If you would prefer that we don't though, that is okay as well, you can opt-out at any time from the settings menu.

# I'd like to add stuff to Cornercutter!

Hello, and welcome! You've come to the right place. The following will explain the general layout of Cornercutter - How each component works, how they interact, and most importantly, how to contribute to them.

## Application structure
Cornercutter is built using Tauri, and leverages BepInEx/Harmony to modify game code via reflection without directly editing the main dlls. A mod gets from the app to the game like so:
1. A user will configure a mod in the Tauri frontend. This is a WebView2 window that is running React - so your standard web technologies, JavaScript/TypeScript, HTML and CSS. The code for this is contained in `cornercutter/frontend`.
2. A user will save their changes (or the app will do it for them). These commands are received by the Tauri backend, which is written in Rust. The code for this is contained in `cornercutter/src-tauri`.
3. This will then drop a file to the user's cornercutter folder, located inside the Going Under directory. This is a JSON file, which is not really important, but keeps this description consistent.
4. When Going Under is loaded, BepInEx will hook into the game, injecting any plugins that exist, including Cornercutter. This is written in C#, and this loader is automatically installed with Cornercutter. You should not need to touch this, but the repo can be found [here](https://github.com/BepInEx/BepInEx).
5. The Cornercutter plugin will load the JSON file and get to work. The mod is written against .NET Standard 2.0 (C# 7.3), and modifies the base game with the hooks provided by Harmony, which you can find [here](https://github.com/pardeike/Harmony). The actual mod code is contained in `cornercutter/mod`.

The following segments will briefly touch on how to get started with each component.

## Frontend and backend (points 1 and 2)

### Prerequisites 

This application is built using Tauri. Follow their instructions [here](https://tauri.app/v1/guides/getting-started/prerequisites) to make sure you have all the required prerequisites.

### Setup

1. Make sure to install all the dependencies by doing `npm install` in the root folder.
2. Install the Prettier and ESLint extensions for your IDE of choice.
   - VSCode: [[Prettier]](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) [[Eslint]](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

### Running Cornercutter

- `npm run client` - A development option that starts the application with hotswapping. **Note:** This is equivalent to `npm run tauri dev`.
  
- `npm run tauri build` - Builds an optimised version of the application in `src-tauri/target/release/`.

## Mod plugin (point 5)

### Prerequisites and Setup

The mode can be built as a standard Visual Studio project (2017 or higher) using the solution file contained in the mod directory. The project itself has dependencies on both the Going Under dlls (Assembly-CSharp.dll, plus the Unity dlls such as UnityEngine.dll), as well as the BepInEx/Harmony dlls (located in the BepInEx folder, such as 0Harmony.dll). For the latter dlls, these should be present if you have Cornercutter installed. Otherwise, the version of BepInEx Cornercutter uses, BepInEx 5.4.21, can be downloaded from [their repo](https://github.com/BepInEx/BepInEx/releases/tag/v5.4.21).

### Adding or modifying mod code

Mods are written as Prefix and Postfix patches against Going Under methods, reading from the base config contained in CutterConfig. For documentation around the available features, please visit the [Harmony documentation](https://harmony.pardeike.net/articles/patching.html)

### Building the mod

Once set up, the default build setting will generate two artifacts, the cornercutter dll and pdb. To test a build, copy these two files into the `BepInEx\plugins` folder in the Going Under directory, as well as any additional dependencies such as `Newtonsoft.Json`. To debug accurately, you can use a debugger such as dnSpy, which can be downloaded from [their archived repo](https://github.com/dnSpy/dnSpy/releases/tag/v6.1.8). To hook into Going Under you will need to modify the mono dll in the game folder - more information about this can be found at [the BepInEx wiki](https://github.com/BepInEx/BepInEx/wiki/dnSpy-Debugging).

# Questions?

If you need any help with Cornercutter, from development to just running the mod, feel free to reach out [via a GitHub issue](https://github.com/franomai/cornercutter/issues/new), or post in the #modding channel of the [Aggro Crab Discord](http://discord.gg/aggrocrab). Thanks for reading!