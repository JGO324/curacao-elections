# Curacao-elections [Link to Curacao elections map](https://jgo324.github.io/curacao-elections)
## Map project proposal (Mapping the Curacao Election)
## Introduction
In the past years the elections on Curacao were poor in the way the election was presented to the public. They present the results in Excel format on TV. The result are not in real time, when they close voting locations, they began to count the votes and fill in the columns in Excel.
Here is a video of [election 2012](https://youtu.be/hpKhdHlng18?t=50)
In  year 2016,  our national TeleCuracao has improved the way to present the data to the public on tv. Here is an link to the YouTube channel of [TeleCuracao youtube channel](https://youtu.be/YCeiskb4Ba4?t=648)  and you can see on second 648  on the video that they are using a progress bar to show all the political parties and on [second 730](https://youtu.be/YCeiskb4Ba4?t=739) you see an map that shows the areas with the most votes and they can compare it with the past elections. In this video you can see comparison between the  2016 election and the 2012 election.

I came with the idea to create a new modern  way to visualize and  interact with the map and show election data by using open source technology that take place every 4 years.
Next year we have our Election and as a web map cartographer I will use my knowledge to create this election  map as final project for the New Maps Plus MAP 673. 
This map project title will be named "Mapping the elections"
## User needs
To build this project, we need to understand what are the user needs.
The actors of this map project is the Konseho Supremo Elektoral (KSE) and the media. 
The KSE want to map all the past elections on a map and with focus on the next year elections. The map must provide the user a way to select the political party and show the total vote on that political party. The map must be user friendly and easy to understand.
The map doesn't need to be mobile friendly. Mobile friendly is optional. Because the map will show on TV.

## Objectives
The objective of making this map, is to create a modern way to visualize Election data that is easy to understand and interact with.
There are 2 groups of users that use the map. The personal of the election that collect the data of voters and the other are the media to visualize the data to the public.
For this project I will focus on the visualization of the data to the public. The map must have a simple layout, legend, slider, pop-up window that show all the politic parties with total vote.

### breaking down the objectives
- Map will shows the politic parties as proportional map on the voting location. 
- Each circle represent the political party
- When user click on the voting location, a pop-up window will show up with all the politic party with the current total votes.
- On the bottom you see all the political party card as legend with their respective colors with total votes.
- The user also can filter out the political party by choosing which party circle to show on the map.
- Slider to select year
## The data
The data source is from ["Hoofdstembureau Curacao"](http://www.kse.cw/eerdere.html). They provide some data in Excel format, and PDF format that can be used to build the data for the map.
Other way is to ask them for more accurate/ better data. 
And for the geographic location I will use the [Basiskaart Curacao](http://basiskaart.gobiernu.cw/), Google map and Google streetview to identify the locations.

## Updates



## Technology stack
- **Data processing**
	- [QGis 3.12](https://www.qgis.org/)
	- SQLite for data storage
	- SQL for data wrangling
- **Web Libraries and Technologies**
    - [Leafletjs](https://leafletjs.com/) & omnivore plugin
    - [Assembly.css](https://labs.mapbox.com/assembly/)
    - HTML, CSS & CSS
- **Data format**
	- CSV, GeoJSON
- **Hosting platform**
	- Github.

------

[Go to my portfolio for more map project](https://jgo324.github.io)