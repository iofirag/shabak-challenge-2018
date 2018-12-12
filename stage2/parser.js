var fs = require("fs");

var content = fs.readFileSync("test1.json");
var jsonContent = JSON.parse(content);

let hexKeyList = Object.keys(jsonContent);
let myStatistics = {
    totalCalc: 0,
    median: 0,
    iterations: 0,
    allValues: []
}

let fileData = {}
hexKeyList.forEach(hexKey => {
    let lines = []
    let hexList = getText(hexKey, jsonContent)
    hexList.forEach(obj => {
        ['text','return','in','base64','sum','of','values','below','median'].forEach(textKey => {
            if (textKey in obj) {
                let detectedLineObj = calculateLine(textKey, obj)
                // myStatistics.totalCalc += detectedLineObj.value // statistics
                myStatistics.iterations++   // statistics
                myStatistics.allValues.push(detectedLineObj.value)

                lines.push(detectedLineObj)
            }
        })
    })
    fileData[hexKey] = lines;
})
console.log(fileData)
var json = JSON.stringify(fileData);
var fs = require('fs');
fs.writeFile('./unicodereadable.json', json, 'utf8', () => {
    console.log('finish.')
    console.log(myStatistics)
    
    // calculate median by values list
    let medianRes = median(myStatistics.allValues)
    let result = 0;
    myStatistics.allValues.forEach(val => {
        if (val < medianRes) {
            result += val;
        }
    })
    console.log(`sum of values below median(${medianRes}) = ${result}`);
    console.log(`after secret base64 => ${Buffer.from(String(result)).toString('base64')}`);
});




function median(values){
    values.sort(function(a,b){
    return a-b;
  });

  if(values.length ===0) return 0

  var half = Math.floor(values.length / 2);

  if (values.length % 2)
    return values[half];
  else
    return (values[half - 1] + values[half]) / 2.0;
}
function calculateLine(key, obj) {
    let line = detectUnicodes(key, obj)
    return line;
}

function getText(key, jsonContent) {
    return jsonContent[key]
}
function detectUnicodes(key, obj) {
    if (!obj) return ''
    let value = 0
    let detectedWords = []
    obj[key].split(' ').forEach(junkWord => {
        junkWord = junkWord.toLowerCase()
        let detectedWord = []
        while(junkWord.includes('u05d') || junkWord.includes('u05e')) {

            ['d','e'].forEach(suffix => {
                let startIndex = junkWord.indexOf(`u05${suffix}`);
                if (startIndex > -1) {
                    foundUnicode = junkWord.substring(startIndex, startIndex + 5)
                    value += getGimatriaFromUnicode(foundUnicode)   // save gimatria
                    detectedWord.push('\\'+foundUnicode)    // save this unicode char
                    junkWord = junkWord.replace(foundUnicode,'')    // remove founded unicode from word
                }
            })
        }
        detectedWords.push( detectedWord.join('') ) // add word
    })
    return {
        [key]: detectedWords.join(' '),
        value: obj.value!= '?'? obj.value : value    // add value
    }
}
function getGimatriaFromUnicode(unicode) {
    const Gimatria = {
        u05d0: 1,
        u05d1: 2,
        u05d2: 3,
        u05d3: 4,
        u05d4: 5,
        u05d5: 6,
        u05d6: 7,
        u05d7: 8,
        u05d8: 9,
        u05d9: 10,
        u05db: 20,
        u05dc: 30,
        u05de: 40,
        u05e0: 50,
        u05e1: 60,
        u05e2: 70,
        u05e4: 80,
        u05e6: 90,
        u05e7: 100,
        u05e8: 200,
        u05e9: 300,
        u05ea: 400,
    }
    return Gimatria[unicode]
}