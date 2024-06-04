import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { grahamScan } from "../Utils.js/Compute";
// import "../CSS/Map.css";
import { Polygon } from "react-leaflet";
import { GrapheData } from "../Component/Graphe";
// import { polygon } from 'leaflet';
import { Grow } from "@mui/material";
const PARIS = [48.866667, 2.333333];
const purpleOptions = { color: "purple" };
const selectedOptions = { color: "red" }; // New color for selected polygon

function MapSignalement({ pharmaciesSignaler, mapCIPtoNom }) {
  const [codePostaleToSignalements, setCodePostaleToSignalements] = useState(
    {}
  );

  const formatSignalement = (signalement) => {
    let res = {};
    let dateToMedicamentToSignalement = signalement;
    // console.log(dateToMedicamentToSignalement);
    for (let date of Object.keys(dateToMedicamentToSignalement)) {
      let content = dateToMedicamentToSignalement[date];
      for (let key of Object.keys(content)) {
        // console.log(content[key]);
        res.date = key;
        for (let cip13 of Object.keys(content[key])) {
          res[cip13] = content[key][cip13];
        }
      }
    }
    // console.log(res);
    return res;
  };
  useEffect(() => {
    // console.log(pharmaciesSignaler);

    let codePostaleToSignalementsTmp = {};
    for (let key of Object.keys(pharmaciesSignaler)) {
      let pharmaciesSignalerTmp = pharmaciesSignaler[key];

      let coord = pharmaciesSignalerTmp.coord;
      let codePostale = pharmaciesSignalerTmp.codePostale;
      let signalement = pharmaciesSignalerTmp.signalement;

      if (codePostaleToSignalementsTmp[codePostale] === undefined) {
        codePostaleToSignalementsTmp[codePostale] = {
          listeSignalements: [],
          listeCoords: [],
        };
      }
      console.log(formatSignalement(signalement));
      codePostaleToSignalementsTmp[codePostale].listeSignalements.push(
        formatSignalement(signalement)
      );
      codePostaleToSignalementsTmp[codePostale].listeCoords.push(coord);
      // coordsTmp.push(coord)
    }

    for (let key of Object.keys(codePostaleToSignalementsTmp)) {
      let cts = codePostaleToSignalementsTmp[key];
      cts.listeCoords = grahamScan(cts.listeCoords);
    }
    setCodePostaleToSignalements(codePostaleToSignalementsTmp);
    console.log(codePostaleToSignalementsTmp);

    // setCoords(grahamScan(coordsTmp))
    // console.log(codePostaleToSignalementsTmp);
    // console.log("azdbza")
    // console.log(coords);
  }, [pharmaciesSignaler]);

  useEffect(() => {
    // console.log(codePostaleToSignalements);
  }, [codePostaleToSignalements]);

  const [showGraphe, setShowGraphe] = useState(false);
  const [signalementData, setSignalementsData] = useState([]);
  const [selectedPolygon, setSelectedPolygon] = useState(null); // State for selected polygon

  const polygonClickHandler = (codePostale) => {
    let content = codePostaleToSignalements[codePostale];
    setSelectedPolygon(codePostale);
    setShowGraphe(true);
    setSignalementsData(content.listeSignalements);
  };
  // useEffect(() => {
  //   setShowGraphe(true);
  // }, [signalementData]);

  const refContainer = useRef();
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const updateDimensions = () => {
      if (refContainer.current) {
        setDimensions({
          width: refContainer.current.offsetWidth,
          height: refContainer.current.offsetHeight,
        });
      }
    };

    window.addEventListener("resize", updateDimensions);
    updateDimensions(); // Initial dimensions

    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);


  const handleCloseGrapheButton = () => {
    setSelectedPolygon(null);
    setShowGraphe(false);
  };

  return (
    <div
      style={{ position: "relative", height: "82vh", width: "100%" }}
      ref={refContainer}
    >
      <MapContainer
        center={PARIS}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* Polygones */}
        {Object.keys(codePostaleToSignalements).map((key) => (
          <Polygon
            key={key}
            pathOptions={
              selectedPolygon === key ? selectedOptions : purpleOptions
            }
            positions={codePostaleToSignalements[key].listeCoords}
            eventHandlers={{
              click: (e) => {
                polygonClickHandler(key);
              },
            }}
          />
        ))}
      </MapContainer>
      {/* Div par-dessus la carte */}

      {showGraphe ? (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "80vh",
            zIndex: 999,
          }}
        >
          <div
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.7)",
              padding: "10px",
              height: "80vh",
              width: "100%",
            }}
          >
            <Grow
              in={showGraphe}
              style={{ transformOrigin: "0 0 0" }}
              {...(showGraphe ? { timeout: 500 } : {})}
            >
              <div>
                <GrapheData
                  dataset={signalementData}
                  mapCIPtoNom={mapCIPtoNom}
                  dimensions={dimensions}
                  handleCloseGrapheButton={handleCloseGrapheButton}
                ></GrapheData>
              </div>
            </Grow>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default MapSignalement;
