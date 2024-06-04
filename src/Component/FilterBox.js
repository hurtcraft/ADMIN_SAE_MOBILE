import { useEffect, useState } from "react";

import { Box } from "@mui/material";
import FilterBoxSearchBar from "./FilterBoxSearchBar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { IconButton, Typography } from '@mui/material';
import Colors from "../Utils.js/Colors";
import { DatePicker } from "@mui/x-date-pickers";
import Alert from '@mui/material/Alert';
import {Fade} from "@mui/material";
import { LoadingButton } from "@mui/lab";


const FilterBox = ({pharmacies,setPharmacies,setSignalements,medicaments,setMediaments}) => {
  //PARTIE MEDICAMENTS PHARMACIE
  

  const [codePostales, setCodePostales] = useState([]);
  const [regions, setRegions] = useState([]);
  const [departements, setDepartements] = useState([]);
  useEffect(() => {
    const uniqueCodePostales = new Set();
    const uniqueRegion = new Set();
    const uniqueDepartements = new Set();
    for (let key of Object.keys(pharmacies)) {
      let pharmacy=pharmacies[key]
      uniqueCodePostales.add(pharmacy.codePostale);
      uniqueRegion.add(pharmacy.region);
      uniqueDepartements.add(pharmacy.departement);
    }
    // pharmacies.forEach((pharmacy) => {
    //   uniqueCodePostales.add(pharmacy.codePostale);
    //   uniqueRegion.add(pharmacy.region);
    //   uniqueDepartements.add(pharmacy.departement);
    // });
    setCodePostales([...uniqueCodePostales].sort());
    setRegions([...uniqueRegion].sort());
    setDepartements([...uniqueDepartements].sort());

  }, [pharmacies]);

  //PARTIE MEDICAMENTS

  const [nomMedicaments, setNomMedicaments] = useState([]);

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
    if(selectedCodePostales.length===0 &&
      selectedRegions.length===0 &&
      selectedDepartements.length===0 &&
      selectedMedicaments.length===0){
        setinputError(true)
      }
  }
  const handleSubmit=()=>{
    checkInput();
    if(dateDebut>dateFin || dateDebut===null || dateFin===null){
      setdateError(true);
      return;
    }
    setdateError(false);
    setinputError(false);
    setLoading(true)
    const url=process.env.REACT_APP_IP_SERVER+"admin/getSignalementsFromFilter";
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
        setSignalements(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur lors de l'envoi des données:", error);
      });
  }
  const [loading,setLoading]=useState(false);
  
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
                <DatePicker defaultValue={new Date()} value={dateDebut} onChange={(newValue) => setdateDebut(newValue)} format="DD/MM/YYYY" label="date début" />
                <DatePicker value={dateFin} onChange={(newValue) => setdateFin(newValue)}  format="DD/MM/YYYY" label="date fin"/>
              </Box>
              {dateError ? (
                        <Fade in={dateError}>
                          <Alert severity="warning" onClose={() => {setdateError(false)}}>la plage de date saisie est elle correct ?</Alert>
                        </Fade>

              ) : (null)}

            </LocalizationProvider>
            <Box style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <LoadingButton loading={loading} onClick={handleSubmit} variant="contained" style={{ padding:10,marginBottom:"5px", backgroundColor:Colors.vertFonce }}>
                    Rechercher
              </LoadingButton>
            </Box>

          </div>


          
          </div>
      ) : (
        null
      )}
    </div>
    

  );
};

export default FilterBox;
