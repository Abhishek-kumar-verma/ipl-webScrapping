let fs = require("fs");
let path = require("path");
let request = require("request");
let cheerio = require("cheerio");
let scoreObj = require("./score");

//console.log(currentPath);
let url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595";
request(url,cb);
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
    let anchorElement = searchTool(".widget-items.cta-link").find("a");
    //let link = searchTool(anchorElement).find("a")
    let link = anchorElement.attr("href");
    let fullLink =  `https://www.espncricinfo.com${link}`;
    //console.log(fullLink);
    request(fullLink,newcb);
}
function newcb(error,response,html){
    
    if(error){
        console.log(error);
    }
    else if(response.statusCode==404){
        console.log("page not found");
    }
    else{
        
        getArrOfAllMatch(html);
    }
}
function getArrOfAllMatch(html){
    let searchTool = cheerio.load(html);
    let browser = searchTool('a[data-hover="Scorecard"]');
    // console.log(browser.length);

    //let link = searchTool(anchorElement).find("a")
    for(let i=0;i<browser.length;i++){
        let anchorElement = searchTool(browser[i]);
        let link = anchorElement.attr("href");
        let fullLink =  `https://www.espncricinfo.com${link}`;
        scoreObj.SingleMatch(fullLink);

    }
    
}

