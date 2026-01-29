const validFunctions = ['newPrice', 'validOtp', 'finalScore', 'gonoVote', 'analyzeText']
export const sources = [
    {
        "name": "newPrice",
        "startLine": 1,
        "code": "function newPrice(currentPrice, discount) {\nif(typeof currentPrice !== 'number' || typeof discount !== \"number\") return \"Invalid\"\nconst discountPrice = currentPrice * (discount/100)\nreturn currentPrice - discountPrice\n}",
        "parameters": [
            "currentPrice",
            "discount"
        ],
        "endLine": 5,
        "lineCount": 5
    },
    {
        "name": "validOtp",
        "startLine": 6,
        "code": "function validOtp(otp) {\nif(typeof otp !== 'string') return \"Invalid\"\nif(otp.length !== 8) return false\nreturn true\n}",
        "parameters": [
            "otp"
        ],
        "endLine": 10,
        "lineCount": 5
    },
    {
        "name": "finalScore",
        "startLine": 11,
        "code": "function finalScore(omr) {\nif(Array.isArray(omr)) return \"Invalid\"\nif(typeof omr !== 'object') return \"Invalid\"\nif(omr.right + omr.wrong > 100) return \"Invalid\"\nconst score = omr.right - (omr.wrong*0.5)\nconsole.log(score)\nreturn Math.round(score)\n}",
        "parameters": [
            "omr"
        ],
        "endLine": 18,
        "lineCount": 8
    },
    {
        "name": "gonoVote",
        "startLine": 19,
        "code": "function gonoVote(array) {\nif(!Array.isArray(array)) return \"Invalid\"\nlet h=0, n=0;\nfor(let v of array){\nif(v === \"ha\") h++\nif(v === \"na\") n++\n}\nif(h >= n) return true\nreturn false\n}",
        "parameters": [
            "array"
        ],
        "endLine": 28,
        "lineCount": 10
    }
]

export const demoCode = `
function newPrice(currentPrice, discount) {
if(typeof currentPrice !== 'number' || typeof discount !== "number") return "Invalid"
const discountPrice = currentPrice * (discount/100
return currentPrice - discountPrice
}

function validOtp(otp) {
if(typeof otp !== 'string') return "Invalid"
if(otp.length !== 8) return false
return true
}
function finalScore(omr) {
if(Array.isArray(omr)) return "Invalid"
if(typeof omr !== 'object') return "Invalid"
if(omr.right + omr.wrong > 100) return "Invalid"
const score = omr.right - (omr.wrong*0.5)
console.log(score)
return Math.round(score)
}
function gonoVote(array) {
if(!Array.isArray(array)) return "Invalid"
let h=0, n=0;
for(let v of array){
if(v === "ha") h++
if(v === "na") n++
}
if(h >= n) return true
return false
}
function gonoVote(array) {
if(!Array.isArray(array)) return "Invalid"
let h=0, n=0;
for(let v of array){
if(v === "ha") h++
if(v === "na") n++
}
if(h >= n) return true
return false
}
`