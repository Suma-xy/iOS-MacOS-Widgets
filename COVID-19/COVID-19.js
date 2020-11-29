// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: green; icon-glyph: allergies;
const apiUrl = (location) => `https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_Landkreisdaten/FeatureServer/0/query?where=1%3D1&outFields=GEN,cases7_per_100k&geometry=${location.longitude.toFixed(3)}%2C${location.latitude.toFixed(3)}&geometryType=esriGeometryPoint&inSR=4326&spatialRel=esriSpatialRelWithin&returnGeometry=false&outSR=4326&f=json`
const apiUrlStates = 'https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/Coronaf%E4lle_in_den_Bundesl%E4ndern/FeatureServer/0/query?where=1%3D1&outFields=cases7_bl_per_100k&returnGeometry=false&outSR=4326&f=json'

const widget = await createWidget()
if (!config.runsInWidget) {
  await widget.presentSmall()
}
Script.setWidget(widget)
Script.complete()

async function createWidget(items) {
  const data = await getData()
  const list = new ListWidget()
  const header = list.addText("🦠 Inzidenz".toUpperCase())
  header.font = Font.mediumSystemFont(13)
  if(data) {
    if(!data.shouldCache) {
      list.addSpacer(6)
      const loadingIndicator = list.addText("Ort wird ermittelt...".toUpperCase())
      loadingIndicator.font = Font.mediumSystemFont(13)
      loadingIndicator.textOpacity = 0.5
    }
    list.addSpacer()
    const label = list.addText(data.incidence+"")
    label.font = Font.boldSystemFont(24)
    label.textColor = data.incidence >= 50 ? Color.red() : data.incidence >= 35 ? Color.orange() : Color.green()
    list.addText(data.areaName)
    if(data.shouldCache) {
      list.refreshAfterDate = new Date(Date.now() + 60*60*1000)
    }
  } else {
    list.addSpacer()
    list.addText("Daten nicht verfügbar")
  }
  return list
}

async function getData() {
   try {
    const location = await getLocation()
    if(location) {
      let data = await new Request(apiUrl(location)).loadJSON()
      const attr = data.features[0].attributes
      return { incidence: attr.cases7_per_100k.toFixed(1), areaName: attr.GEN, shouldCache: true };
    } else {
      let data = await new Request(apiUrlStates).loadJSON()
      const incidencePerState = data.features.map((f) => f.attributes.cases7_bl_per_100k)
      const averageIncidence = incidencePerState.reduce((a, b) => a + b) / incidencePerState.length
      return { incidence: averageIncidence.toFixed(1), areaName: "Deutschland", shouldCache: false };
    }
   } catch(e) {
    return null
   }
}

async function getLocation() {
  try {
    if(args.widgetParameter) {
      const fixedCoordinates = args.widgetParameter.split(",").map(parseFloat)
      return { latitude: fixedCoordinates[0], longitude: fixedCoordinates[1] }
    } else {
      Location.setAccuracyToThreeKilometers()
      return await Location.current()
    }
  } catch(e) {
    return null;
  }
}
