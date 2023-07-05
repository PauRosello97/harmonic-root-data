import { useState, useEffect } from "react";
import styles from "./Form.module.css";
import omsi from "../../utils/omsi";

interface FormProps {
    setFormOK: Function,
    OMSI: number,
    setOMSI: Function,
    email: string,
    setEmail: Function
}

interface Question {
    question: string,
    comment?: string,
    answers: string[]
}

const questionAge = "1. How old are you today?";
const questionCommencement = `2. At what age did you begin sustained musical activity?`;
const commentCommencement = `"Sustained musical activity" might include regular music lessons or daily musical practice that lasted for at least three consecutive years. If you have never been musically active for a sustained time period, answer with zero.`;
const questionPrivateLessons = `3. How many years of private music lessons have you received?`;
const commentPrivateLessons = `If you have received lessons on more than one instrument, including voice, give the number of years for the one instrument/voice you've studied longest.
If you have never received private lessons, answer with zero.`;
const questionPractice = `4. For how many years have you engaged in regular, daily practice of a musical instrument or singing?`;
const commentPractice = `"Daily" can be defined as 5 to 7 days per week. A "year" can be defined as 10 to 12 months. If you have never practiced regularly, or have practiced regularly for fewer than 10 months, answer with zero.`;

const questions: Question[] = [
    {
        question: "5. Which category comes nearest to the amount of time you currently spend practicing an instrument (or voice)?",
        comment: "Count individual practice time only; no group rehearsals.",
        answers: [
            "I rarely or never practice singing or playing an instrument",
            "About 1 hour per month",
            "About 1 hour per week",
            "About 15 minutes per day",
            "About 1 hour per day",
            "More than 2 hours per day"
        ]
    },
    {
        question: "6. Have you ever enrolled in any music courses offered at college (or university)?",
        answers: ["No - go to question 8", "Yes"]
    },
    {
        question: "7. (If Yes) How much college-level coursework in music have you completed?",
        comment: "If more than one category applies, select your most recently completed level.",
        answers: [
            "None",
            "1 or 2 NON-major courses (e.g., music appreciation, playing or singing in an ensemble)",
            "3 or more courses for NON-majors",
            "An introductory or preparatiory music program for Bachelor's level work",
            "1 year of full-time coursework in a Bachelor of Music degree program (or equivalent)",
            "2 years of full-time coursework in a Bachelor of Music degree program (or equivalent)",
            "3 or more years of full-time coursework in a Bachelor of Music degree program (or equivalent)",
            "Completion of a Bachelor of Music degree program (or equivalent)",
            "One or more graduate-level music courses or degrees"
        ]
    },
    {
        question: "8. Which option best describes your experience at composing music?",
        answers: [
            "Have never composed any music",
            "Have composed bits and pieces, but have never completed a piece of music",
            "Have composed one or more completed pieces, but none have been performed",
            "Have composed pieces as assignments or projects for one or more music classes; one or more of my pieces have been performed and/or recorded within the context of my educational environment",
            "Have composed pieces that have been performed for a local audience",
            "Have composed pieces that have been performed for a regional or national audience (e.g., nationally known performer or ensemble, major concert venue, broadly distributed recording)"
        ]
    },
    {
        question: "9. To the best of your memory, how many live concerts (or any style, with free or paid admission) have you attended as an audience member in the past 12 months?",
        comment: "Please do not include regular religious services in your count, but you may include special musical productions or events.",
        answers: [
            "None",
            "1 - 4",
            "5 - 8",
            "9 - 12",
            "13 or more"
        ]
    },
    {
        question: "10. Which title best describes you?",
        answers: [
            "Nonmusician",
            "Music-loving nonmusician",
            "Amateur musician",
            "Serious amateur musician",
            "Semiprofessional musician",
            "Professional musician"
        ]
    }
]

function Form(props: FormProps) {

    const [responses, setResponses] = useState<number[]>([0, 0, 0, 0, 0, 0, 0, 0, 0]);
    const [responded, setResponded] = useState<boolean[]>([false, true, true, true, false, false, false, false, false]);
    const [age, setAge] = useState<number>(0);
    const [commencement, setCommencement] = useState<number>(0);
    const [privateLessons, setPrivateLessons] = useState<number>(0);
    const [practice, setPractice] = useState<number>(0);

    useEffect(() => {
        props.setOMSI(omsi(responses));
    }, [responses])

    const formReady = () => {
        let count = 0;
        responded.forEach(x => { if (x) count++ });
        return count > 8;
    }

    useEffect(() => updateResponses(0, age), [age]);
    useEffect(() => updateResponses(1, commencement), [commencement]);
    useEffect(() => updateResponses(2, privateLessons), [privateLessons]);
    useEffect(() => updateResponses(3, practice), [practice]);

    const updateResponses = (i: number, x: number) => {
        let newResponses = [...responses];
        let newResponded = [...responded];
        newResponses[i] = x;
        newResponded[i] = true;
        setResponses(newResponses);
        setResponded(newResponded);
    }

    const onChange = (question: number, answer: number, disabled: boolean) => {
        if (!disabled) {
            question = question + 4;
            if ((question + 1) == 7) answer++;
            if ((question + 1) > 6) question--;
            updateResponses(question, answer);
        }
    }

    const updateAge = (e: any) => {
        let value: number = e.target.value;
        if (value > 100) value = 115;
        if (value < 0) value = 0;
        setAge(value);
    }

    const updateCommencement = (e: any) => {
        let value: number = e.target.value;
        if (value > 100) value = 115;
        setCommencement(value);
    }

    return (
        <div id={styles.Survey}>
            <div className={styles.introduction}>
                This is a music perception study.
                First, you're asked to fill out this form that evaluates your musical ability, and then, you'll be asked to listen to different sound samples and choose one.
                You'll need <b>10 minutes</b> in total.
            </div>
            <form>
                <div className={styles.formQuestion}>
                    <div><b>{questionAge}</b></div>
                    <input type="number" min="0" max="100" value={age} onChange={updateAge} />
                    {` age in years`}
                </div>
                <div className={styles.formQuestion}>
                    <div><b>{questionCommencement}</b></div>
                    <div className={styles.comment}>{commentCommencement}</div>
                    <input type="number" min="0" max="100" value={commencement} onChange={updateCommencement} />
                    {` age at start of sustained musical activity`}
                </div>
                <div className={styles.formQuestion}>
                    <div><b>{questionPrivateLessons}</b></div>
                    <div className={styles.comment}>{commentPrivateLessons}</div>
                    <input type="number" min="0" max="100" value={privateLessons} onChange={e => setPrivateLessons(parseInt(e.target.value))} />
                    {` years of private lessons`}
                </div>
                <div className={styles.formQuestion}>
                    <div><b>{questionPractice}</b></div>
                    <div className={styles.comment}>{commentPractice}</div>
                    <input type="number" min="0" max="100" value={practice} onChange={e => setPractice(parseInt(e.target.value))} />
                    {` years of regular practice`}
                </div>

                {questions.map((question: Question, i: number) => {
                    let disabled = i == 2 && responses[5] == 0;
                    return <div key={i} className={disabled ? styles.disabledQuestion : styles.formQuestion}>
                        <b>{question.question}</b>
                        <div className={styles.comment}>{question.comment}</div>
                        <div className={styles.answers}>
                            {question.answers.map((answer: string, j: number) => {
                                return (
                                    <div key={j}>
                                        <input type="radio" name={`${i}`} onChange={() => onChange(i, j, disabled)} />
                                        {answer}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                })}
            </form>
            {formReady() && <div className={styles.startButton} onClick={() => props.setFormOK(true)}>
                Start
            </div>}
            {!formReady() && <div className={styles.disabledButton}>
                Start
            </div>}
            {<div className={styles.buttonComment}>
                {!formReady() && `* Answer all questions to start`}
            </div>}
        </div>
    )
}

export default Form;