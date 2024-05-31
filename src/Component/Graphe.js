import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { useState,useEffect } from 'react';
const chartSetting = {
  yAxis: [
    {
      label: 'nombre de signalement',
    },
  ],
  width: 1000,
  height: 500,
  sx: {
    [`.${axisClasses.left} .${axisClasses.label}`]: {
      transform: 'translate(-20px, 0)',
    },
  },
};


const valueFormatter = (value) => `${value} signalements`;

export  const GrapheData=({dataset,mapCIPtoNom})=> {
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
        setFormattedDataSet(tmpFormattedDataSet)
        setSeriesLst(tmpSeriesLst)
    
    },[dataset,mapCIPtoNom])
    
    return (
    <BarChart
    
      dataset={formattedDataSet}
      xAxis={[{ scaleType: 'band', dataKey: 'date' }]}
      series={seriesLst}
      {...chartSetting}
    />
  );
}
