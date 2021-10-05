let fs = require("fs");
let path = require("path");
let cheerio = require("cheerio");
let request = require("request");
let xlsx = require("xlsx");
let __dirName = path.join(process.cwd(),"ipl");
if(!fs.existsSync(__dirName)){
    fs.mkdirSync(__dirName);
}

function score(url){
    request(url,cb);
}
function cb(error,response,html){
    if(error){
        console.log(error);
    }
    else if(response.statusCode==404){
        console.log("page not found");
    }
    else{
        
        dataExacter(html);
    }

}
function dataExacter(html){
    let searchTool = cheerio.load(html);
    let allvenue = searchTool(".match-info-MATCH .description");
    let arrvenue = allvenue.text().split(",");
    let matchDate=arrvenue[2];
    let Place=arrvenue[1];
    let bothInningArr = searchTool(".Collapsible");
    for(let i=0;i<bothInningArr.length;i++){
        let teamNameElement = searchTool(bothInningArr[i]).find("h5");
        let teamNameArr = teamNameElement.text();
        let teamName= teamNameArr.split("INNINGS")[0];
        teamName = teamName.trim();
        //let iplTeamFolderPath = path.join(process.cwd(),"ipl",teamName);
        // if(fs.existsSync(iplTeamFolderPath)==false){
        //     fs.mkdirSync(iplTeamFolderPath);

        // }
        let batsmanDetail = searchTool(bothInningArr[i]).find(".table.batsman tbody tr");
        for(let j=0;j<batsmanDetail.length;j++)
        {
            numberOfTds = searchTool(batsmanDetail[j]).find("td");

            if(numberOfTds.length == 8){

                let playerName = searchTool(numberOfTds[0]).text();

                playerName = playerName.split("(")[0];
                playerName = playerName.slice(0,playerName.length-1);
                playerName = playerName.trim();
                let runs=searchTool(numberOfTds[2]).text();
                let balls=searchTool(numberOfTds[3]).text();
                let fours=searchTool(numberOfTds[5]).text();
                let sixes=searchTool(numberOfTds[6]).text();

                console.log(playerName+"  scores "+runs+"  in "+balls+"  ball in which he have "+fours+"  fours and "+sixes +"  sixes" + " at date "+matchDate+" .Place is "+Place);
                processPlayer(playerName,teamName,runs,balls,fours,sixes,matchDate,Place);

                // let playerPath = path.join(iplTeamFolderPath,playerName);
                // if(fs.existsSync(playerPath) == false)
                // {
                //     fs.mkdirSync(playerPath);
                // }
                // let filePath = path.join(playerPath,"Details.md");
                //fs.writeFileSync(filePath,"Need to extract");
            }
        }
        console.log("`````````````````````````````````````````````````");
    }
}
function processPlayer(playerName,teamName,oppositeTeam,runs,balls,fours,sixes,matchDate,Place){
    let obj={
        playerName,
        teamName,
        oppositeTeam,
        runs,
        balls,
        fours,
        sixes,
        matchDate,
        Place
    }

    let dirpath =path.join(__dirName,teamName)
    //console.log(dirpath)
    if(!fs.existsSync(dirpath)){
        console.log(dirpath);
        fs.mkdirSync(dirpath);
    }
    let playerFilePath = path.join(dirpath,playerName+".xlsx");
    let playerArr=[];
    if(fs.existsSync(playerFilePath)==false){
        playerArr.push(obj);
    }else{
        // append
        playerArr=excelReader(playerFilePath,playerName);
        playerArr.push(obj);

    }
    excelWriter(playerFilePath,playerArr,playerName);
}
// function getContent(playerFilePath){
//     let content = fs.rweadFileSync(playerFilePath);
//     return JSON.parse(content);
// }
// function writeContent(playerFilePath,playerArr){
//     let jsonData = JSON.stringify(content);
//     fs.writeFileSync(playerFilePath,jsonData);
// }
function excelReader(filePath,sheetName){
    if(fs.existsSync(filePath)==false){
        return [];
    }
    // player workbook
    let wb = xlsx.readFile(filePath);
    // get data from a particular sheet in that wb
    let excelData= wb.Sheets[sheetName];
    // sheet to json
    let ans =xlsx.utils.sheet_to_json(excelData);
    return ans;
}
function excelWriter(filePath,json,sheetName){
    // create workbook
    let newWB = xlsx.utils.book_new();
    // workSheet
    let newWS = xlsx.utils.json_to_sheet(json);
    xlsx.utils.book_append_sheet(newWB,newWS,sheetName);
    //excel file create
    xlsx.writeFile(newWB,filePath);

    
}



module.exports={
    SingleMatch : score

}