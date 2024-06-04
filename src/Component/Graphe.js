import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { useState,useEffect } from 'react';
import {Button} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Colors from '../Utils.js/Colors';
const chartSetting = {
  yAxis: [
    {
      label: 'nombre de signalement',
    },
  ],
  
  // width: 500,
  // height: 500,
  sx: {
    [`.${axisClasses.left} .${axisClasses.label}`]: {
      transform: 'translate(-20px, 0)',
    },
  },
};


const valueFormatter = (value) => `${value} signalements`;

export  const GrapheData=({dataset,mapCIPtoNom,dimensions,handleCloseGrapheButton})=> {
    const [seriesLst, setSeriesLst] = useState([])
    const [formattedDataSet, setFormattedDataSet] = useState([])
    useEffect(()=>{
        console.log(dataset);
        const medicamentsSet=new Set()
        let tmpFormattedDataSet=[]
        for(let ligne of dataset){
            console.log(ligne);
            let lstCIP=Object.keys(ligne)
            let tmp={}
            tmp.date=ligne.date
            for(let cip of lstCIP){
                // let name=mapCIPtoNom[cip]
                if(cip==='date'){
                    continue
                }
                let denomination=mapCIPtoNom[cip]
                tmp[denomination]= ligne[cip]
                medicamentsSet.add(denomination)    
            }
            console.log(tmp);
            tmpFormattedDataSet.push(tmp);
        }
        let tmpSeriesLst=[]
        for(let medicament of medicamentsSet){
            tmpSeriesLst.push({dataKey:medicament,label:medicament,valueFormatter})
        }
        setFormattedDataSet(tmpFormattedDataSet.sort((a, b) => new Date(a.date) - new Date(b.date)))
        setSeriesLst(tmpSeriesLst)
    
    },[dataset,mapCIPtoNom])
    
    return (
      <div>                
        <Button  style={{position:"absolute", right:50, zIndex:999} }onClick={handleCloseGrapheButton}> 
          <CloseIcon style={{width:50,height:50,color:Colors.vertFonce}}></CloseIcon>
         </Button>
        <BarChart
                dataset={formattedDataSet}
                xAxis={[{ scaleType: 'band', dataKey: 'date' }]}
                series={seriesLst}
                width={dimensions.width}
                height={dimensions.height}
                {...chartSetting}
              />
      </div>

  );
}
