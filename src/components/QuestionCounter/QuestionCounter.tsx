
import styles from "./QuestionCounter.module.css";
import { useState, useEffect } from "react";

interface QuestionCounter {
    question: number,
    total: number
}

function QuestionCounter(props: QuestionCounter) {
    const [blocks, setBlocks] = useState<number[]>([]);

    useEffect(() => {
        let _blocks: number[] = [];
        for (let i = 0; i < props.total + 1; i++)_blocks.push(i);
        setBlocks(_blocks);
    }, [props.total])

    const ProgessBar = () => {

        return <div id={styles.ProgressBar}>
            {blocks.map((block: any, i: number) => {
                return <div key={i} className={props.question >= i ? styles.done : styles.block} />
            })}
        </div>
    }

    return (
        <div id={styles.QuestionCounter}>
            <b>Question {props.question}/{props.total}</b>
            <ProgessBar />
        </div>
    )
}

export default QuestionCounter;