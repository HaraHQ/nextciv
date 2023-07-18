import React from "react";
import { Inter } from 'next/font/google';
import Head from "next/head";
const inter = Inter({ subsets: ['latin'] });

const sea = '🌊';
const water = '💧';
const land = ' ';
const city = '🏙️';
const settler = '👲';
const fighter = '🪖';
const police = '👮';
const builder = '👷‍♂️';
const camp = '🧱';
const harbor = '⚓';

const seaZone = '🌊📌';
const waterZone = '💧📌';
const landZone = ' 📌';
const seaZoneBuilding = '🌊🪧';
const waterZoneBuilding = '💧🪧';
const landZoneBuilding = ' 🪧';

const cityNames = [
  'Tangerang',
  'Serang',
  'Cilegon',
  'Pandeglang',
  'Bintaro',
  'Maja'
];

const Game = () => {
  const [gameMap, setGameMap] = React.useState<any[]>([]);
  const [enableBtn, setEnableBtn] = React.useState<string>('');
  const [xy, setXY] = React.useState<[number,number]>([0,0]);
  const [xyStep, setXYStep] = React.useState<[number,number]>([0,0]);
  const [building, setBuilding] = React.useState<boolean>(false);
  const [action, setAction] = React.useState<string>('');
  const [cities, setCities] = React.useState<any>([]);

  const generateMap = (width: number, height: number) => {
    const position = {
      p1: Math.floor(height / (Math.floor(Math.random() * 4) + 3)),
      p2: 0,
      p3: 0,
      p4: 0,
    };

    position.p2 = position.p1 + 5;
    position.p3 = position.p2 + 4;
    position.p4 = position.p3 + 6;

    const map: any[] = [];
    Array.from(Array(height).keys()).forEach((h: any) => {
      map.push(h);
    });
    map.map((_m: any, mi: number) => {
      const cm: any[] = [];
      Array.from(Array(width).keys()).forEach((h: any) => {
        if (h === 0) {
          const firstCell = Math.floor(Math.random() * 3);
          cm.push([sea, water, land][firstCell]);
        }
        if (h > 0) {
          const nextCell = Math.floor(Math.random() * 3);
          switch (cm[h-1]) {
            case sea:
            case water:
              cm.push([sea, water, land][nextCell]);
              break;
            case land:
              cm.push([water, land, land][nextCell]);
              break;
          }
        }
      });

      let placed = false;

      const newCm: any[] = [];
      switch (mi) {
        case position.p1:
        case position.p3:
          for (let i = 0; i < cm.length; i++) {
            if (cm[i] === land && !placed) {
              newCm.push(settler);
              placed = true;
            } else {
              newCm.push(cm[i]);
            }
            map[mi] = newCm;
          }
          break;
        case position.p2:
        case position.p4:
          for (let i = cm.length; i > 1; i--) {
            if (cm[i] === land && !placed) {
              cm[i] = settler;
              placed = true;
            }
            map[mi] = cm;
          }
          break;
        default:
          map[mi] = cm;
          break;
      }
    });
    return map;
  }

  const getBgColor = (child: string) => {
    switch (child) {
      case sea:
        return 'bg-blue-300';
      case water:
        return 'bg-blue-100';
      case settler:
      case land:
        return 'bg-orange-100';
      case city:
      case 'city-zone':
        return 'bg-orange-200';
      case seaZone:
      case waterZone:
      case landZone:
      case seaZoneBuilding:
      case waterZoneBuilding:
      case landZoneBuilding:
        return 'bg-pink-700';
      case harbor:
        return 'bg-blue-800';
    }
  }

  const handleUnit = (unit: string) => {
    switch (unit) {
      case settler:

    }
  }

  const setUnitFn = (action: string, from?: any, to?: any) => {
    switch (action) {
      case 'settle':
        const newGM = gameMap.map((gm: any[], gmi: number) => {
          if (gmi === xy[0]) {
            return gm.map((gx: any, gxi: number) => {
              if (gxi === xy[1]) gx = city

              // record the city data
              const currentCity = cities.length;
              const payload = {
                name: cityNames[currentCity],
                building: [],
                loc: {
                  x: xy[0],
                  y: xy[1],
                }
              }
              setCities([...cities, payload]);
              return gx;
            });
          } else {
            return gm;
          }
        });
        setGameMap(newGM);
        setEnableBtn('');
        break;
      case 'building':
        setBuilding(true);
        break;
      case 'move':
        // clean up movement zone
        const moveGM = gameMap.map((gm: any[]) => gm.map((x: any) => {
          switch (x) {
            case seaZone:
              x = sea;
            case waterZone:
              x = water;
            case landZone:
              x = land;
          }
          return x;
        }));
        setXYStep([0,0]);
        setAction('move');
        // check movement cell
        moveGM.map((gm: any[], gmi: number) => {
          // horizontal
          if (gmi === xy[0]) {
            // horizontal -1 to left
            if (!!(gm[xy[1]-1])) {
              switch (gm[xy[1]-1]) {
                case sea:
                  // gm[xy[1]-1] = seaZone;
                  break;
                case water:
                  // gm[xy[1]-1] = waterZone;
                  break;
                case land:
                  gm[xy[1]-1] = landZone;
                  break;
              }
            }
            // horizontal +1 to right
            if (!!(gm[xy[1]+1])) {
              switch (gm[xy[1]+1]) {
                case sea:
                  // gm[xy[1]+1] = seaZone;
                  break;
                case water:
                  // gm[xy[1]+1] = waterZone;
                  break;
                case land:
                  gm[xy[1]+1] = landZone;
                  break;
              }
            }
            return gm;
          } else {
            return gm;
          }
        });
        // vertical
        if (!!moveGM[xy[0]-1][xy[1]]) {
          switch (moveGM[xy[0]-1][xy[1]]) {
            case sea:
              // moveGM[xy[0]-1][xy[1]] = seaZone;
              break;
            case water:
              // moveGM[xy[0]-1][xy[1]] = waterZone;
              break;
            case land:
              moveGM[xy[0]-1][xy[1]] = landZone;
              break;
          }
        }
        if (!!moveGM[xy[0]+1][xy[1]]) {
          switch (moveGM[xy[0]+1][xy[1]]) {
            case sea:
              // moveGM[xy[0]+1][xy[1]] = seaZone;
              break;
            case water:
              // moveGM[xy[0]+1][xy[1]] = waterZone;
              break;
            case land:
              moveGM[xy[0]+1][xy[1]] = landZone;
              break;
          }
        }
        setGameMap(moveGM);
        setXYStep(xy);
        setAction('step');
        break;
      case 'transport':
        // move from coordinate to coordinate
        const transportGM = gameMap[from[0]][from[1]];
        if (gameMap[to[0]][to[1]] === transportGM) {
          alert('there same unit type at targetted location');
          break;
        }
        gameMap[to[0]][to[1]] = gameMap[from[0]][from[1]];
        gameMap[from[0]][from[1]] = land;

        const postTransportGM = gameMap.map((gm: any[]) => gm.map((x: any) => {
          switch (x) {
            case seaZone:
              x = sea;
            case waterZone:
              x = water;
            case landZone:
              x = land;
          }
          return x;
        }));

        setGameMap(postTransportGM);
        setXYStep([0,0]);
        setAction('');
        break;
      case 'createBuilding':
        // clean up movement zone
        const buildingGM = gameMap.map((gm: any[]) => gm.map((x: any) => {
          switch (x) {
            case seaZoneBuilding:
              x = sea;
            case waterZoneBuilding:
              x = water;
            case landZoneBuilding:
              x = land;
          }
          return x;
        }));
        setXYStep([0,0]);
        setAction('');
        // check movement cell
        buildingGM.map((gm: any[], gmi: number) => {
          // horizontal
          if (gmi === xy[0]) {
            // horizontal -1 to left
            if (!!(gm[xy[1]-1])) {
              switch (gm[xy[1]-1]) {
                case sea:
                  gm[xy[1]-1] = seaZoneBuilding;
                  break;
                case water:
                  gm[xy[1]-1] = waterZoneBuilding;
                  break;
                case land:
                  // gm[xy[1]-1] = landZoneBuilding;
                  break;
              }
            }
            // horizontal +1 to right
            if (!!(gm[xy[1]+1])) {
              switch (gm[xy[1]+1]) {
                case sea:
                  gm[xy[1]+1] = seaZoneBuilding;
                  break;
                case water:
                  gm[xy[1]+1] = waterZoneBuilding;
                  break;
                case land:
                  // gm[xy[1]+1] = landZoneBuilding;
                  break;
              }
            }
            return gm;
          } else {
            return gm;
          }
        });
        // vertical
        if (!!buildingGM[xy[0]-1][xy[1]]) {
          switch (buildingGM[xy[0]-1][xy[1]]) {
            case sea:
              buildingGM[xy[0]-1][xy[1]] = seaZoneBuilding;
              break;
            case water:
              buildingGM[xy[0]-1][xy[1]] = waterZoneBuilding;
              break;
            case land:
              // buildingGM[xy[0]-1][xy[1]] = landZoneBuilding;
              break;
          }
        }
        if (!!buildingGM[xy[0]+1][xy[1]]) {
          switch (buildingGM[xy[0]+1][xy[1]]) {
            case sea:
              buildingGM[xy[0]+1][xy[1]] = seaZoneBuilding;
              break;
            case water:
              buildingGM[xy[0]+1][xy[1]] = waterZoneBuilding;
              break;
            case land:
              // buildingGM[xy[0]+1][xy[1]] = landZoneBuilding;
              break;
          }
        }
        setGameMap(buildingGM);
        setXYStep(xy);
        setAction('building');
        break;
      case 'transportBuilding':
        // create building at coordinate
        gameMap[to[0]][to[1]] = harbor;

        const postTransportBuildGM = gameMap.map((gm: any[]) => gm.map((x: any) => {
          switch (x) {
            case seaZoneBuilding:
              x = sea;
            case waterZoneBuilding:
              x = water;
            case landZoneBuilding:
              x = land;
          }
          return x;
        }));

        setGameMap(postTransportBuildGM);

        // record the building data for city
        const city = cities.map((cty: any) => {
          if (cty.loc.x === xy[0] && cty.loc.y === xy[1]) {
            cty.building = [
              ...cty.building,
              {
                type: 'harbor',
                buildNumber: cty.building.length +1,
                loc: {
                  x: to[0],
                  y: to[1],
                }
              }
            ];
            return cty;
          }
        })
        setCities(city);

        setXYStep([0,0]);
        setAction('');
        break;
    }
  }

  React.useEffect(() => {
    const map = generateMap(24, 24);
    setGameMap(map);
  }, []);

  const actions = (tipe: string, opts?: any) => {
    switch (tipe) {
      case 'move':
        setUnitFn('transport', [xy[0], xy[1]], opts);
        break;
      case 'building':
        setUnitFn('transportBuilding', [xy[0], xy[1]], opts);
        break;
      default:
        setEnableBtn(opts.gmChild);
        setXY([opts.gmi, opts.gmChildId]);
        break;
    }
  }

  return (
    <section className={`m-2 ${inter.className}`}>
      <Head>
        <title>NextCIV 0.0.1</title>
        <meta title="description" content="Experimental Civilization using React" />
      </Head>
      <section>
        {gameMap.map((gm: any[], gmi: number) => (
          <div key={gmi} className="flex">
            {gm.map((gmChild: any, gmChildId: number) =>
              <div
                key={gmChildId}
                onClick={() => {
                  let opts;
                  switch (action) {
                    case 'move':
                      opts = [gmi, gmChildId];
                      break;
                    case 'building':
                      opts = [gmi, gmChildId];
                      break;
                    default:
                      opts = {
                        gmi,
                        gmChildId,
                        gmChild
                      }
                      break;
                  }
                  actions(action, opts);
                }}
                className={`
                  p-2 ${getBgColor(gmChild)} ring-1 ring-orange-300
                  w-14 h-14 flex justify-center items-center
                  hover:bg-green-500/80 hover:text-white
                  select-none hover:ring-white
                  z-10 hover:z-40
                `}>
                {gmChild}
              </div>
            )}
          </div>
        ))}
      </section>
      <section className="space-x-4 flex items-center my-4">
        {[settler].includes(enableBtn) &&
          <>
            <div
              onClick={() => setUnitFn('move')}
              className="bg-red-500 text-white px-8 py-4 rounded-lg ring-2 ring-red-300 select-none cursor-pointer">
              Move
            </div>
            <div
              onClick={() => setUnitFn('settle')}
              className="bg-red-500 text-white px-8 py-4 rounded-lg ring-2 ring-red-300 select-none cursor-pointer">
              Settle Here
            </div>
          </>
        }
        {[builder].includes(enableBtn) &&
          <>
            <div className="bg-red-500 text-white px-8 py-4 rounded-lg ring-2 ring-red-300 select-none cursor-pointer">
              Move
            </div>
            <div className="bg-red-500 text-white px-8 py-4 rounded-lg ring-2 ring-red-300 select-none cursor-pointer">
              Build
            </div>
          </>
        }
        {[city].includes(enableBtn) &&
          <>
            <div>
              City Name: {cities.length && cities.filter((c: any) => c.loc.x === xy[0] && c.loc.y === xy[1])[0]?.name}
              {cities.length && (
                <div>
                  <div className="font-semibold">Building:</div>
                  {cities.filter((c: any) => c.loc.x === xy[0] && c.loc.y === xy[1])[0]?.building.map((bld: any, bldId: number) => (
                    <div key={bldId} className="capitalize">{bld.type}</div>
                  ))}
                </div>
              )}
            </div>
            <div
              onClick={() => setBuilding(true)}
              className="bg-green-600 text-white px-8 py-4 rounded-lg ring-2 ring-green-300 select-none cursor-pointer mr-8">
              Building
            </div>
            {building && (
              <>
                <div
                  onClick={() => { setUnitFn('createBuilding') }}
                  className="bg-white text-black px-8 py-4 rounded-lg ring-2 ring-red-300 select-none cursor-pointer">
                  {harbor} Harbor
                </div>
                <div
                  onClick={() => { setBuilding(false) }}
                  className="bg-white text-black px-8 py-4 rounded-lg ring-2 ring-red-300 select-none cursor-pointer">
                  {police} Unit Police
                </div>
              </>
            )}
          </>
        }
      </section>
    </section>
  )
}

export default Game;
