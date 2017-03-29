import {getAvg} from "./averageService";

/*
 *遇到 $符号或者jQuery时 会加载JQuery模块,标识符会被加载的模块出口所填充
 */
$('body').css('background-color', 'lightSkyBlue');
//jQuery('body').css('background-color', 'red');

const scores = [90, 75, 60, 99, 94, 30];
const averageScore = getAvg(scores);

const messageToDisplay = `average score ${averageScore}`;

document.write(messageToDisplay);
