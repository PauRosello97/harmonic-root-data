import { useState, useEffect } from "react";
import Inversion from "../Inversion/Inversion";
import styles from "./Chord.module.css";
import RoundCheck from "../RoundCheck/RoundCheck";

interface ChordProps {
    src: any[],
    updateData: Function,
    data: number[],
    n: number,
    direction: boolean
}

const chars: string[] = ["A", "B", "C", "D", "E", "F"];

function Chord(props: ChordProps) {
    const [selected, setSelected] = useState<number>();

    useEffect(() => {
        setSelected(props.data[props.n]);
    }, [props.data]);

    const onClick = (i: number) => {
        setSelected(i);
        props.updateData(i);
    }

    return (
        <div id={styles.Chord}>
            <div className={props.direction ? styles.row : styles.reverseRow}>
                {props.src.map((inversion: any, i: number) => {
                    let isSelected = selected == i;
                    return <div onClick={() => onClick(i)} key={i} className={isSelected ? styles.selectedInversion : styles.inversionWrapper}>
                        <Inversion src={inversion} char={chars[i]} />
                        {/*<div className={isSelected ? styles.selectedSelector : styles.inversionSelector} >{chars[i]}</div>*/}
                        <RoundCheck selected={isSelected} />
                    </div>
                })}
            </div>
            <div className={selected == -1 ? styles.selectedNoResponse : styles.noResponse} onClick={() => onClick(-1)}>None of them</div>
        </div >
    )
}

export default Chord;