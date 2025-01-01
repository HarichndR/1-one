function sortDataByNameAndDistance(data) {
    let prioritizedNames = ["Orange", "Apple", "Banana"];
  
    return data.sort((a, b) => {
      let nameComparison = prioritizedNames.indexOf(a.name) - prioritizedNames.indexOf(b.name);
      if (nameComparison !== 0) {
        return nameComparison; // Sort by name priority first
      } else {
        return a.distance - b.distance; // If names are equal, sort by distance
      }
    });
}
module.exports=
{sortDataByNameAndDistance}
  
  