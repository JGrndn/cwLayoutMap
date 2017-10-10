## Description
The Map layout allows to display locations on a map, the same way it does with the World Map behaviour. It can be useful when you want to display data in popout (which is not currently available with the World Map behaviour).

## Installation  
[https://github.com/casewise/cpm/wiki](https://github.com/casewise/cpm/wiki)  

## How to set up the map layout
First you need to create the following page structure. Note that you can use this layout in popout as well.  
<img src="https://github.com/JGrndn/cwLayoutMap/blob/master/screen/1.JPG" style="width:95%" />  

Then you need fill the following options : 
* Map : Set the name of the map you want to use. Available maps are : [world_merc_en, us_merc_en, unitedkingdom_merc_en, switzerland_merc_en, southafrica_merc_en, philippines_regions_merc_en, netherlands_merc_en, italy_merc_en, india_merc_en, france_merc_en, europe_merc_en, canada_merc_en, belgium_merc_en]
* ISO code scriptname : When using maps, you must have a user-defined property on the object to store the country code. This must be a Single-Line Text property. The country code is a two-letter code which adheres to the ISO 3166-1 standard.
* Lat. Long. scriptname : When using maps, you must have a user-defined property on the object to store the latitude and longitude reference for the place you want to show. This must be a Single-Line Text property. The format for the value is '[latitude],[longitude]' (such as 48.856614,2.352222 for Paris).
* Click to navigate : Check this option if you want to be redirected on the object page when you click on a location.
  
<img src="https://github.com/JGrndn/cwLayoutD3TreeMap/blob/master/screen/4.JPG" style="width:95%" />  



## Result  
Below is a screenshot of what you get once your map is correctly configured  
<img src="https://github.com/JGrndn/cwLayoutMap/blob/master/screen/3.JPG" style="width:95%" />  