const egyptianGovernorates = [
    "Cairo",
    "Alexandria",
    "Beheira",
    "Faiyum",
    "Gharbia",
    "Ismailia",
    "Monufia",
    "Minya",
    "Qalyubia",
    "New Valley",
    "Sharqia",
    "Aswan",
    "Assiut",
    "Beni Suef",
    "Port Said",
    "South Sinai",
    "Damietta",
    "Sohag",
    "North Sinai",
    "Qena",
    "Kafr El Sheikh",
    "Matrouh",
    "Luxor",
    "Red Sea",

  ];
  
let lat
let long
let cityName=document.getElementById("cityName")
let loader=document.querySelector(".loadingPage")
let dayText=document.getElementById("day")
let hijriDate=document.getElementById("hijriDate")
let gregorianDate=document.getElementById("gregorianDate")
let prayerTextList=document.querySelectorAll(".prayer h3")
let prayerTime=document.querySelectorAll(".time")
let remainingtime=document.getElementById("remainingtime")
window.onload=()=>{getDataByCoords()}


async function getLocation(){
    return new Promise((resolve, reject) => {
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition((pos)=>{
                lat=pos.coords.latitude
                long=pos.coords.longitude
                console.log(lat,long)
                resolve()
            },(error)=>{
                errorMsg(loader,"can't find your location , please check location permissions , internet connection and refresh the page") 
            })
        }
        else{
            errorMsg(loader,"your browser doesn't support finding location feature")
        }
    })
    
}

async function getDataByCity(){
    let req=await fetch(`https://api.aladhan.com/v1/timingsByCity?country=EG&city=اسوان`)
    let res=await req.json()
}

async function getDataByCoords(){
    try{
        await getLocation()
    }
    catch{
        errorMsg(loader,"there is a problem in getting the data , please check your internet connction and refresh the page")
    }
    try{
        let req=await fetch(`https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${long}`)
        let res=await req.json()
        console.log(res)
        displayData(res)
    }
    catch(error){
        console.error("can't fetch data",error)
        errorMsg(loader,"there is a problem in getting the data , please check your internet connction and refresh the page")
    }
}

function displayData(res){
    loader.style.display="none"
    cityName.innerHTML=res.data.meta.timezone
    dayText.innerHTML=res.data.date.gregorian.weekday.en
    const{Fajr:fajr,Sunrise:sunrise,Dhuhr:dhuhr,Asr:asr,Maghrib:maghrib,Isha:isha}=res.data.timings
    let timingsList=[fajr,sunrise,dhuhr,asr,maghrib,isha]
    hijriDate.innerHTML=`${res.data.date.hijri.day} ${res.data.date.hijri.month.en} ${res.data.date.hijri.year}`
    gregorianDate.innerHTML=res.data.date.readable
    displayTimings(timingsList)
}

function displayTimings(timingsList){
    let prayerList=["fajr","sunrise","dhuhr","asr","maghrib","isha"]
    for(let i=0;i<prayerList.length;i++){
        prayerTextList[i].innerHTML=prayerList[i]
        prayerTime[i].innerHTML=timingsList[i]
    }
    focusOnNextPrayer()
}


function errorMsg(container,msg){
    
    container.innerHTML=`<p class="loaderError">${msg}</p>`
}


function focusOnNextPrayer(){

    setInterval(()=>{
        let currentTime=`${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`
    let nextPrayer
    for(time of prayerTime){
        
        if(timeToMilisecond(`${time.innerHTML}:00`)>=timeToMilisecond(currentTime)){
            prayerTime.forEach((time)=>{
                time.parentElement.classList.remove("nextPrayer")
            })
            time.parentElement.classList.add("nextPrayer")
            nextPrayer=`${time.innerHTML}:00`
            timeRemainingForNextPrayer(currentTime,nextPrayer)
            return 0
        }
    }
    },1000)
    
    

}

function timeRemainingForNextPrayer(currentTime,nextPrayer){
    
    
    let Totalsec =Math.floor(timeDifference(currentTime,nextPrayer)/1000)
    let hours=Math.floor(Totalsec/60/60)
    let minutes=Math.floor((Totalsec%(3600))/60)
    let seconds=Totalsec%60
    let formattedTime=timeFormatting(hours,minutes,seconds)
    remainingtime.innerHTML=formattedTime

}

function timeDifference(startTime,endTime){
    let difference=timeToMilisecond(endTime)-timeToMilisecond(startTime)
    return difference
}
function timeToMilisecond(time){
    let [hours,min,sec]=time.split(":")
    let hoursInMili=hours*60*60*1000
    let minInMili=min*60*1000
    let secInMili=sec*1000
    return hoursInMili+minInMili+secInMili
}



function timeFormatting(hours,minutes,seconds){
    let formattedHours=String(hours).padStart(2,0)
    let formattedMinutes=String(minutes).padStart(2,0)
    let formattedSeconds=String(seconds).padStart(2,0)
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`
}
