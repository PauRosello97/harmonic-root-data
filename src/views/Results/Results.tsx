import { useEffect, useState } from "react";
import styles from "./Results.module.css";
import { chordNames, THEORIES } from "../../data/chords";
import json from '../../data/data.json';
import {
    chordHarmonicDistance,
    chordHarmonicity,
    factorsToSpace,
    factorsToChord,
    chordDissonance,
    chordHarmonicEntropy,
    symmetricHarmonicity,
    symmetricHarmonicDistance,
    chordToSuperChord,
    Chord,
    symmetricHarmonicEntropy,
    chordRelativePeriodicity,
    symmetricRelativePeriodicity,
    chordLogarithmicPeriodicity,
    virtualPitch,
    dualVirtualPitch,
    symmetricLogarithmicPeriodicity,
    chordSymmetricDissonance,
    chordDroneValue
} from "../../utils/models";
import { Interval, Space } from "../../utils/models";
import { calculateCorrelation, getRandomNumber } from "../../utils/math";

/*
Comprovar si hi ha alguna relació entre el temperament d'un espai i la confiança.
Perquè 11/8 i 3/2 no es porten bé? Pot coincidir amb el que diu el reviewer
*/

interface AnswerData {
    name: string,
    space: Space,
    chord: Chord,
    superChord: Chord,
    harmonicity: number,
    dissonance: number,
    harmonicDistance: number,
    harmonicEntropy: number,
    symmetricHarmonicDistance: number,
    symmetricHarmonicity: number,
    symmetricEntropy: number,
    relativePeriodicity: number,
    symmetricRelativePeriodicity: number,
    logarithmicPeriodicity: number,
    virtualPitch: number,
    dualVirtualPitch: number,
    random: number,
    droneValue: number,
    symmetricLogarithmicPeriodicity: number,
    symmetricDissonance: number,
    votes: number
}

interface QuestionData {
    answers: AnswerData[],
    space: Space,
    EHarmonicity: number,
    EDissonance: number,
    EHarmonicDistance: number,
    EHarmonicEntropy: number,
    ESymmetricHarmonicDistance: number,
    ESymmetricHarmonicity: number,
    ESymmetricEntropy: number,
    ERelativePeriodicity: number,
    ESymmetricRelativePeriodicity: number,
    ELogarithmicPeriodicity: number,
    EVirtualPitch: number,
    EDualVirtualPitch: number,
    ESymmetricDissonance: number,
    ERandom: number,
    EDroneValue: number,
    ESymmetricLogarithmicPeriodicity: number,
    votes: number
}

function Results() {
    const spaces: string[] = ["[3,5]→2", "[3,7]→2", "[3,11]→2", "[5,7]→2", "[5,11]→2", "[5,7]→3", "[5,11]→3", "[7,11]→3", "[3,5,7]→2", "[3,5,7,11]→2"];
    const [votesData, setVotesData] = useState<any[]>([]);
    const [countResponses, setCountResponses] = useState<number[]>([]);
    const [totalResponses, setTotalResponses] = useState<number>(1);
    const [absoluteResponses, setAbsoluteResponses] = useState<number[][]>([]);
    const [modelData, setModelData] = useState<QuestionData[]>([]);

    const [harmonicDistanceC, setHarmonicDistanceC] = useState<number>(0);
    const [harmonicityC, setHarmonicityC] = useState<number>(0);
    const [dissonanceC, setDissonanceC] = useState<number>(0);
    const [entropyC, setEntropyC] = useState<number>(0);
    const [symmetricDistanceC, setSymmetricDistanceC] = useState<number>(0);
    const [symmetricHarmonicityC, setSymmetricHarmonicityC] = useState<number>(0);
    const [symmetricEntropyC, setSymmetricEntropyC] = useState<number>(0);
    const [relativePeriodicityC, setRelativePeriodicityC] = useState<number>(0);
    const [symmetricRelativePeriodicityC, setSymmetricRelativePeriodicityC] = useState<number>(0)
    const [logarithmicPeriodicityC, setLogarithmicPeriodicityC] = useState<number>(0)
    const [virtualPitchC, setVirtualPitchC] = useState<number>(0)
    const [dualVirtualPitchC, setDualVirtualPitchC] = useState<number>(0)
    const [droneValueC, setDroneValueC] = useState<number>(0)
    const [symmetricLogarithmicPeriodicityC, setSymmetricLogarithmicPeriodicityC] = useState<number>(0)
    const [symmetricDissonanceC, setSymmetricDissonanceC] = useState<number>(0)
    const [randomC, setRandomC] = useState<number>(0)

    useEffect(() => {
        setVotesData(json);

        setModelData(chordNames.map((question: string[], i: number): QuestionData => {
            /* Votes */
            const votes: number[] = Array(question.length).fill(0)
            let totalVotes = 0;
            json.forEach((participant) => {
                const vote = participant.responses[i];
                if (vote !== -1) {
                    votes[vote]++
                    totalVotes++;
                }
            })

            /* Models */
            let space: Space = { equave: 0, dimensions: [] }
            let EHarmonicity = 0
            let EDissonance = 0
            let EHarmonicDistance = 0
            let EHarmonicEntropy = 0
            let ESymmetricHarmonicDistance = 0
            let ESymmetricHarmonicity = 0
            let ESymmetricEntropy = 0
            let ERelativePeriodicity = 0
            let ESymmetricRelativePeriodicity = 0
            let ERandom = 0
            let ELogarithmicPeriodicity = 0
            let EVirtualPitch = 0
            let EDualVirtualPitch = 0
            let EDroneValue = 0
            let ESymmetricDissonance = 0
            let ESymmetricLogarithmicPeriodicity = 0

            const answers = question.map((answer: string, j: number): AnswerData => {

                const factors: number[] = answer.split(":").map((n: string) => parseInt(n))
                space = factorsToSpace(factors)
                const chord = factorsToChord(factors, space.equave)
                const superChord = chordToSuperChord(chord, false)

                const harmonicity = chordHarmonicity(superChord)
                const dissonance = chordDissonance(chord)
                const harmonicDistance = chordHarmonicDistance(chord, space)
                const harmonicEntropy = chordHarmonicEntropy(chord)
                const symmetricHD = symmetricHarmonicDistance(chord, space)
                const symmetricHarm = symmetricHarmonicity(chord, space)
                const symmetricEntropy = symmetricHarmonicEntropy(chord, space)
                const relativePeriodicity = chordRelativePeriodicity(chord)
                const symmRelativePeriodicity = symmetricRelativePeriodicity(chord, space)
                const logarithmicPeriodicity = chordLogarithmicPeriodicity(chord)
                const dualVPitch = dualVirtualPitch(factors)
                const vPitch = virtualPitch(factors)
                const droneValue = chordDroneValue(factors, space)
                const symmLogarithmicPeriodicity = symmetricLogarithmicPeriodicity(chord, space)
                const symmetricDissonance = chordSymmetricDissonance(chord, space)
                const random = getRandomNumber(answer)

                EHarmonicity += harmonicity
                EDissonance += dissonance
                EHarmonicDistance += harmonicDistance
                EHarmonicEntropy += harmonicEntropy
                ESymmetricHarmonicDistance += symmetricHD
                ESymmetricHarmonicity += symmetricHarm
                ESymmetricEntropy += symmetricEntropy
                ERelativePeriodicity += relativePeriodicity
                ESymmetricRelativePeriodicity += symmRelativePeriodicity
                ELogarithmicPeriodicity += logarithmicPeriodicity
                EVirtualPitch += vPitch
                EDualVirtualPitch += dualVPitch
                ERandom += random
                EDroneValue += droneValue
                ESymmetricDissonance += symmetricDissonance
                ESymmetricLogarithmicPeriodicity += symmLogarithmicPeriodicity

                return {
                    name: answer,
                    space,
                    chord,
                    superChord,
                    harmonicity,
                    dissonance,
                    harmonicDistance,
                    harmonicEntropy,
                    symmetricHarmonicDistance: symmetricHD,
                    symmetricHarmonicity: symmetricHarm,
                    symmetricEntropy: symmetricEntropy,
                    relativePeriodicity,
                    symmetricRelativePeriodicity: symmRelativePeriodicity,
                    logarithmicPeriodicity,
                    virtualPitch: vPitch,
                    dualVirtualPitch: dualVPitch,
                    symmetricLogarithmicPeriodicity: symmLogarithmicPeriodicity,
                    symmetricDissonance,
                    droneValue,
                    random,
                    votes: votes[j]
                }
            })

            const questionData: QuestionData = {
                answers,
                space,
                EHarmonicity,
                EDissonance,
                EHarmonicDistance,
                EHarmonicEntropy,
                ESymmetricHarmonicDistance,
                ESymmetricHarmonicity,
                ESymmetricEntropy,
                ERelativePeriodicity,
                ESymmetricRelativePeriodicity,
                ELogarithmicPeriodicity,
                EVirtualPitch,
                EDualVirtualPitch,
                ESymmetricDissonance,
                ERandom,
                EDroneValue,
                ESymmetricLogarithmicPeriodicity,
                votes: totalVotes
            }

            return questionData
        }))
    }, []);

    useEffect(() => {
        interface Coordinate { x: number, y: number }
        const distances: Coordinate[] = []
        const harmonicities: Coordinate[] = []
        const dissonances: Coordinate[] = []
        const entropies: Coordinate[] = []
        const symmetricHarmonicities: Coordinate[] = []
        const symmetricDistances: Coordinate[] = []
        const symmetricEntropies: Coordinate[] = []
        const relativePeriodicities: Coordinate[] = []
        const symmetricRelativePeriodicities: Coordinate[] = []
        const logarithmicPeriodicities: Coordinate[] = []
        const virtualPitchValues: Coordinate[] = []
        const randomValues: Coordinate[] = []
        const dualVirtualPitchValues: Coordinate[] = []
        const droneValues: Coordinate[] = []
        const symmetricLogarithmicPeriodicities: Coordinate[] = []
        const symmetricDissonances: Coordinate[] = []

        modelData.forEach(question => {
            question.answers.forEach(answer => {
                const y = answer.votes / question.votes
                distances.push({ x: answer.harmonicDistance / question.EHarmonicDistance, y })
                harmonicities.push({ x: answer.harmonicity / question.EHarmonicity, y })
                dissonances.push({ x: answer.dissonance / question.EDissonance, y })
                entropies.push({ x: answer.harmonicEntropy / question.EHarmonicEntropy, y })
                symmetricHarmonicities.push({ x: answer.symmetricHarmonicity / question.ESymmetricHarmonicity, y })
                symmetricDistances.push({ x: answer.symmetricHarmonicDistance / question.ESymmetricHarmonicDistance, y })
                symmetricEntropies.push({ x: answer.symmetricEntropy / question.ESymmetricEntropy, y })
                relativePeriodicities.push({ x: answer.relativePeriodicity / question.ERelativePeriodicity, y })
                symmetricRelativePeriodicities.push({ x: answer.symmetricRelativePeriodicity / question.ESymmetricRelativePeriodicity, y })
                logarithmicPeriodicities.push({ x: answer.logarithmicPeriodicity / question.ELogarithmicPeriodicity, y })
                virtualPitchValues.push({ x: answer.virtualPitch / question.EVirtualPitch, y })
                dualVirtualPitchValues.push({ x: answer.dualVirtualPitch / question.EDualVirtualPitch, y })
                droneValues.push({ x: answer.droneValue / question.EDroneValue, y })
                randomValues.push({ x: answer.random / question.ERandom, y })
                symmetricLogarithmicPeriodicities.push({ x: answer.symmetricLogarithmicPeriodicity / question.ESymmetricLogarithmicPeriodicity, y })
                symmetricDissonances.push({ x: answer.symmetricDissonance / question.ESymmetricDissonance, y })
            })
        })

        setHarmonicDistanceC(calculateCorrelation(distances))
        setHarmonicityC(calculateCorrelation(harmonicities))
        setDissonanceC(calculateCorrelation(dissonances))
        setEntropyC(calculateCorrelation(entropies))
        setSymmetricHarmonicityC(calculateCorrelation(symmetricHarmonicities))
        setSymmetricDistanceC(calculateCorrelation(symmetricDistances))
        setSymmetricEntropyC(calculateCorrelation(symmetricEntropies))
        setRelativePeriodicityC(calculateCorrelation(relativePeriodicities))
        setSymmetricRelativePeriodicityC(calculateCorrelation(symmetricRelativePeriodicities))
        setLogarithmicPeriodicityC(calculateCorrelation(logarithmicPeriodicities))
        setVirtualPitchC(calculateCorrelation(virtualPitchValues))
        setDualVirtualPitchC(calculateCorrelation(dualVirtualPitchValues))
        setDroneValueC(calculateCorrelation(droneValues))
        setSymmetricLogarithmicPeriodicityC(calculateCorrelation(symmetricLogarithmicPeriodicities))
        setSymmetricDissonanceC(calculateCorrelation(symmetricDissonances))
        setRandomC(calculateCorrelation(randomValues))

    }, [modelData])

    useEffect(() => {
        setTotalResponses(votesData.length);
        let _countResponses: number[] = new Array(votesData.length);
        let _absoluteResponses: number[][] = new Array(votesData.length);

        chordNames.forEach((chord: string[], i: number) => {
            _absoluteResponses[i] = [];
            chord.forEach(name => _absoluteResponses[i].push(0));
            _absoluteResponses[i].push(0)
        })

        votesData.forEach((person) => {
            person.responses.forEach((response: number, i: number) => {
                if (!_countResponses[i]) _countResponses[i] = 0;
                if (response !== -1) _countResponses[i]++;

                if (!_absoluteResponses[i]) {
                    _absoluteResponses[i] = new Array(chordNames[i].length + 1);
                }

                let k = response === -1 ? chordNames[i].length : response;
                if (!_absoluteResponses[i][k]) _absoluteResponses[i][k] = 0;
                _absoluteResponses[i][k]++;

                setAbsoluteResponses(_absoluteResponses);
            })
        })
        setCountResponses(_countResponses);
    }, [votesData]);

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
                    {votesData.map((item: any, i: number) => {
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
                            return <td key={i}>{(100 * item / votesData.length).toFixed(0)}%</td>
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

    const Ratios = () => {
        return (
            <div className={styles.Ratios}>
                {chordNames.map((chord: string[], i: number) => {
                    let space = spaces[Math.floor(i / 2)];
                    let noResponseRatio = getRatio(i, chord.length);
                    let tonality = i % 2 === 0 ? "Otonal" : "Utonal";
                    return <div key={i} className={styles.chordContainer} >
                        <div className={styles.spaceTag}>[{Math.floor(i / 2) + 1}] {tonality} {space}</div>
                        <div key={i} className={styles.chord}>
                            {chord.map((name: string, j: number) => {
                                let ratio = getRatio(i, j);
                                if (ratio > 0) {
                                    let theories = THEORIES[i][j];
                                    return <div
                                        key={j}
                                        className={styles.name}
                                        style={{
                                            width: `${getRatio(i, j)}%`,
                                            background: theories?.includes(4) ? 'red' : '',
                                            minHeight: '40px',
                                            display: 'flex',
                                            flexDirection: 'row',
                                            alignItems: 'center'
                                        }}
                                    >
                                        {ratio > 10 && <div>{name} - {ratio.toFixed(2)}%</div>}
                                    </div>
                                }
                            })}
                            {noResponseRatio > 0 &&
                                <div
                                    className={styles.name}
                                    style={{
                                        width: `${noResponseRatio}%`, display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center'
                                    }}
                                >
                                    {noResponseRatio > 0 && `NS/NC[${absoluteResponses[i][chord.length]}] - ${noResponseRatio.toFixed(2)}`}
                                </div>}
                        </div>
                    </div>
                })}
            </div>
        )
    }

    const CorrelationTable = () => {
        const CorrelationRow = (props: { tag: string, value: number, symmetric: boolean} ) => {
            return <tr style={{height: '20px'}}>
                <td style={{textAlign: 'right'}}>{props.tag}</td>
                <td style={{width: '400px'}}>
                    <div 
                        style={{
                            height: '100%',
                            width: `${Math.abs(props.value)*100}%`,
                            backgroundColor: props.symmetric ? '#4863A0' : '#728FCE'
                        }}
                    >
                        <div
                            style={{
                                textAlign: 'left',
                                transform: 'translateX(100%)',
                                paddingLeft: '5px'
                            }}
                        >
                            |{props.value.toFixed(4)}|
                        </div>
                    </div>
                </td>
            </tr>
        }

        return <div className={styles.Section}>
            <table>
                <CorrelationRow tag="Symmetric Harmonicity" value={symmetricHarmonicityC} symmetric={true}/>
                <CorrelationRow tag="Symmetric Harmonic Distance" value={symmetricDistanceC} symmetric={true}/>
                <CorrelationRow tag="Symmetric Relative Periodicity" value={symmetricRelativePeriodicityC} symmetric={true} />
                <CorrelationRow tag="Barlow's Harmonicity" value={harmonicityC} symmetric={false} />
                <CorrelationRow tag="Parker's Drone" value={droneValueC} symmetric={false} />
                <CorrelationRow tag="Erlich's Entropy" value={entropyC} symmetric={false} />
                <CorrelationRow tag="Tenney's Harmonic Distance" value={harmonicDistanceC} symmetric={false} />
                <CorrelationRow tag="Stolzenburg's Relative Periodicity" value={relativePeriodicityC} symmetric={false} />
                <CorrelationRow tag="Sethares' Dissonance" value={dissonanceC} symmetric={false} />
                <CorrelationRow tag="Terhardt's Virtual Pitch" value={virtualPitchC} symmetric={false} />
                {/* <CorrelationRow tag="Stolzenburg's Logarithmic Periodicity" value={logarithmicPeriodicityC} symmetric={false} /> */}
                <CorrelationRow tag="Dual Virtual Pitch" value={dualVirtualPitchC} symmetric={false} />
                {/* <CorrelationRow tag="Symmetric Logarithmic Periodicity" value={symmetricLogarithmicPeriodicityC} symmetric={true} /> */}
                <CorrelationRow tag="Symmetric Entropy" value={symmetricEntropyC} symmetric={true} />
            </table>
        </div>
    }

    const ModelValuesTable = () => {
        // Is it displaying the absolute or percentual value?
        const [showPercentage, setShowPercentage] = useState<boolean>(false) 

        return <div className={styles.Section}>

            <div
                style={{ 
                    display: 'flex', 
                    flexDirection: 'row', 
                    cursor: 'pointer', 
                    fontSize: '15px', 
                    marginBottom: '20px',
                    gap: '5px'
                }}
                onClick={() => setShowPercentage(!showPercentage)}
            >
                <div style={{ fontWeight: showPercentage ? 'normal' : 'bold' }}>Absolute</div>
                <div style={{ fontWeight: !showPercentage ? 'normal' : 'bold' }}>Percentage</div>
            </div>

            <table>
                <tr>
                    <th>Chord</th>
                    <th>Intervals</th>
                    <th colSpan={2}>Tenney's <br /> harmonic <br /> distance</th>
                    <th colSpan={2}>Barlow's <br /> harmonicity</th>
                    <th colSpan={2}>Sethares' <br /> dissonance</th>
                    <th colSpan={2}>Erlich's <br /> harmonic <br /> entropy</th>
                    <th colSpan={2}>Terhardt's <br /> virtual <br /> pitch</th>
                    <th colSpan={2}>Dual <br /> virtual <br /> pitch</th>
                    <th colSpan={2}>Carmen <br /> Parker's <br /> drone</th>
                    <th colSpan={2}>Stolzenburg <br /> relative <br /> periodicity</th>
                    {/* <th colSpan={2}>Stolzenburg <br /> logarithmic <br /> periodicity</th> */}
                    <th />
                    <th colSpan={2}>Symmetric <br /> Harmonic <br /> Distance</th>
                    <th colSpan={2}>Symmetric <br /> Harmonicity</th>
                    <th colSpan={2}>Symmetric <br /> Dissonance</th>
                    <th colSpan={2}>Symmetric <br /> Entropy</th>
                    <th colSpan={2}>Symmetric <br /> Relative <br /> Periodicity</th>
                    {/* <th colSpan={2}>Symmetric <br /> Logarithmic <br /> Periodicity</th> */}
                    <th />
                    <th colSpan={2}>Votes</th>
                </tr>
                {modelData.map((question: QuestionData, i: number) => {
                    return <>
                        <tr style={{ fontWeight: 'bold' }}>
                            <td> {`[${question.space.dimensions.join(", ")}]->${question.space.equave}`} </td>
                        </tr>
                        {question.answers.map((answer: AnswerData, j: number) => {

                            const ModelCells = (props: {value: number, total: number, decimals: number}) => {
                                if (showPercentage) return <td colSpan={2} className={styles.b}>{(100 * props.value / props.total).toFixed(1)}%</td>
                                return  <td colSpan={2}>{props.value.toFixed(props.decimals)}</td>
                            }

                            return <tr key={`${i}-${j}`}>
                                <td className={styles.b}>{answer.name}</td>
                                <td>{answer.chord.map((i: Interval) => `${i.num}/${i.denom}`).join(", ")}</td>
                                <ModelCells value={answer.harmonicDistance} total={question.EHarmonicDistance} decimals={4} />
                                <ModelCells value={answer.harmonicity} total={question.EHarmonicity} decimals={4} />
                                <ModelCells value={answer.dissonance} total={question.EDissonance} decimals={4} />
                                <ModelCells value={answer.harmonicEntropy} total={question.EHarmonicEntropy} decimals={4} />
                                <ModelCells value={answer.virtualPitch} total={question.EVirtualPitch} decimals={0} /> {/* Virtual pitch */}
                                <ModelCells value={answer.dualVirtualPitch} total={question.EDualVirtualPitch} decimals={0} /> {/* Dual */}
                                <ModelCells value={answer.droneValue} total={question.EDroneValue} decimals={0} /> {/* Carmen Parker */}
                                <ModelCells value={answer.relativePeriodicity} total={question.ERelativePeriodicity} decimals={4} />
                                {/* <ModelCells value={answer.logarithmicPeriodicity} total={question.ELogarithmicPeriodicity} decimals={4} /> */}
                                <td />
                                <ModelCells value={answer.symmetricHarmonicDistance} total={question.ESymmetricHarmonicDistance} decimals={4} />
                                <ModelCells value={answer.symmetricHarmonicity} total={question.ESymmetricHarmonicity} decimals={4} />
                                <ModelCells value={answer.symmetricDissonance} total={question.ESymmetricDissonance} decimals={4} />
                                <ModelCells value={answer.symmetricEntropy} total={question.ESymmetricEntropy} decimals={4} />
                                <ModelCells value={answer.symmetricRelativePeriodicity} total={question.ESymmetricRelativePeriodicity} decimals={0} />
                                {/* <ModelCells value={answer.symmetricLogarithmicPeriodicity} total={question.ESymmetricLogarithmicPeriodicity} decimals={4} /> */}
                                <td />
                                <td>{answer.votes}</td>
                                <td>{(100 * answer.votes / question.votes).toFixed(2)}%</td>
                            </tr>
                        })}
                        <tr>
                            <td />
                            <td />
                            <td colSpan={2}>Σ = {question.EHarmonicDistance.toFixed(4)}</td>
                            <td colSpan={2}>Σ = {question.EHarmonicity.toFixed(4)}</td>
                            <td colSpan={2}>Σ = {question.EDissonance.toFixed(4)}</td>
                            <td colSpan={2}>Σ = {question.EHarmonicEntropy.toFixed(4)}</td>
                            <td colSpan={2}>Σ = {question.EVirtualPitch.toFixed(0)}</td>
                            <td colSpan={2}>Σ = {question.EDualVirtualPitch.toFixed(0)}</td>
                            <td colSpan={2}>Σ = {question.EDroneValue.toFixed(0)}</td>
                            <td colSpan={2}>Σ = {question.ERelativePeriodicity.toFixed(0)}</td>
                            {/* <td colSpan={2}>Σ = {question.ELogarithmicPeriodicity.toFixed(4)}</td> */}
                            <td />
                            <td colSpan={2}>Σ = {question.ESymmetricHarmonicDistance.toFixed(4)}</td>
                            <td colSpan={2}>Σ = {question.ESymmetricHarmonicity.toFixed(4)}</td>
                            <td colSpan={2}>Σ = {question.ESymmetricDissonance.toFixed(4)}</td>
                            <td colSpan={2}>Σ = {question.ESymmetricEntropy.toFixed(4)}</td>
                            <td colSpan={2}>Σ = {question.ESymmetricRelativePeriodicity.toFixed(4)}</td>
                        </tr>
                    </>
                })}

            </table>
        </div>
    }

    const GraphicCorrelationTable = () => {
        const w = 600
        const h = 600

        const spaceTop = -150
        const spaceBottom = 0

        const ratioToY = (ratio: number) => (h-spaceBottom)*(1-ratio) + spaceTop

        const Model = (props: { a: number, b?: number, tagA: string, tagB?: string }) => {
            const {a, b, tagA, tagB} = props

            const x1 = w*0.35
            const x2 = w*0.65
            const y1 = ratioToY(Math.abs(a))
            const y2 = ratioToY(Math.abs(b ?? 0))

            return <>
                {b && <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke='grey'
                />}
                <circle
                    r={5}
                    fill='black'
                    cx={x1}
                    cy={y1}
                />
                {b && <circle
                    r={5}
                    fill='black'
                    cx={x2}
                    cy={y2}
                />}
                <text x={x1 - 10} y={y1 + 3} textAnchor="end">{tagA}</text>
                <text x={x1 + 10} y={y1 + 3} textAnchor="start">|{a.toFixed(4)}|</text>
                {tagB && <text x={x2 + 10} y={y2 + 3} textAnchor="start">{tagB}</text>}
                {b && <text x={x2 - 10} y={y2 + 3} textAnchor="end">|{b.toFixed(4)}|</text>}
            </>
        }

        return <svg style={{position: 'relative', border: '1px solid black', width: `${w}px`, height: `${h}px` }}>

            <line x1={25} x2={w} y1={ratioToY(0.8)} y2={ratioToY(0.8)} stroke='grey' />
            <line x1={25} x2={w} y1={ratioToY(0.6)} y2={ratioToY(0.6)} stroke='grey' />
            <line x1={25} x2={w} y1={ratioToY(0.4)} y2={ratioToY(0.4)} stroke='grey' />
            <line x1={25} x2={w} y1={ratioToY(0.2)} y2={ratioToY(0.2)} stroke='grey' />
            <line x1={25} x2={w} y1={ratioToY(0.0)} y2={ratioToY(0.0)} stroke='grey' />

            <text x={5} y={ratioToY(0.8)+3}> 0.8 </text>
            <text x={5} y={ratioToY(0.6)+3}> 0.6 </text>
            <text x={5} y={ratioToY(0.4)+3}> 0.4 </text>
            <text x={5} y={ratioToY(0.2)+3}> 0.2 </text>
            <text x={5} y={ratioToY(0.0)+3}> 0.0 </text>

            <text x={w*0.35} y={ratioToY(0.0)+20} textAnchor="middle" style={{ fontWeight: 'bold' }}>Original Models</text>
            <text x={w*0.65} y={ratioToY(0.0)+20} textAnchor="middle" style={{ fontWeight: 'bold' }}>Symmetric Models</text>

            <line x1={w*0.35} x2={w*0.35} y1={ratioToY(0)} y2={0} stroke='grey' strokeDasharray='5px 2px' />
            <line x1={w*0.65} x2={w*0.65} y1={ratioToY(0)} y2={0} stroke='grey' strokeDasharray='5px 2px' />

            <Model a={harmonicityC} b={symmetricHarmonicityC} tagA="Harmonicity" tagB="Symmetric Harmonicity"/>
            <Model a={harmonicDistanceC} b={symmetricDistanceC} tagA="Harmonic Distance" tagB="Symmetric Harmonic Distance"/>
            <Model a={relativePeriodicityC} b={symmetricRelativePeriodicityC} tagA="Relative Periodicity" tagB="Symmetric Relative Periodicity"/>
            <Model a={entropyC} b={symmetricEntropyC} tagA="Harmonic Entropy" tagB="Symmetric Harmonic Entropy"/>
            <Model a={dissonanceC} b={symmetricDissonanceC} tagA="Dissonance" tagB="Symmetric Dissonance"/>
            <Model a={droneValueC}  tagA="Drone" />

            
        </svg>
    }

    return (
        <div id={styles.Results}>
            <GraphicCorrelationTable />
            <CorrelationTable />
            <ModelValuesTable />
            
            <div className={styles.Section}>
                <Ratios />
            </div>
            <div className={styles.Section}>
                <Table />
            </div>
            
        </div >
    )
}

export default Results;