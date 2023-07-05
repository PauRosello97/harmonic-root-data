// http://marcs-survey.uws.edu.au/OMSI/index.php

export default function omsi(responses: number[]) {

    const CURRENT_PRACTICE = [0, - 0.060, - 0.098, - 0.301, - 1.211, - 1.528];
    const COLLEGE = [0, 0.423, 0.274, - 0.616, 0.443, 0.055, 2.801, 0.387, 1.390, 3.050];
    const COMPOSITION = [0, 0.516, 1.071, 0.875, 0.456, - 1.187];
    const CONCERT = [0, 1.839, 1.394, 1.713, 1.610];
    const RANK = [0, - 0.553, 0.328, 1.589, 1.460, 2.940];


    // 1. Age
    let Age = responses[0];
    // 2. Age at commencement of musical activity
    let Commencement = responses[1];
    // 3.Years of private lessons
    let Years_private_lessons = responses[2];
    // 4. Years of regular practice
    let Years_regular_practice = responses[3];
    // 5. Current time spent practicing
    let current_practice = responses[4];
    // 6. and 7. College music coursework completed
    let college = responses[5];
    // 8. Composition experience
    let composition = responses[6];
    // 9. Concert attendance
    let concert = responses[7];
    // 10. Rank as music-maker
    let rank = responses[8];

    let logit = -3.513
        + COLLEGE[college]
        + 0.027 * Age
        - 0.026 * (Commencement == 0 ? Age : Commencement)
        - 0.076 * Years_private_lessons
        + 0.042 * Years_regular_practice
        + CURRENT_PRACTICE[current_practice]
        + COMPOSITION[composition]
        + CONCERT[concert]
        + RANK[rank];

    let P = Math.exp(logit) / (1 + Math.exp(logit));

    return P;
}
