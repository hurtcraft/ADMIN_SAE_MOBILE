import {  useState, useCallback } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { matchSorter } from 'match-sorter';
import { Button, Card, Chip } from "@mui/material";
import Colors from "../Utils.js/Colors";
const filterOptions = (options, { inputValue }) => matchSorter(options, inputValue);

const FilterBoxSearchBar = ({ data, label,selectedItems, setSelectedItems }) => {
  const [searchQuery, setSearchQuery] = useState("");
  // const [selectedItems, setSelectedItems] = useState([]);

  const handleInputChange = (event, value) => {
    setSearchQuery(value);
  };

  const handleSelectionChange = (event, value) => {
    if (value && !selectedItems.includes(value)) {
      setSelectedItems((prevItems) => [...prevItems, value]);
      setSearchQuery("");
    }
  };

  const handleDelete = useCallback((itemToDelete) => () => {
    setSelectedItems((prevItems) => prevItems.filter((item) => item !== itemToDelete));
  }, []);

  const handleClearAll = () => {
    setSelectedItems([]);
  };

  // useEffect(() => {
  //   const url=process.env.REACT_APP_IP_SERVER+"admin/getSignalementsFromFilter";
  //   fetch(url, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       "regions": ["Île-de-France", "Provence-Alpes-Côte d'Azur"],
  //       "codesPostales": ["75001", "13001"],
  //       "medicaments": ["3400949497706"],
  //       "debut": "2020-05-27T15:30:00.123456Z",
  //       "fin": "2024-05-27T15:30:00.123456Z"
  //     })
  //   })
  //     .then((response) => response.json())
  //     .then((data) => {
  //       console.log(data);
  //     })
  //     .catch((error) => {
  //       console.error("Erreur lors de l'envoi des données:", error);
  //     });
  //   console.log(selectedItems);
  //   setSubmit(false);
  
  // },[submit])

  return (
    <div>
      <div style={{display:"flex",flexDirection:"row",gap:"10px",alignItems: "center",justifyContent: "center"}}> 
      <Autocomplete
        filterOptions={filterOptions}
        disablePortal
        id="combo-box-demo"
        options={data}
        value={searchQuery}
        onChange={handleSelectionChange}
        inputValue={searchQuery}
        onInputChange={handleInputChange}
        sx={{ width: "80%"}}
        size="small"
        renderInput={(params) => (
          <TextField {...params} label={label} />
        )}
      />
      <Button size="small" variant="contained" style={{width:"10%",height:"80%",backgroundColor:Colors.vertFonce}} onClick={handleClearAll} >
            effacer
      </Button>
      </div>

      <Card style={{ marginTop: "5%", marginBottom: "5%", padding: "10px" }}>
        {selectedItems.map((item, index) => (
          <Chip
            key={index}
            label={item}
            variant="outlined"
            onDelete={handleDelete(item)}
            style={{
              margin: "5px",
              maxWidth: "200px", // Limite la largeur maximale
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
            size="small"
          />
        ))}

      </Card>
    </div>
  );
};

export default FilterBoxSearchBar;
