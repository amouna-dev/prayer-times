let ar = 'ar-EG'
let en = 'en-us'
let prayerArTitles = ["الفجر","الشروق","الظهر","العصر","المغرب","العشاء"]
let prayerEnTitles = ["Fajr","Sunrise","Dhuhr","Asr","Maghrib","Isha"]



function fullDay(lang) {
    let today = new Date()
    let d =  today.toLocaleString(lang, {weekday: "long"}) +" "+
    today.toLocaleString(lang, {day: 'numeric'}) +" "+
    today.toLocaleString(lang, {month: 'long'}) + " "+
    today.toLocaleString(lang, {year: 'numeric'}) 
    return d
}

function fillTimeForPrayer(id, time){
    document.getElementById(id).innerHTML = time
}

function traduction(lang1, lang2){
    let l = ar
    let prayers = document.querySelectorAll(".title_prayer")
    if(lang2 == "en") {
        l = en

        for (let i = 0; i < prayers.length; i++ ) {
            prayers[i].innerHTML = prayerEnTitles[i]
        }
    }else{
        for (let i = 0; i < prayers.length; i++ ) {
            prayers[i].innerHTML = prayerArTitles[i]
        } 
    }
    console.log(fullDay(l))
    let classes = document.querySelectorAll("."+lang1)

    for (let i = 0; i < classes.length; i++ ) {
        classes[i].setAttribute("class", lang2)
    }
    
    document.getElementById("date").innerHTML = fullDay(l)
    document.getElementById("cities_"+lang2).style.display ="block"
    document.getElementById("cities_"+lang1).style.display ="none"
    let citySelected = document.getElementById("cities_"+lang2).options[document.getElementById("cities_"+lang1).selectedIndex]
    console.log(citySelected.value)
    document.getElementById("city").innerHTML = citySelected.text
    document.getElementById("cities_"+lang2).options[document.getElementById("cities_"+lang1).selectedIndex].selected = true
   
    changeCityName(lang2)
}

function getPrayersTimingsOfCity(cityName, countryName="TN"){
    let params = {
        country : countryName,
        city: cityName
    }
    axios.get('http://api.aladhan.com/v1/timingsByCity', {
        params: params
      })
      .then(function (response) {
        const timings = response.data.data.timings
        fillTimeForPrayer("fajr_time", timings.Fajr)
        fillTimeForPrayer("sunrise_time", timings.Sunrise)
        fillTimeForPrayer("dhuhr_time", timings.Dhuhr)
        fillTimeForPrayer("asr_time",timings.Asr)
        fillTimeForPrayer("sunset_time", timings.Maghrib)
        fillTimeForPrayer("isha_time", timings.Isha)
    
        if(document.querySelector("body").classList.contains("ar")){
            const hijriDate = response.data.data.date.hijri
            let date = hijriDate.weekday.ar +" "+ hijriDate.day + " "+ hijriDate.month.ar + " "+ hijriDate.year
            
            document.getElementById("date").innerHTML = `${fullDay(ar)} <br> ${date}`
        }
        
    
      })
      .catch(function (error) {
        console.log(error)
      })
}

function changeCityName(lang){
    document.getElementById("cities_"+lang).addEventListener("change", function(){
        const options = Array.from(this.options)
        const optionToSelect = options.find(item => item.value === this.value);
       
        getPrayersTimingsOfCity(this.value, optionToSelect.dataset.country)
        document.getElementById("city").innerHTML = optionToSelect.text

    })
}


document.getElementById("cities_en").style.display ="none"

var radios = document.forms["lang"].elements["languages"]

for(var i = 0, max = radios.length; i < max; i++) {

    radios[i].addEventListener('click',  function() {
      
        if(this.value == "en"){
            
            traduction("ar", "en")

        }   
        else if(this.value == "ar"){
           
            traduction("en", "ar")
            
        }
            
    })
}
getPrayersTimingsOfCity("tunis")

if(document.querySelector("body").classList.contains("ar")){
    
    changeCityName("ar")
}
