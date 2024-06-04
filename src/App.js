// import './App.css';
// import Login from './component/login';
// function App() {
//   return (
//     <div className="App">
//       <Login></Login>
//     </div>
//   );
// }
import ResponsiveAppBar from "./Component/TabBar";
import MapSignalement from "./View/map";
import {  Grid } from "@mui/material";
import "./App.css";
import FilterBox from "./Component/FilterBox";
import Colors from "./Utils.js/Colors";


import { useState, useEffect } from "react";
import { getData, getToken } from "./Utils.js/FetchData";
import { parseCoordinates } from "./Utils.js/ParseData";
import { Slide } from "@mui/material";
import { Zoom } from "@mui/material";
import Login from "./Component/Login";
function App() {
  const [isConnected, setIsConnected] = useState(false);
  useEffect(() => {
    if (getToken() !== null) {
      setIsConnected(true);
    }
  }, []);
  console.log(getToken());
  const [pharmacies, setPharmacies] = useState({});
  const pharmacieRequest =
    process.env.REACT_APP_IP_SERVER + "pharmacies/allPharmacies";
  useEffect(() => {
    getData(pharmacieRequest, setPharmacies);
  }, []);



  const [medicaments, setMediaments] = useState([]);
  const medicamentsRequest =
    process.env.REACT_APP_IP_SERVER + "medicaments/allMedicaments";

  useEffect(() => {
    getData(medicamentsRequest, setMediaments);
  }, []);
  const [signalements, setSignalements] = useState([]);
  const [pharmaciesSignaler, setPharmaciesSignaler] = useState([]);

  const [mapCIPtoNom, setMapCipToNom] = useState({});

  useEffect(() => {
    if (Object.keys(mapCIPtoNom).length === 0 || signalements.length === 0) {
      return;
    }

    let tmp = [];
    for (let key of Object.keys(signalements)) {
      let pharmacie = pharmacies[key - 1];
      let signalement = signalements[key - 1];
      if (signalement === undefined) {
        continue;
      }
      // console.log(pharmacie);

      let coord = parseCoordinates(pharmacie.coordonneesXY);
      let codePostale = pharmacie.codePostale;
      let nomPharmacie = pharmacie.nomPharmacie;

      tmp.push({
        nomPharmacie: nomPharmacie,
        coord: coord,
        codePostale: codePostale,
        signalement: signalement,
      });
    }
    setPharmaciesSignaler(tmp);
  }, [signalements, mapCIPtoNom]);

  useEffect(() => {
    let tmp = {};
    for (let ligne of medicaments) {
      tmp[ligne.cip13] = ligne.denomination;
    }
    setMapCipToNom(tmp);
  }, [medicaments]);



  return (
    <div>
      {/* <ResponsiveAppBar />
      <MapSignalement /> */}

      {!isConnected ? (
        <Login setIsConnected={setIsConnected}></Login>
      ) : (
        <div>
          <Slide in={true} timeout={300}>
            <div>
              <ResponsiveAppBar setIsConnected={setIsConnected} />
            </div>
          </Slide>
          <div style={styles.gridContainer}>
            <Grid container gap={8}>
              <Grid div lg={8.5} sm={12}>
                <Zoom in={pharmacies.length > 0} timeout={500}>
                  <div style={styles.item}>
                    <MapSignalement
                      pharmaciesSignaler={pharmaciesSignaler}
                      mapCIPtoNom={mapCIPtoNom}
                    />
                  </div>
                </Zoom>
              </Grid>

              <Grid div lg={2.8} md={12} sm={12}>
                <Slide in={pharmacies.length > 0} direction="up" timeout={300}>
                  <div style={styles.item}>
                    <FilterBox
                      pharmacies={pharmacies}
                      setPharmacies={setPharmacies}
                      setSignalements={setSignalements}
                      medicaments={medicaments}
                      setMediaments={setMediaments}
                    ></FilterBox>
                  </div>
                </Slide>
              </Grid>

              
            </Grid>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  gridContainer: {
    padding: "2%",
  },
  item: {
    backgroundColor: Colors.vertClair,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "black",
    borderStyle: "solid", // added borderStyle to make border visible
  },
  choiceBtn: {
    borderWidth: 1,
    borderColor: "black",
    borderStyle: "solid", // added borderStyle to make border visible
    borderRadius: -1,
  },
};
export default App;
