import React, {useEffect, useState} from 'react';
import {Form} from 'react-bootstrap';
const closeImg = require('./Close-512.png');

const CostNode = (props) => {

    const [costType, setCostType] = useState(props.costType ? props.costType : '');
    const [costAmount, setCostAmount] = useState(props.costAmount ? props.costAmount : '0');
    const [costID] = useState(props.costID);

    //Regex Pattern for Money Input
    const pattern = /^[0-9.,]+$/;

    //Updates values when costType or costAmount are changed
    useEffect(() => {
        props.onChange(costID, costType, costAmount + '');
    }, [costType, costAmount]);

    return (
        <div className={'costInfo'}>
            <Form.Control
                type="text"
                className={'costOfLivingType'}
                value={costType}
                onChange={(e) => setCostType(e.target.value)}
            />
            <div className={'amountBox'}>
                <Form.Control
                    type="text"
                    className={'costOfLivingInput'}
                    value={costAmount}
                    onChange={(e) => {
                        if (e.target.value.match(pattern)) {
                            setCostAmount(e.target.value);
                        } else if (e.target.value.length === 0) {
                            setCostAmount(0);
                        }
                    }}
                />
                <img src={closeImg}  alt={'Delete Cost Of Living'} onClick={() => props.removeNode(costID)} style={{width: '10px', height: '10px'}}/>
            </div>
        </div>
    );
};

export default CostNode;
