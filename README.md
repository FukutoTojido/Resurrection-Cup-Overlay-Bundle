# Resurrection Cup Overlay Bundle
Resurrection Cup Overlay + Showcase + Winner + Mappool

## Prerequiste
- **[gosumemory](https://github.com/l3lackShark/gosumemory)**
- **[Resurrection Cup Controller](https://github.com/FukutoTojido/Resurrection-Cup-Overlay-Controller)**

## Install instruction
- Download the latest release
- Extract the contents of the zip file and put them in a folder called `ResCupOverlay`
- Copy the `ResCupOverlay` folder to `<your_gosumemory_path>/static/`
- **RUN RESURRECTION CUP CONTROLLER FIRST**
- Edit config.json
- Run osu!, gosumemory and OBS
- In OBS, add a `Browser Source` with using the URL:
  - `http://127.0.0.1:24050/ResCupOverlay` for Main Overlay
  - `http://127.0.0.1:24050/ResCupOverlay/#/showcase` for Showcase Overlay
  - `http://127.0.0.1:24050/ResCupOverlay/#/winner` for Winner Overlay
  - `http://127.0.0.1:24050/ResCupOverlay/#/mappool` for Mappool Overlay
- The source dimension should be `1920x1080`
  
## Edit config (team icon, config.json)
- Open `ResCupOverlay/config.json`
- Edit the current round name
- Edit `bestOf`, `nBans` (this one is for the Controller)
- Edit the current match teams by the following json format:
```json
{
	...,
 	"team": {
		"left": "",
		"right": "",
	},
	...
}
```
- Edit the team list by the following json format:
```json
{
	...,
	"teamList": [
		{
			"teamName": "",				// String
			"teamSeeding": 0,			// Number
			"teamIconURL": "",			// String - The team icon file name in /team
			"playerList": {
				"playerName": [ "", "", ... ],	// String
				"playerID": [ 0, 0, ...]		// Number, order should match with playerName above
			}
		},
		{ ... }
	],
	...
}
```
- Edit the mappool by the following json format:
```json
{
	...,
	"pool": {
		"NM": [
			{
				"artist": "",
				"title": "",
				"creator": "",			// Mapper
				"coverURL": "",			// https://assets.ppy.sh/beatmaps/<beatmapset-id>/covers/slimcover@2x.jpg
				"diff":	"",				// Difficulty name
				"id": 0					// Number - BEATMAP ID not BEATMAPSET ID
			},
			{ ... }
		],
		"HD": [ ... ],
		"HR": [ ... ],
		"DT": [ ... ],
		"FM": [ ... ],
		"TB": [ ... ]
	}
}
```
- Add team icon in `<your_gosumemory_path>/static/ResCupOverlay/team`

## Update the Overlay
- Delete everything in `<your_gosumemory_path>/static/ResCupOverlay`
- Follow the `Install instructions` again

## Developing
- Clone the repository by `git clone https://github.com/FukutoTojido/Resurrection-Cup-Overlay-Bundle.git`
- Install all NPM packages by `npm i`
- Start the overlay with `npm run dev`
- To build the overlay, simply run `npm run build`, a `dist` folder will be created with all the assets needed for gosumemory.

## Screenshot
![1](https://i.imgur.com/lD66x9e.png)
![2](https://i.imgur.com/IXvYb2U.jpeg)
![3](https://i.imgur.com/VrzUaFN.png)
![4](https://i.imgur.com/R8gIK2W.png)
