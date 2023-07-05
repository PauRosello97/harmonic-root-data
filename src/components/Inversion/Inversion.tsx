import styles from "./Inversion.module.css"
import { Howl, Howler } from 'howler';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faVolumeUp } from '@fortawesome/free-solid-svg-icons'

interface InterfaceProps {
    src: any,
    char: string
}

function Inversion(props: InterfaceProps) {
    var soundA = new Howl({
        src: [props.src],
        volume: 3
    });
    const onClick = (e: any) => {
        soundA.play();
        e.stopPropagation();
    }

    return (
        <div id={styles.Inversion} onClick={(e) => onClick(e)}>
            <FontAwesomeIcon icon={faVolumeUp} />
        </div>
    )
}

export default Inversion;