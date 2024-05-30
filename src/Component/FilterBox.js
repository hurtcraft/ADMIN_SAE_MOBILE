import { useEffect, useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { Button, Card, Chip,Box } from "@mui/material";
import FilterBoxSearchBar from "./FilterBoxSearchBar";
import { getData } from "../Utils.js/FetchData";
import userEvent from "@testing-library/user-event";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { IconButton, Typography } from '@mui/material';
import Colors from "../Utils.js/Colors";
import { DatePicker } from "@mui/x-date-pickers";
import Alert from '@mui/material/Alert';
import {Fade} from "@mui/material";
const data = [
  "Paris",
  "London",
  "New York",
  "Tokyo",
  "Berlin",
  "Buenos Aires",
  "Cairo",
  "Canberra",
  "Rio de Janeiro",
  "Dublin",
];

const FilterBox = () => {
  //PARTIE MEDICAMENTS PHARMACIE
  const [pharmacies, setPharmacies] = useState([]);
  const pharmacieRequest =
    process.env.REACT_APP_IP_SERVER + "pharmacies/allPharmacies";

  const [codePostales, setCodePostales] = useState([]);
  const [regions, setRegions] = useState([]);
  const [departements, setDepartements] = useState([]);

  useEffect(() => {
    getData(pharmacieRequest, setPharmacies);
  }, []);

  useEffect(() => {
    const uniqueCodePostales = new Set();
    const uniqueRegion = new Set();
    const uniqueDepartements = new Set();

    pharmacies.forEach((pharmacy) => {
      uniqueCodePostales.add(pharmacy.codePostale);
      uniqueRegion.add(pharmacy.region);
      uniqueDepartements.add(pharmacy.departement);
    });
    setCodePostales([...uniqueCodePostales].sort());
    setRegions([...uniqueRegion].sort());
    setDepartements([...uniqueDepartements].sort());
  }, [pharmacies]);

  //PARTIE MEDICAMENTS
  const [medicaments, setMediaments] = useState([]);
  const medicamentsRequest =
    process.env.REACT_APP_IP_SERVER + "medicaments/allMedicaments";

  const [nomMedicaments, setNomMedicaments] = useState([]);
  useEffect(() => {
    getData(medicamentsRequest, setMediaments);
  }, []);

  useEffect(() => {
    const uniqueMedicament = new Set();
    medicaments.forEach((m) => {
      uniqueMedicament.add(m.denomination+" CIP"+m.cip13);
    });
    setNomMedicaments([...uniqueMedicament].sort());
  }, [medicaments]);

  const extractCIPCode=(str)=>{
    const cipPattern = /CIP(\d{13})/;
    const match = str.match(cipPattern);
    return match ? match[1] : null;
  }
  const getListOfCIPCode=(list)=> {
    return list.map(item => extractCIPCode(item));
  }

  
  const [selectedCodePostales,setSelectedCodePostales] = useState([])
  const [selectedRegions,setSelectedRegions]=useState([])
  const [selectedDepartements,setSelectedDepartements] = useState([])
  const [selectedMedicaments,setSelectedMedicaments]=useState([])
  const [dateDebut, setdateDebut] = useState(null);
  const [dateFin, setdateFin] = useState(null);
  const [dateError, setdateError] = useState(false);  
  const [inputError, setinputError] = useState(false)
  const checkInput=()=>{
    if(selectedCodePostales.length==0 &&
      selectedRegions.length==0 &&
      selectedDepartements.length==0 &&
      selectedMedicaments.length==0){
        setinputError(true)
      }
  }
  const handleSubmit=()=>{
    checkInput();
    console.log(dateDebut);
    if(dateDebut>dateFin || dateDebut===null || dateFin===null){
      console.log("iciciicsq");
      setdateError(true);
      return;
    }
    const url=process.env.REACT_APP_IP_SERVER+"admin/test";
    console.log("fetching data");
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "regions": selectedRegions,
        "codesPostales": selectedCodePostales,
        "departements": selectedDepartements,
        "medicaments": getListOfCIPCode(selectedMedicaments),
        "debut": dateDebut.format('YYYY-MM-DD'),
        "fin": dateFin.format('YYYY-MM-DD')
      })
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error("Erreur lors de l'envoi des données:", error);
      });

    
    console.log();
  }
  
  return (
    <div>
      {pharmacies.length > 0 ? (
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              
            }}
          >
            <div style={{display:"flex",flexDirection:"column",padding:8}}>
            <IconButton>
              <FilterAltIcon />
            </IconButton>
            <Typography variant="body1">Filtrer</Typography>
            </div>

            {inputError? (
                          <Fade in={inputError}>
                            <Alert severity="warning" onClose={() => {setinputError(false)}}>selectionnez quelques filtres pour me faire plaisir :/</Alert>
                          </Fade>

                ) : (null)}
          </div>
          <FilterBoxSearchBar data={regions} label={"Régions"} selectedItems={selectedRegions} setSelectedItems={setSelectedRegions}/>
          <FilterBoxSearchBar data={departements} label={"Départements"} selectedItems={selectedDepartements} setSelectedItems={setSelectedDepartements}/>
          <FilterBoxSearchBar data={codePostales} label={"Code postales"} selectedItems={selectedCodePostales} setSelectedItems={setSelectedCodePostales}/>
          <FilterBoxSearchBar data={nomMedicaments} label={"Médicaments"}  selectedItems={selectedMedicaments} setSelectedItems={setSelectedMedicaments}/> 

          <div style={{gap: 25,display: "flex",flexDirection:"column",alignItems: "center"}}> 

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Box style={{ width: '90%', height: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', gap: '16px' }}>
                <DatePicker defaultValue={new Date()} value={dateDebut} onChange={(newValue) => setdateDebut(newValue)} label="date début" />
                <DatePicker value={dateFin} onChange={(newValue) => setdateFin(newValue)} label="date fin"/>
              </Box>
              {dateError ? (
                        <Fade in={dateError}>
                          <Alert severity="warning" onClose={() => {setdateError(false)}}>la plage de date saisie est elle correct ?</Alert>
                        </Fade>

              ) : (null)}

            </LocalizationProvider>
            <Box style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Button onClick={handleSubmit} variant="contained" style={{ padding:10,marginBottom:"5px", backgroundColor:Colors.vertFonce }}>
                    Rechercher
              </Button>
            </Box>

          </div>


          
        </div>
      ) : (
        <p>chargement</p>
      )}
    </div>
  );
};

export default FilterBox;
