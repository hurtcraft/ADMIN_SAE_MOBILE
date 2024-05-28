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
function App() {
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
              <MapSignalement />
            </div>
          </Grid>

          <Grid div lg={2.8} md={12} sm={12}>

            <div style={styles.item}>
              <FilterBox></FilterBox>
            </div>
          </Grid>

          <Grid div xs={3}>
            <div style={styles.item}>xs=4</div>
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
