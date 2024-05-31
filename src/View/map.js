import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { grahamScan } from '../Utils.js/Compute';
// import "../CSS/Map.css";
import { Polygon } from 'react-leaflet';
import { GrapheData } from '../Component/Graphe';
import { Button } from '@mui/material';
import { polygon } from 'leaflet';
const PARIS=[48.866667,2.333333]
const purpleOptions = { color: 'purple' }
const d = [
    {
      london: 59,
      paris: 57,
      newYork: 86,
      seoul: 21,
      month: 'Jan',
    },
    {
      london: 50,
      paris: 52,
      newYork: 78,
      seoul: 28,
      month: 'Fev',
    },
    {
      london: 47,
      paris: 53,
      newYork: 106,
      seoul: 41,
      month: 'Mar',
    },
    {
      london: 54,
      paris: 56,
      newYork: 92,
      seoul: 73,
      month: 'Apr',
    },
    {
      london: 57,
      paris: 69,
      newYork: 92,
      seoul: 99,
      month: 'May',
    },
    {
      london: 60,
      paris: 63,
      newYork: 103,
      seoul: 144,
      month: 'June',
    },
    {
      london: 59,
      paris: 60,
      newYork: 105,
      seoul: 319,
      month: 'July',
    },
    {
      london: 65,
      paris: 60,
      newYork: 106,
      seoul: 249,
      month: 'Aug',
    },
    {
      london: 51,
      paris: 51,
      newYork: 95,
      seoul: 131,
      month: 'Sept',
    },
    {
      london: 60,
      paris: 65,
      newYork: 97,
      seoul: 55,
      month: 'Oct',
    },
    {
      london: 67,
      paris: 64,
      newYork: 76,
      seoul: 48,
      month: 'Nov',
    },
    {
      london: 61,
      paris: 70,
      newYork: 103,
      seoul: 25,
      month: 'Dec',
    },
  ];
function MapSignalement({pharmaciesSignaler,mapCIPtoNom}) {
    const [coords,setCoords]= useState({})
    const [codePostaleToSignalements,setCodePostaleToSignalements] = useState({})

    const formatSignalement=(signalement)=>{
        let res={}
        let dateToMedicamentToSignalement=signalement
        // console.log(dateToMedicamentToSignalement);
        for (let date of Object.keys(dateToMedicamentToSignalement)) {
            
            let content=dateToMedicamentToSignalement[date]
            for (let key of Object.keys(content)){
                // console.log(content[key]);
                res.date=key
                for(let cip13 of Object.keys(content[key])){
                    res[cip13]=content[key][cip13]
                }
            }
            
        }
        // console.log(res);
        return res
    }
    useEffect(()=>{
        // console.log(pharmaciesSignaler);
        
        let codePostaleToSignalementsTmp={}
        for (let key of Object.keys(pharmaciesSignaler)) {
            let pharmaciesSignalerTmp=pharmaciesSignaler[key];
            
            let coord=pharmaciesSignalerTmp.coord;
            let codePostale=pharmaciesSignalerTmp.codePostale
            let signalement=pharmaciesSignalerTmp.signalement
            
            if(codePostaleToSignalementsTmp[codePostale]===undefined){
                codePostaleToSignalementsTmp[codePostale] = { listeSignalements: [], listeCoords:[] };
            }
            console.log(formatSignalement(signalement));
            codePostaleToSignalementsTmp[codePostale].listeSignalements.push(formatSignalement(signalement));
            codePostaleToSignalementsTmp[codePostale].listeCoords.push(coord);
            // coordsTmp.push(coord)
        }

        for (let key of Object.keys(codePostaleToSignalementsTmp)) {
            let cts=codePostaleToSignalementsTmp[key]
            cts.listeCoords=grahamScan(cts.listeCoords)
        }
        setCodePostaleToSignalements(codePostaleToSignalementsTmp)
        console.log(codePostaleToSignalementsTmp);

        // setCoords(grahamScan(coordsTmp))
        // console.log(codePostaleToSignalementsTmp);
        // console.log("azdbza")
        // console.log(coords);
    } ,[pharmaciesSignaler])

    useEffect(()=>{
        // console.log(codePostaleToSignalements);
    },[codePostaleToSignalements])

    const [showGraphe,setShowGraphe]= useState(false)
    const [signalementData,setSignalementsData]= useState([])
    const polygonClickHandler=(codePostale)=>{
        let content=codePostaleToSignalements[codePostale];
        console.log(content.listeSignalements);
        setSignalementsData(content.listeSignalements);
    }
    useEffect(()=>{
        setShowGraphe(true)

    },[signalementData])   
    return (
            <div style={{ position: 'relative', height: '82vh', width: '100%' }}>
        <MapContainer center={PARIS} zoom={13} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}> 
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {/* Polygones */}
            {Object.keys(codePostaleToSignalements).map((key) => (
                <Polygon key={key} pathOptions={purpleOptions} positions={codePostaleToSignalements[key].listeCoords} 
                    eventHandlers={{
                        click: (e) => {
                            polygonClickHandler(key)
                        },
                }}  />
            ))}
        </MapContainer>
        {/* Div par-dessus la carte */}

        {showGraphe? (<div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '80vh', zIndex: 999 }}>
            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)', padding: '10px',height: '80vh',width: '100%' }}>
                Contenu de la div par-dessus la carte
                <GrapheData dataset={signalementData} mapCIPtoNom={mapCIPtoNom} ></GrapheData>
                <Button onClick={()=>{setShowGraphe(false)}}>fermer</Button>
            </div>
        </div>) : (null)}

        
    </div>
    );
}

export default MapSignalement;
