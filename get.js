let fs = require("fs");
let path = require("path");
let cheerio = require("cheerio");
let request = require("request");
const link ="https://www.espncricinfo.com/series/ipl-2020-21-1210595/kings-xi-punjab-vs-rajasthan-royals-50th-match-1216537/full-scorecard";
request(link,cb);
function cb(error,response ,html){
    if(error){
        console.log(error);
    }
    if(response.statusCode==404){
        console.log("page not found");

    }
    if(html){
        dataExacter(html);
    }
}
function dataExacter(html){
    let searchTool = cheerio.load(html);
    let all = searchTool(".header-title.label");
    //let arr = all.text().split(",");
    //console.log(all);
    let oppositeTeam= all.text().split("INNINGS")[0];
    oppositeTeam=oppositeTeam.trim();
    console.log(oppositeTeam);
    // for(let i=0;i<all.length;i++){
    //      console.log(all[i]);
    // }
}