import { useEffect, useState } from "react";
import styles from "./Results.module.css";
import chords, { chordNames, THEORIES, THEORIES_NAMES, PAU, dissonance, mod_tenney, harmonicity } from "../../data/chords";
import json from '../../data/data.json';
import { Space, chordHarmonicDistance, chordHarmonicity, getSpace, factorsToChord, factorsToSuperChord } from "../../utils/models";

/*
Comprovar si hi ha alguna relació entre el temperament d'un espai i la confiança.
Perquè 11/8 i 3/2 no es porten bé? Pot coincidir amb el que diu el reviewer
*/

const ALL = 0; const UTONAL = 1; const OTONAL = 2;

let ARR_ALL = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
let ARR_5_LIMIT = [1];
let ARR_7_LIMIT = [2, 4, 6, 9];
let ARR_11_LIMIT = [3, 5, 7, 8, 10];
let ARR_OCTAVE = [1, 2, 3, 4, 5, 9, 10];
let ARR_TRITAVE = [6, 7, 8];

function Results() {
    const spaces: string[] = ["[3,5]→2", "[3,7]→2", "[3,11]→2", "[5,7]→2", "[5,11]→2", "[5,7]→3", "[5,11]→3", "[7,11]→3", "[3,5,7]→2", "[3,5,7,11]→2"];
    const [data, setData] = useState<any[]>([]);
    const [countResponses, setCountResponses] = useState<number[]>([]);
    const [totalResponses, setTotalResponses] = useState<number>(1);
    const [absoluteResponses, setAbsoluteResponses] = useState<number[][]>([]);
    const [winners, setWinners] = useState<number[]>([]);
    const [tonalness, setTonalness] = useState<number[][]>([]);
    const [tonalnessOtonality, setTonalnessOtonality] = useState<number>();
    const [tonalnessUtonality, setTonalnessUtonality] = useState<number>();
    const [tonalness5limit, setTonalness5limit] = useState<number>();
    const [tonalness7limit, setTonalness7limit] = useState<number>();
    const [tonalness11limit, setTonalness11limit] = useState<number>();
    const [tonalnessOctave, setTonalnessOctave] = useState<number>();
    const [tonalnessTritave, setTonalnessTritave] = useState<number>();
    const [tonalnessAverage, setTonalnessAverage] = useState<number>();

    useEffect(() => {
        setData(json);
    }, []);


    useEffect(() => {
        setTotalResponses(data.length);
        let _countResponses: number[] = new Array(data.length);
        let _absoluteResponses: number[][] = new Array(data.length);

        chordNames.forEach((chord: string[], i: number) => {
            _absoluteResponses[i] = [];
            chord.forEach(name => _absoluteResponses[i].push(0));
            _absoluteResponses[i].push(0)
        })

        data.forEach((person) => {
            person.responses.forEach((response: number, i: number) => {
                if (!_countResponses[i]) _countResponses[i] = 0;
                if (response != -1) _countResponses[i]++;

                if (!_absoluteResponses[i]) {
                    _absoluteResponses[i] = new Array(chordNames[i].length + 1);
                }

                let k = response == -1 ? chordNames[i].length : response;
                if (!_absoluteResponses[i][k]) _absoluteResponses[i][k] = 0;
                _absoluteResponses[i][k]++;

                setAbsoluteResponses(_absoluteResponses);
            })
        })
        setCountResponses(_countResponses);

        /* WINNERS */
        let _winners: number[] = _absoluteResponses.map((question: number[], questionN: number) => {
            let max_value = 0;
            let max_index = -1;
            question.forEach((responseCount: number, i) => {
                if (responseCount >= max_value) {
                    max_value = responseCount;
                    max_index = i;
                }
            })
            if (max_index == question.length - 1) max_index = -1;
            return max_index;
        });
        setWinners(_winners);

        /* TONALNESS */
        let tonalnessCounter: number[] = [];
        let tonalnessOtonalityCount: number = 0;
        let tonalnessUtonalityCount: number = 0;
        let tonalness5limitCount: number = 0;
        let tonalness7limitCount: number = 0;
        let tonalness11limitCount: number = 0;
        let tonalnessOctaveCount: number = 0;
        let tonalnessTritaveCount: number = 0;
        let tonalnessAverageCount: number = 0;
        data.forEach((subject, subjectI) => {
            subject.responses.forEach((response: number, questionN: number) => {
                if (response != -1) {

                    let n = Math.floor(questionN / 2) + 1;
                    if (ARR_5_LIMIT.includes(n)) tonalness5limitCount++;
                    if (ARR_7_LIMIT.includes(n)) tonalness7limitCount++;
                    if (ARR_11_LIMIT.includes(n)) tonalness11limitCount++;
                    if (ARR_OCTAVE.includes(n)) tonalnessOctaveCount++;
                    if (ARR_TRITAVE.includes(n)) tonalnessTritaveCount++;
                    if (ARR_ALL.includes(n)) tonalnessAverageCount++;

                    if (tonalnessCounter[questionN]) tonalnessCounter[questionN]++;
                    else tonalnessCounter[questionN] = 1;

                    if (questionN % 2 == 0) tonalnessOtonalityCount++;
                    else tonalnessUtonalityCount++;
                }
            });
        });

        setTonalnessOtonality(100 * tonalnessOtonalityCount / (data.length * 10));
        setTonalnessUtonality(100 * tonalnessUtonalityCount / (data.length * 10));

        setTonalnessOctave(100 * tonalnessOctaveCount / (2 * ARR_OCTAVE.length * data.length));
        setTonalnessTritave(100 * tonalnessTritaveCount / (2 * ARR_TRITAVE.length * data.length));

        setTonalnessAverage(100 * tonalnessAverageCount / (20 * data.length));

        setTonalness5limit(100 * tonalness5limitCount / (2 * ARR_5_LIMIT.length * data.length));
        setTonalness7limit(100 * tonalness7limitCount / (2 * ARR_7_LIMIT.length * data.length));
        setTonalness11limit(100 * tonalness11limitCount / (2 * ARR_11_LIMIT.length * data.length));

        let _tonalness = tonalnessCounter.map((count: number, i: number) => [i, 100 * count / data.length]);
        let _spaceTonalness = [];

        for (let i = 0; i < _tonalness.length / 2; i++) {
            let T = (_tonalness[i * 2][1] + _tonalness[i * 2 + 1][1]) / 2;
            _spaceTonalness.push(T);
            //console.log(spaces[i], T);
        }

        _tonalness.sort((a, b) => b[1] - a[1]);
        setTonalness(_tonalness);
    }, [data]);

    useEffect(() => {
        // What's the model guess for each question?
        let pauArray: number[] = THEORIES.map((theory: number[][]) => {
            let chosen = -1;
            theory.forEach((option: number[], optionN: number) => {
                if (option.includes(PAU)) chosen = optionN;
            })
            return chosen;
        });

        //console.log("------------------------------------- dissonance - votes");
        let txt = "";
        absoluteResponses.forEach((question, i) => {
            for (let option = 0; option < question.length - 1; option++) {
                let percentage = 100 * question[option] / data.length;
                let diss = dissonance[i][option];
                //txt += percentage.toFixed(4) + " " + diss.toFixed(4) + "\n";
                txt += diss.toFixed(4) + "\n";
            }
        })
        //console.log(txt);

        //console.log("------------------------------------- distance - votes");
        txt = "";
        absoluteResponses.forEach((question, i) => {
            for (let option = 0; option < question.length - 1; option++) {
                let percentage = 100 * question[option] / data.length;
                let diss = mod_tenney[i][option];
                //txt += percentage.toFixed(4) + " " + diss.toFixed(4) + "\n";
            }
        })
        //console.log(txt);

        // console.log("------------------------------------- harmonicity - votes");
        txt = "";
        absoluteResponses.forEach((question, i) => {
            for (let option = 0; option < question.length - 1; option++) {
                let percentage = 100 * question[option] / data.length;
                let diss = harmonicity[i][option];
                //txt += percentage.toFixed(4) + " " + diss.toFixed(4) + "\n";
                txt += diss.toFixed(4) + "\n";

            }
        })
        // console.log(txt);

    }, [absoluteResponses]);

    const Table = () => {

        return <div className={styles.Table}>
            <table>
                <thead>
                    <tr>
                        <th></th>
                        <th></th>
                        {spaces.map((item: any, i: number) => <th key={i} colSpan={2}>{item}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {data.map((item: any, i: number) => {
                        const milliseconds = item.date.seconds * 1000 + Math.floor(item.date.nanoseconds / 1000000);
                        const date: Date = new Date(milliseconds);
                        return <tr key={i}>
                            <th>#{i}</th>
                            <th>{date.toLocaleDateString()}</th>
                            {item.responses.map((response: number, j: number) => {
                                return <td key={`${i},${j}`}>{response}</td>
                            })}
                        </tr>
                    })}
                    <tr>
                        <td />
                        <td />
                        {countResponses.map((item: any, i: number) => {
                            return <td key={i}>{item}</td>
                        })}
                    </tr>
                    <tr>
                        <td />
                        <td />
                        {countResponses.map((item: any, i: number) => {
                            return <td key={i}>{(100 * item / data.length).toFixed(0)}%</td>
                        })}
                    </tr>
                </tbody>
            </table>
        </div>
    }

    const getRatio = (i: number, j: number) => {
        if (absoluteResponses.length > 0) {
            let value: number = absoluteResponses[i][j];
            return 100 * value / totalResponses;
        }
        return 0;
    }

    const theoriesToNames = (theories: number[]) => {
        if (!theories) theories = [];
        let theoriesNames = theories.map(theory => { return THEORIES_NAMES[theory].charAt(0) });
        return theoriesNames;
    }

    const Ratios = () => {
        return (
            <div className={styles.Ratios}>
                {chordNames.map((chord: string[], i: number) => {
                    let space = spaces[Math.floor(i / 2)];
                    let noResponseRatio = getRatio(i, chord.length);
                    let tonality = i % 2 == 0 ? "Otonal" : "Utonal";
                    let winner = winners[i];
                    let winningTheories: number[] = THEORIES[i][winner];
                    let winningTheoriesNames = theoriesToNames(winningTheories);
                    return <div key={i} className={styles.chordContainer} >
                        <div className={styles.spaceTag}>[{Math.floor(i / 2) + 1}] {tonality} {space}</div>
                        <div key={i} className={styles.chord}>
                            {chord.map((name: string, j: number) => {
                                let ratio = getRatio(i, j);
                                if (ratio > 0) {
                                    let theories = THEORIES[i][j];
                                    let theoriesNames = theoriesToNames(theories);
                                    return <div
                                        key={j}
                                        className={styles.name}
                                        style={{ width: `${getRatio(i, j)}%`, background: theories?.includes(4) ? 'red' : '' }}
                                    >
                                        {ratio > 0 && <div>{name} {theories.length > 0 && `(${theoriesNames.join(", ")})`} [{absoluteResponses[i][j]}] - {ratio.toFixed(2)}</div>}
                                    </div>
                                }
                            })}
                            {noResponseRatio > 0 &&
                                <div className={styles.name} style={{ width: `${noResponseRatio}%` }}>
                                    {noResponseRatio > 0 && `NS/NC[${absoluteResponses[i][chord.length]}] - ${noResponseRatio.toFixed(2)}`}
                                </div>}
                        </div>
                        <div className={styles.winningTheoriesTag}>{winningTheoriesNames.join(", ")}</div>
                    </div>
                })}
            </div>
        )
    }

    const Distribution = () => {
        let value = "omsi";

        let min_value = 10000;
        let max_value = 0;
        let values: number[] = data.map(item => {
            let v: number = item[value];
            if (v < min_value) min_value = v;
            if (v > max_value) max_value = v;
            return v;
        });
        let min_confidence = 1000;
        let max_confidence = 0;
        let confidences: number[] = data.map(item => {
            let total = 0;
            let count = 0;
            item.responses.forEach((response: number) => {
                total++;
                if (response == -1) count++;
            });
            let confidence = 1 - count / total;
            if (confidence > max_confidence) max_confidence = confidence;
            if (confidence < min_confidence) min_confidence = confidence;
            return confidence;
        });
        return (
            <div className={styles.Distribution}>
                {
                    values.map((value: number, i: number) => {
                        let x = `${300 * (value - min_value) / (max_value - min_value)}px`;
                        let y = `${300 - 300 * confidences[i]}px`;
                        return <div key={i} className={styles.ball} style={{ left: x, top: y }}>
                            {/*({value.toFixed(2)},{confidences[i].toFixed(2)})*/}
                        </div>
                    })
                }
                <div className={styles.label}>Musical Ability / Confidence</div>
            </div>
        )
    }

    const countTheory = (picked: number[], tonality: number): number[] => {

        let count: number[] = [];
        for (let i = 0; i < THEORIES_NAMES.length; i++) count.push(0);
        winners.forEach((winner: number, question: number) => {
            if (picked.includes(1 + Math.floor(question / 2))) {
                let otonal = question % 2 == 0;
                if (tonality == ALL || (tonality == OTONAL && otonal) || (tonality == UTONAL && !otonal)) {
                    let theories: number[] = THEORIES[question][winner];
                    if (theories) theories.forEach(theory => count[theory]++);
                }
            }
        });
        return count;
    }

    interface TheoriesProps {
        picked: number[],
        title: string,
        tonality: number
    }

    const getCount = (picked: number[], tonality: number) => {
        let count = 0;
        winners.forEach((winner: number, i: number) => {

            if (picked.includes(1 + Math.floor(i / 2))) {
                if ((tonality == ALL || tonality == OTONAL) && i % 2 == 0 && winner != -1) count++;
                if ((tonality == ALL || tonality == UTONAL) && i % 2 == 1 && winner != -1) count++;
            }
        })
        return count;
    }

    interface BarProps {
        percentage: string,
        tag: string,
        count?: number
    }

    const Bar = (props: BarProps) => {
        return <div className={styles.theory}>
            <div className={styles.bar}>
                <div className={styles.barContent} style={{ height: props.percentage }} />
            </div>
            <div>{props.tag}</div>
            <div>{props.percentage} </div>
            {props.count != undefined && `[${props.count}]`}
        </div >
    }

    const Theories = (props: TheoriesProps) => {
        let theoriesObj: any[] = [];
        let _theoriesCount = countTheory(props.picked, props.tonality);
        _theoriesCount.forEach((theory: number, i: number) => {
            theoriesObj.push({
                "name": THEORIES_NAMES[i],
                "count": theory
            });
        });
        let count = getCount(props.picked, props.tonality);
        return <div id={styles.Theories}>
            <div className={styles.title}><b>{props.title}</b> ({count})</div>
            <div className={styles.graphic}>
                {theoriesObj.map((obj: any, i: number) => {
                    let ratio = 100 * obj.count / count;
                    let percentage = (ratio).toFixed(2) + "%";
                    return <Bar key={i} percentage={percentage} tag={obj.name} count={obj.count} />
                })}
            </div>
        </div>
    }

    const getConfidence = (arr: number[]): string => {
        let total = 0;
        let countNegative = 0;
        arr.forEach((questionN: any) => {
            data.forEach(subject => {
                total++;
                if (subject.responses[questionN] == -1) countNegative++;
            })
        });
        let confidence = 1 - countNegative / total;
        return (100 * confidence).toFixed(2);
    }

    const Confidence = () => {
        let tags = ["all", "5-limit", "7-limit", "11-limit", "octave", "tritave"];
        let arrays = [ARR_ALL, ARR_5_LIMIT, ARR_7_LIMIT, ARR_11_LIMIT, ARR_OCTAVE, ARR_TRITAVE];

        return <div id={styles.Confidence}>
            <div className={styles.title}><b>Confidence</b></div>
            <div className={styles.graphic}>
                {
                    arrays.map((arr: number[], i: number) => {
                        let percentage = `${getConfidence(arr)}%`;
                        return <div key={i}>
                            <Bar percentage={percentage} tag={tags[i]} />
                        </div>
                    })
                }
            </div>
        </div >
    }

    const getPrecision = (arr: number[]) => {
        let total = 0;
        let countWinner = 0;
        arr.forEach((questionN: any) => {
            data.forEach(subject => {
                total++;
                if (subject.responses[questionN] == winners[questionN]) countWinner++;
            })
        });
        let precision = countWinner / total;
        return (100 * precision).toFixed(2);
    }

    const AnswerPrecision = () => {
        let tags = ["all", "5-limit", "7-limit", "11-limit", "octave", "tritave"];
        let arrays = [ARR_ALL, ARR_5_LIMIT, ARR_7_LIMIT, ARR_11_LIMIT, ARR_OCTAVE, ARR_TRITAVE];

        return <div id={styles.Confidence}>
            <div className={styles.title}><b>Precision</b></div>
            <div className={styles.graphic}>
                {
                    arrays.map((arr: number[], i: number) => {
                        let percentage = `${getPrecision(arr)}%`;
                        return <div key={i}>
                            <Bar percentage={percentage} tag={tags[i]} />
                        </div>
                    })
                }
            </div>
        </div>
    }

    interface FittingProps {
        value: string
    }

    const Fitting = (props: FittingProps) => {
        let value = props.value;

        let min_value = 10000;
        let max_value = 0;
        let values: number[] = data.map(item => {
            let v: number = item[value];
            if (v < min_value) min_value = v;
            if (v > max_value) max_value = v;
            return v;
        });
        max_value = 1200;

        let min_fitting = 1000;
        let max_fitting = 0;
        let fittings: number[] = data.map(item => {
            let total = 0;
            let count = 0;
            item.responses.forEach((response: number, i: number) => {
                total++;
                if (response != -1 && THEORIES[i][response].includes(4)) count++
                //if (response != -1 && THEORIES[i][response].length > 0) count++;
            });
            let fitting = count / total;
            if (fitting > max_fitting) max_fitting = fitting;
            if (fitting < min_fitting) min_fitting = fitting;
            return fitting;
        })

        // PRINT TABLE:
        let table: string = "";
        values.forEach((value: number, i: number) => {
            table += (fittings[i] + "\n");
            //table += (value + " " + fittings[i] + "\n");
        });
        // console.log("PRINT TABLE", props.value);
        // console.log(table);

        let f = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,];

        return (
            <div className={styles.DistributionFitting}>
                {
                    values.map((value: number, i: number) => {
                        let x = `${600 * (value - min_value) / (max_value - min_value)}px`;
                        let y = `${300 - 300 * fittings[i]}px`;
                        return <div key={i} className={styles.ball} style={{ left: x, top: y }}>
                            <div className={styles.ballLabel}>({value.toFixed(2)},{fittings[i].toFixed(2)})</div>
                        </div>
                    })
                }
                {/*
                    props.value == "duration" && f.map((k: number, i: number) => {
                        let x = 100 * i / f.length;
                        let y = 58.81943345069884 + 0.2937011718750001 * x;
                        return (
                            <div
                                key={i}
                                className={styles.line}
                                style={{
                                    left: `${x}%`,
                                    bottom: `${y}%`
                                }}
                            />
                        )
                    })
                */}
                <div className={styles.label}>{props.value} / fitting</div>
            </div>
        )
    }

    const Tonalness = () => {
        return (
            <div id={styles.Tonalness}>
                <div className={styles.graphic}>
                    {tonalness.map((value, i) => {
                        let tag = ` ${value[0] % 2 == 0 ? "o" : "u"} ${spaces[Math.floor(value[0] / 2)]}`;
                        return <Bar key={i} percentage={`${value[1].toFixed(2)}%`} tag={tag} />
                    })}
                </div>
                <div className={styles.graphic}>
                    <Bar percentage={`${tonalnessAverage?.toFixed(2)}%`} tag="Average" />
                    <Bar percentage={`${tonalnessOtonality?.toFixed(2)}%`} tag="Otonal" />
                    <Bar percentage={`${tonalnessUtonality?.toFixed(2)}%`} tag="Utonal" />
                    <Bar percentage={`${tonalness5limit?.toFixed(2)}%`} tag="5-Limit" />
                    <Bar percentage={`${tonalness7limit?.toFixed(2)}%`} tag="7-Limit" />
                    <Bar percentage={`${tonalness11limit?.toFixed(2)}%`} tag="11-Limit" />
                    <Bar percentage={`${tonalnessOctave?.toFixed(2)}%`} tag="Octave" />
                    <Bar percentage={`${tonalnessTritave?.toFixed(2)}%`} tag="Tritave" />
                </div>
            </div>
        )
    }

    return (
        <div id={styles.Results}>
            <table>
                <tr>
                    <th>Chord</th>
                    <th>Intervals</th>
                    <th>Tenney's Harmonic <br/> Distance</th>
                    <th>Barlow's <br/> Harmonicity</th>
                </tr>
                {chordNames.map((inversions: string[], i: number) => {
                    return <>
                        {inversions.map((inversion: string, j: number) => {
                            const factors: number[] = inversion.split(":").map((n: string) => parseInt(n))
                            const space: Space = getSpace(factors)
                            const chord = factorsToChord(factors, space.equave)
                            const superChord = factorsToSuperChord(factors, space.equave)

                            return <tr key={`${i}-${j}`}>
                                <td>{inversion}</td>
                                <td>{chord.map(interval => `${interval.num}/${interval.denom}`).join(", ")}</td>
                                <td>{chordHarmonicDistance(chord).toFixed(4)}</td>
                                <td>{chordHarmonicity(superChord).toFixed(4)}</td>
                            </tr>
                        })}
                        <tr> <td>-</td></tr>
                    </>
                })}
            </table>

            <div className={styles.theoriesContainer}>
                <Theories picked={ARR_ALL} title="All" tonality={ALL} />
                <Theories picked={ARR_5_LIMIT} title="5-limit" tonality={ALL} />
                <Theories picked={ARR_7_LIMIT} title="7-limit" tonality={ALL} />
                <Theories picked={ARR_11_LIMIT} title="11-limit" tonality={ALL} />
            </div>
            
            <div className={styles.theoriesContainer}>
                <Theories picked={ARR_ALL} title="Otonal" tonality={OTONAL} />
                <Theories picked={ARR_ALL} title="Utonal" tonality={UTONAL} />
                <Theories picked={ARR_OCTAVE} title="Octave" tonality={ALL} />
                <Theories picked={ARR_TRITAVE} title="Tritave" tonality={ALL} />
            </div>
            <div className={styles.theoriesContainer}>
                <Confidence />
                <AnswerPrecision />
            </div>
            <div className={styles.theoriesContainer}>
                {/*<Distribution />*/}
                {/*<Fitting value="duration" />*/}
                {/*<Fitting value="omsi" />*/}
            </div>
            <div>
                <h2>Tonalness</h2>
                <Tonalness />
            </div>
            <div className={styles.conclusions}>
                <div><b>Initial conclusions</b></div>
                <ul>
                    <li>Confidence is the same for the octave and the tritave, but precision is actually greater for the tritave = When moving to unexplored harmonies, the response is more uniform.</li>
                    <li>Pau's success rate is similar or equal to the confidence in the different limits = The model's success equals human's confidence.</li>
                    <li>Hi ha propietats musicals que es transmeten d'espai a espai, per tant és possible una teoria musical trans-espacial</li>
                </ul>
            </div>
            <Ratios />
            <Table />
        </div >
    )
}

export default Results;