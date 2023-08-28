import React, { useState, useEffect } from 'react';
import styles from './Survey.module.css';
import Chord from "../../components/Chord/Chord";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faArrowLeft, faThumbsUp, faVolumeUp } from '@fortawesome/free-solid-svg-icons'
import chords, { ChordStruct } from "../../data/chords";
import QuestionCounter from '../../components/QuestionCounter/QuestionCounter';
import Form from "../../components/Form/Form";

function Survey() {
    const [data, setData] = useState<number[]>(new Array(chords.length));
    const [displaying, setDisplaying] = useState<number>(0);
    const [nextEnabled, setNextEnabled] = useState<boolean>(false);
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [formOK, setFormOK] = useState<boolean>(false);
    const [directions, setDirections] = useState<boolean[]>([]);
    const [OMSI, setOMSI] = useState<number>(0);
    const [startTime, setStartTime] = useState<Date>();
    const [email, setEmail] = useState<string>("");

    useEffect(() => {
        if (formOK) setStartTime(new Date());
    }, [formOK]);

    useEffect(() => {
        let _directions: boolean[] = [];
        for (let i = 0; i < 40; i++) _directions.push(Math.random() > .5);
        setDirections(_directions);
    }, []);

    useEffect(() => {
        setNextEnabled(data[displaying] !== undefined);
    }, [data, displaying]);

    const updateData = (position: number, value: number) => {
        let newData = [...data];
        newData[position] = value;
        setData(newData);
    }

    const clickPrevious = () => {
        if (displaying > 0) setDisplaying(displaying - 1);
    }

    const clickNext = () => {
        setDisplaying(displaying + 1);
    }

    const submit = () => {
        let duration = 0;
        if (startTime) duration = (new Date()).valueOf() - startTime?.valueOf();
        console.log(duration)
        setSubmitted(true)
        // sendData(data, OMSI, duration, email).then((response: any);
    }

    const Thanks = () => {
        return (
            <div id={styles.Survey}>
                <div>{"Thanks for participating"}</div>
                <div className={styles.signature}>{"Pau Roselló"}</div>
                <div>{data.join(",")}</div>
            </div>
        )
    }

    const Survey = () => {
        return (
            <div id={styles.Survey}>
                <div className={styles.topContainer}>
                    <QuestionCounter question={displaying + 1} total={chords.length} />
                    <div className={styles.explanation}>
                        <b>Select the most "harmonic, consonant (less dissonant), stable, fundamental, basic" chord.</b> If you can't choose one, select "None of them".
                    </div>
                </div>
                <div className={styles.horizontalContainer}>
                    <div className={styles.buttonContainer}>
                        {displaying > 0 && <div className={styles.previousButton} onClick={clickPrevious}>
                            <FontAwesomeIcon icon={faArrowLeft} />
                            Previous
                        </div>}
                    </div>
                    <div className={styles.chordContainer}>
                        {chords.map((chord: ChordStruct, i: number) => {
                            if (i === displaying) {
                                return <Chord key={i} n={i} src={chord.src} direction={directions[i]} updateData={(value: number) => updateData(i, value)} data={data} />
                            }
                        })}
                    </div>
                    <div className={styles.buttonContainer}>
                        {nextEnabled && displaying < (chords.length - 1) && <div className={styles.nextButton} onClick={clickNext}>
                            Next
                            <FontAwesomeIcon icon={faArrowRight} />
                        </div>}
                        {nextEnabled && displaying ===(chords.length - 1) && <div className={styles.submitButton} onClick={submit}>
                            Submit
                            <FontAwesomeIcon icon={faThumbsUp} />
                        </div>}
                    </div>
                </div>

                <div className={styles.instructions}>Click <FontAwesomeIcon icon={faVolumeUp} /> to play the sound.</div>
            </div >
        );
    }

    if (!formOK) {
        return <Form setFormOK={setFormOK} setOMSI={setOMSI} OMSI={OMSI} email={email} setEmail={setEmail} />
    } else if (submitted) {
        return <Thanks />
    } else {
        return <Survey />
    }

}

export default Survey;
