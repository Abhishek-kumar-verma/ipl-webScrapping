let fs = require("fs");
let path = require("path");
let cheerio = require("cheerio");
let request = require("request");

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
    let bothInningArr = searchTool(".Collapsible");
    for(let i=0;i<bothInningArr.length;i++){
        let teamNameElement = searchTool(bothInningArr[i]).find("h5");
        let teamName = teamNameElement.text();
        teamName= teamName.split("INNINGS")[0];
        teamName = teamName.trim();
        let iplTeamFolderPath = path.join(process.cwd(),"ipl",teamName);
        if(fs.existsSync(iplTeamFolderPath)==false){
            fs.mkdirSync(iplTeamFolderPath);

        }
        let batsmanDetail = searchTool(bothInningArr[i]).find(".table.batsman tbody tr");
        for(let j=0;j<batsmanDetail.length;j++)
        {
            numberOfTds = searchTool(batsmanDetail[j]).find("td");

            if(numberOfTds.length == 8){

                let playerName = searchTool(numberOfTds[0]).text();

                playerName = playerName.split("(")[0];
                playerName = playerName.slice(0,playerName.length-1);
                playerName = playerName.trim();

                console.log(playerName);

                let playerPath = path.join(iplTeamFolderPath,playerName);
                if(fs.existsSync(playerPath) == false)
                {
                    fs.mkdirSync(playerPath);
                }
                let filePath = path.join(playerPath,"Details.md");
                fs.writeFileSync(filePath,"Need to extract");
            }
        }
        console.log("`````````````````````````````````````````````````");
    }
}



module.exports={
    SingleMatch : score

}