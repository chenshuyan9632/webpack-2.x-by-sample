import {getAvg,getTotalScore} from "./averageService";

const scores = [90, 75, 60, 99, 94, 30];
const averageScore = getAvg(scores);
const totalScore = getTotalScore(scores) ;

const messageToDisplayAvg = `average score ${averageScore}`;
const messageToDisplayTotal = `total score ${totalScore}`;

document.write(messageToDisplayAvg);
document.write(messageToDisplayTotal);
