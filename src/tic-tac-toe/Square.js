import React from 'react';
import { Button, Icon } from 'semantic-ui-react'

function Square(props) {
    return (
        <Button icon size='huge' onClick={props.onClick}>
            {(props.value === 'x') ? <Icon name='close' /> : ((props.value === 'o') ? <Icon name='circle outline' /> : <Icon />) }
        </Button>
    );
}

export default Square