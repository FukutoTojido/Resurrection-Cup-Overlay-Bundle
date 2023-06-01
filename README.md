# Resurrection Cup Overlay Bundle
Resurrection Cup Overlay + Showcase + Winner + Mappool (to be added soon)

## Install instruction
- Download the latest release
- Extract the contents of the zip file and put them in a folder called `ResCupOverlay`
- Copy the `ResCupOverlay` folder to `<your_gosumemory_path>/static/`
- Run osu!, gosumemory and OBS
- In OBS, add a `Browser Source` with using the URL:
  - `http://127.0.0.1:24050/ResCupOverlay` for Main Overlay
  - `http://127.0.0.1:24050/ResCupOverlay/#/showcase` for Showcase Overlay
  - `http://127.0.0.1:24050/ResCupOverlay/#/winner` for Winner Overlay
  - `http://127.0.0.1:24050/ResCupOverlay/#/mappool` for Mappool Overlay
- The source dimension should be `1920x1080`
  
## Edit the Mappool
- Open `ResCupOverlay/config.json`
- Edit the mappool

## Update the Overlay
- Redo the `Install instructions`

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
