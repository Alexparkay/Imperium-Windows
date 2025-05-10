import React from 'react';
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

// UK TopoJSON Source - using a reliable source for UK subdivisions
const UK_TOPO_JSON = "/images/uk-counties.json";

// Define types
interface UKMapProps {
  className?: string;
}

// UK Regions with color styling in green shades
const REGIONS = {
  "England": ["Bedfordshire", "Berkshire", "Bristol", "Buckinghamshire", "Cambridgeshire", "Cheshire", "Cornwall", "Cumbria", "Derbyshire", "Devon", "Dorset", "Durham", "East Riding of Yorkshire", "East Sussex", "Essex", "Gloucestershire", "Greater London", "Greater Manchester", "Hampshire", "Herefordshire", "Hertfordshire", "Isle of Wight", "Kent", "Lancashire", "Leicestershire", "Lincolnshire", "Merseyside", "Norfolk", "North Yorkshire", "Northamptonshire", "Northumberland", "Nottinghamshire", "Oxfordshire", "Rutland", "Shropshire", "Somerset", "South Yorkshire", "Staffordshire", "Suffolk", "Surrey", "Tyne and Wear", "Warwickshire", "West Midlands", "West Sussex", "West Yorkshire", "Wiltshire", "Worcestershire"],
  "Scotland": ["Aberdeen City", "Aberdeenshire", "Angus", "Argyll and Bute", "City of Edinburgh", "Clackmannanshire", "Dumfries and Galloway", "Dundee City", "East Ayrshire", "East Dunbartonshire", "East Lothian", "East Renfrewshire", "Falkirk", "Fife", "Glasgow City", "Highland", "Inverclyde", "Midlothian", "Moray", "Na h-Eileanan Siar", "North Ayrshire", "North Lanarkshire", "Orkney Islands", "Perth and Kinross", "Renfrewshire", "Scottish Borders", "Shetland Islands", "South Ayrshire", "South Lanarkshire", "Stirling", "West Dunbartonshire", "West Lothian"],
  "Wales": ["Blaenau Gwent", "Bridgend", "Caerphilly", "Cardiff", "Carmarthenshire", "Ceredigion", "Conwy", "Denbighshire", "Flintshire", "Gwynedd", "Isle of Anglesey", "Merthyr Tydfil", "Monmouthshire", "Neath Port Talbot", "Newport", "Pembrokeshire", "Powys", "Rhondda Cynon Taf", "Swansea", "Torfaen", "Vale of Glamorgan", "Wrexham"],
  "Northern Ireland": ["Antrim and Newtownabbey", "Ards and North Down", "Armagh City, Banbridge and Craigavon", "Belfast", "Causeway Coast and Glens", "Derry City and Strabane", "Fermanagh and Omagh", "Lisburn and Castlereagh", "Mid and East Antrim", "Mid Ulster", "Newry, Mourne and Down"]
};

// High and medium activity regions - for setting different color intensities
const HIGH_SAP_ACTIVITY = [
  "Greater London", "Greater Manchester", "West Midlands", "Edinburgh", "Glasgow City", 
  "Bristol", "Leeds", "Birmingham", "Cardiff", "Belfast"
];

const MEDIUM_SAP_ACTIVITY = [
  "Hampshire", "Surrey", "Cheshire", "Hertfordshire", "Cambridgeshire", 
  "Oxfordshire", "Kent", "Fife", "Midlothian", "Yorkshire"
];

const UKMap: React.FC<UKMapProps> = ({ className }) => {
  // Handler for when a region is clicked
  const regionClickHandler = (event: React.MouseEvent, geo: any) => {
    const regionName = geo.properties.NAME || geo.properties.name;
    console.log(`Selected region: ${regionName}`);
  };

  // Function to get fill color for a region based on activity level
  const getRegionFill = (geo: any) => {
    const regionName = geo.properties.NAME || geo.properties.name;
    
    if (HIGH_SAP_ACTIVITY.includes(regionName)) {
      return "rgba(16, 185, 129, 0.85)"; // High activity - bright emerald
    } else if (MEDIUM_SAP_ACTIVITY.includes(regionName)) {
      return "rgba(16, 185, 129, 0.75)"; // Medium activity - medium emerald
    } else {
      return "rgba(16, 185, 129, 0.6)"; // Standard emerald with lower opacity
    }
  };

  return (
    <div className={`relative w-full h-full flex items-center justify-center ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent rounded-xl" />
      <div className="relative w-full h-full flex items-center justify-center p-4">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: 2400,
            center: [-3.2, 55.3] // Center on the UK
          }}
          style={{
            width: "100%",
            height: "100%"
          }}
        >
          <Geographies geography={UK_TOPO_JSON}>
            {({ geographies }) =>
              geographies.map((geo) => {
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={(event) => regionClickHandler(event, geo)}
                    style={{
                      default: {
                        fill: getRegionFill(geo),
                        stroke: "rgba(16, 185, 129, 0.2)",
                        strokeWidth: 0.5,
                        outline: "none"
                      },
                      hover: {
                        fill: getRegionFill(geo),
                        stroke: "rgba(16, 185, 129, 0.4)",
                        strokeWidth: 2,
                        outline: "none",
                        filter: "brightness(1.2)",
                        cursor: "pointer"
                      },
                      pressed: {
                        fill: getRegionFill(geo),
                        stroke: "rgba(16, 185, 129, 0.6)",
                        strokeWidth: 2,
                        outline: "none"
                      }
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>
      </div>
    </div>
  );
};

export default UKMap; 