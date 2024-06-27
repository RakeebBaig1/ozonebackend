const asyncHandler = require("express-async-handler")
const Location = require('../models/baseLocations') 


module.exports.getUvReport = asyncHandler(async(req, res, next)=>{

    let dailyHighestvalues = {}
    const valuesByDates = {};

    const DailyReport = ()=>{
        const highestValuesByDates = {};
        for (const date in valuesByDates) {
            const dateArray = valuesByDates[date];
            let highest_value = null;

            dateArray.forEach(item => {
                if (!highest_value || item.UV_A_Value > highest_value.UV_A_Value) {
                    highest_value = item;
                }
            });
            highestValuesByDates[date] = highest_value
        }
        return highestValuesByDates;
    }

    const WeeklyReport = ()=>{
        const highestValuesByWeeks = [];
        const startDateParts = from_date.split('-').map(part=>parseInt(part))
        const endDateParts = to_date.split('-').map(part=>parseInt(part))
        const startDate = startDateParts[2]
        const endDate = endDateParts[2]
        const noOfDays = endDate-startDate+1

        // console.log("no of days", noOfDays) 

        if(noOfDays < 7)
        {
            let message = "Please select atleast 7 days"
            return message
        }   
        else{
            const noOfWeeks = Math.floor(noOfDays / 7)
            // console.log("no of weeks", noOfWeeks)
            for(let i=0; i<noOfWeeks ; i++)
                {
                    const weekstartingDate = startDate + (i * 7)
                    const weekendingDate = weekstartingDate + 6

                    // console.log("week start date", weekstartingDate)
                    // console.log("week end date", weekendingDate)

                    let highest = null
                    for(let date = weekstartingDate; date <= weekendingDate ; date++)
                    {
                        const dateString = `${startDateParts[0]}-${String(startDateParts[1]).padStart(2, '0')}-${String(date).padStart(2, '0')}`
                        // console.log("dateString", dateString)
                        const dailyobjValues = dailyHighestvalues[dateString]
                        // console.log("daily value", dailyobjValues)
                        if(dailyobjValues)
                        {
                            if(!highest || highest.UV_A_Value < dailyobjValues.UV_A_Value)
                            {
                                highest = dailyobjValues
                            }
                        }
                        // console.log("highest", highest)
                    }
                    highestValuesByWeeks.push(highest)
                }
                // console.log("highestValuesByWeeks", highestValuesByWeeks)
                return highestValuesByWeeks
        }
    }

    const { type, resolution, from_date, to_date, location } = req.query
    try{
    
        console.log("req", req.query)

        if(!type, !resolution, !from_date, !to_date, !location){
            res.status(400)
            throw new Error("Please provide all the required fields")
        }
        else{
            const desiredLocation = await Location.find({Location_Name: location})
                                        .populate("locationDetails", "Reading_Date Reading_Time UV_A_Value UV_B_Value")

            console.log("location", location)

            const detail = desiredLocation[0].locationDetails.filter(item=>{
                return item.Reading_Date >= from_date && item.Reading_Date <= to_date
            }).sort(( a, b)=> new Date(a.Reading_Date) - new Date(b.Reading_Date))
            
            if(!detail)
            {
                res.status(400)
                throw new Error("No data found between specified date range")
            } 

            detail.forEach(item => {
                if (!valuesByDates[item.Reading_Date]) {
                    valuesByDates[item.Reading_Date] = [];
                }
                valuesByDates[item.Reading_Date].push(item);
            });

            if(resolution === 'Hourly')
            {
                if(type === 'UV_A')
                { 
                    const mappedValues = detail.map(reading=>
                        {
                            let obj = {}
                            obj.Reading_Date = reading.Reading_Date
                            obj.Reading_Time = reading.Reading_Time
                            obj.UV_A_Value = reading.UV_A_Value
                            return obj
                        })

                    res.status(200).json(mappedValues)
                }
                if(type === 'UV_B'){
                const mappedValues = detail.map(reading=>
                    {
                        let obj = {}
                        obj.Reading_Date = reading.Reading_Date
                        obj.Reading_Time = reading.Reading_Time
                        obj.UV_B_Value = reading.UV_B_Value
                        return obj
                    })
                res.status(200).json(mappedValues)
            }

            }
            if(resolution === 'Daily')
            {
                let dailyHighestvalues = DailyReport()  
                console.log("Highest UV_A value for each date:", dailyHighestvalues);
                res.json(dailyHighestvalues)
            }
            if(resolution === 'Weekly')
            {
                dailyHighestvalues = DailyReport()  
                let weeklyReport = WeeklyReport()

                if(typeof weeklyReport === 'string')
                {
                    return res.status(404).json({message: weeklyReport})
                }
                else{
                    console.log("weekly report", weeklyReport)
                    res.status(200).json(weeklyReport)
                }
            }
        }
    }catch(error)
    {
        res.status(400)
        throw new Error(error)
    }
}) 

module.exports.getOzoneReport = asyncHandler(async(req, res, next)=>{

    const ozoneRatio = []
    const valuesByDate = {}
    let dailyReport;
    let detail

    //ozone daily report
    const ozonedailyreport = () =>{

        detail.forEach((item)=>{
            if(!valuesByDate[item.Reading_Date])
            {
                valuesByDate[item.Reading_Date] = []
            }
            valuesByDate[item.Reading_Date].push(item)
        })

         //get ratio value on daily basis against highest A value
         for( const date in valuesByDate)
         {
             console.log("date", date)
             const dataArray = valuesByDate[date]
             let highest_A_Value = null

             dataArray.forEach((item)=>{
                 if(!highest_A_Value || item.UV_A_Value > highest_A_Value.UV_B_Value)
                 {
                     highest_A_Value = item
                 }
             })
             console.log("highest A for date", highest_A_Value)
             const ratio = highest_A_Value.UV_B_Value/highest_A_Value.UV_A_Value
             const obj = {}
             obj.Reading_Date = highest_A_Value.Reading_Date
             obj.Reading_Time = highest_A_Value.Reading_Time
             obj.UV_A_Value = highest_A_Value.UV_A_Value
             obj.UV_B_Value = highest_A_Value.UV_B_Value
             obj.ozone_ratio = ratio 
             ozoneRatio.push(obj)
         }
         return ozoneRatio

    }

    //ozpne weekly report
    const ozoneWeeklyReport =()=>{

        const highestValuesByWeeks = [];
        const startDateParts = from_date.split('-').map(part=>parseInt(part))
        const endDateParts = to_date.split('-').map(part=>parseInt(part))
        const startDate = startDateParts[2]
        const endDate = endDateParts[2]
        const noOfDays = endDate-startDate+1
 
            const noOfWeeks = Math.floor(noOfDays / 7)
            // console.log("no of weeks", noOfWeeks)
            for(let i=0; i<noOfWeeks ; i++)
                {
                    const weekstartingDate = startDate + (i * 7)
                    const weekendingDate = weekstartingDate + 6

                    let highest = null
                    for(let date = weekstartingDate; date <= weekendingDate ; date++)
                    {
                        const dateString = `${startDateParts[0]}-${String(startDateParts[1]).padStart(2, '0')}-${String(date).padStart(2, '0')}`

                        dailyReport.forEach(item=>{
                            if(item.Reading_Date === dateString)
                            {
                                if(!highest || highest.UV_A_Value < item.UV_A_Value)
                                {
                                    highest = item
                                }
                            }
                        })  
                        
                    }
                    highestValuesByWeeks.push(highest)
                }

                return highestValuesByWeeks
    }

    const { resolution, from_date, to_date, location } = req.query
    try{
        if(!resolution, !from_date, !to_date, !location){
            res.status(400)
            throw new Error("Please provide all the required fields")
        }
        else{
            const desiredLocation = await Location.find({Location_Name: location})
                                        .populate("locationDetails", "Reading_Date Reading_Time UV_A_Value UV_B_Value")

            detail = desiredLocation[0].locationDetails.filter(item=>{
                return item.Reading_Date >= from_date && item.Reading_Date <= to_date
            }).sort((a, b)=> new Date(a.Reading_Date) - new Date(b.Reading_Date))

            if(!detail)
            {
                res.status(400)
                throw new Error("No data found between specified date range")
            } 

            if(resolution === 'Hourly') {
                    const ratio = detail.map(reading=>
                        {
                            let obj = {}
                            const UV_A = reading.UV_A_Value
                            const UV_B = reading.UV_B_Value
                            const ratio = UV_B/UV_A
                            obj.Reading_Date = reading.Reading_Date
                            obj.Reading_Time = reading.Reading_Time
                            obj.ratio =  ratio
                            obj.UV_A_Value = UV_A
                            obj.UV_B_Value = UV_B
                            return obj
                        })
                    res.status(200).json(ratio)
            }
            
            if(resolution === 'Daily')
            {      
                const ratio = ozonedailyreport()
                res.status(200).json(ratio)
            }
            if(resolution === 'Weekly')
            {
             dailyReport = ozonedailyreport()   
             console.log("daily ozone report", dailyReport)
             const weeklyReport = ozoneWeeklyReport()
             console.log("ozone weekly report", weeklyReport)
             res.status(200).json(weeklyReport)
            }

        }
    }catch(error)
    {
        res.status(400)
        throw new Error(error)
    }
})

