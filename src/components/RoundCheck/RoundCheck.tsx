import styles from "./RoundCheck.module.css";


interface RoundCheckProps {
    selected: boolean
}

function RoundCheck(props: RoundCheckProps) {
    return (
        <div id={styles.RoundCheck}>
            {props.selected && <div id={styles.smallBall} />}
        </div>
    )
}

export default RoundCheck;