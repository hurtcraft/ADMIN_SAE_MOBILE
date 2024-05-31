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
import { Button, Grid, ButtonGroup, IconButton } from "@mui/material";
import "./App.css";
import FilterBox from "./Component/FilterBox";
import Colors from "./Utils.js/Colors";

import TimelineIcon from '@mui/icons-material/Timeline';
import MapIcon from '@mui/icons-material/Map';
import { useState,useEffect, useRef} from "react";
import { getData } from "./Utils.js/FetchData";
import { parseCoordinates } from "./Utils.js/ParseData";
import GrapheData from "./Component/Graphe";
function App() {
  const [pharmacies, setPharmacies] = useState({});
  const pharmacieRequest = process.env.REACT_APP_IP_SERVER + "pharmacies/allPharmacies";
  useEffect(() => {
    getData(pharmacieRequest, setPharmacies);
  }, []);

  const [medicaments, setMediaments] = useState([]);
  const medicamentsRequest =
    process.env.REACT_APP_IP_SERVER + "medicaments/allMedicaments";

  useEffect(() => {
    getData(medicamentsRequest, setMediaments);
  }, []);
  const [signalements,setSignalements] = useState([]);
  const [pharmaciesSignaler,setPharmaciesSignaler] = useState([]);

  const [mapCIPtoNom,setMapCipToNom]=useState({})
  // delete Object.assign(o, {[newKey]: o[oldKey] })[oldKey];
  const cacheCIPtoNom={}

  useEffect(()=>{
    if(Object.keys(mapCIPtoNom).length===0 || signalements.length===0){
      return;
    }  

    let tmp=[]
    // console.log(signalements);
    for (let key of Object.keys(signalements)) {
      let pharmacie=pharmacies[key-1]
      let signalement=signalements[key-1];
      if(signalement===undefined){
        continue;
      }
      console.log(signalement);
      // console.log(pharmacie);
      let dateTomedicamentToNbSignalement=signalement.dateTomedicamentToNbSignalement;
      console.log(dateTomedicamentToNbSignalement);
      for (let date of Object.keys(dateTomedicamentToNbSignalement)){
        let content =dateTomedicamentToNbSignalement[date]; 
        console.log(content);
        for (let cip13 of Object.keys(content)){
          // let denomination=findDenominationWithCIP(cip13);
          // console.log(findDenominationWithCIP(cip13));
          console.log(cip13);
          console.log(medicaments[cip13]);
        } 
      }
      let coord=parseCoordinates(pharmacie.coordonneesXY) 
      let codePostale=pharmacie.codePostale
      let nomPharmacie=pharmacie.nomPharmacie
      
      tmp.push({nomPharmacie:nomPharmacie, coord:coord, codePostale:codePostale ,signalement:signalement})
    }
    setPharmaciesSignaler(tmp);
    },[signalements,mapCIPtoNom])
  
    useEffect(()=>{
      console.log("mdzq");
      let tmp={}
      for(let ligne of medicaments){
        tmp[ligne.cip13]=ligne.denomination
      }
      setMapCipToNom(tmp);


    },[medicaments])
    useEffect(()=>{
      console.log(mapCIPtoNom);
    },[mapCIPtoNom])
  return (
    <div>
      {/* <ResponsiveAppBar />
      <MapSignalement /> */}
      <ResponsiveAppBar />

      <div style={styles.gridContainer}>
        <ButtonGroup variant="outlined" aria-label="Basic button group"  >
              <Button size="large" style={{ color: Colors.vertFonce,borderWidth:2,borderColor:Colors.vertFonce }}  startIcon={<MapIcon />} ></Button>
              <Button size="large" style={{ color: Colors.vertFonce,borderWidth:2,borderColor:Colors.vertFonce }} endIcon={<TimelineIcon/>} ></Button>
        </ButtonGroup>
        <Grid container gap={8}>
          
          <Grid div lg={8.5} sm={12}>
            <div style={styles.item}>
              <MapSignalement pharmaciesSignaler={pharmaciesSignaler} mapCIPtoNom={mapCIPtoNom} />
            </div>
          </Grid>

          <Grid div lg={2.8} md={12} sm={12}>

            <div style={styles.item}>
              <FilterBox pharmacies={pharmacies} setPharmacies={setPharmacies} setSignalements={setSignalements} medicaments={medicaments} setMediaments={setMediaments}></FilterBox>
            </div>
          </Grid>

          <Grid div xs={3}>
            <div style={styles.item}>
            </div>
          </Grid>

          <Grid div xs={0}>
            <div style={styles.item}>xs=8</div>
          </Grid>
        </Grid>
      </div>
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
  choiceBtn:{
    borderWidth: 1,
    borderColor:"black",
    borderStyle: "solid", // added borderStyle to make border visible
    borderRadius: -1,

  }
};
export default App;
