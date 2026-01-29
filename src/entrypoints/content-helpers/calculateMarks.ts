export const getFinalMarks = (obtained: number, submitted: number, total:number) => {
    return Math.round((obtained/total) * submitted);
}